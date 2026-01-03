import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import {
  receipts,
  receiptItems,
  itemAssignments,
  groupMembers,
} from "@/db/models/schema";
import { eq, inArray, and } from "drizzle-orm";
import { createAssignmentsSchema } from "@/lib/api/assignment-schemas";
import { calculateSettlements } from "@/lib/settlement-helpers";
import { calculatePersonTotals } from "@/lib/assignment-helpers";
import type { GroupMember } from "@/lib/assignment-types";
import { isValidUUID } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const receiptId = id;

    if (!isValidUUID(receiptId)) {
      return NextResponse.json(
        { error: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    // Verify receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return NextResponse.json(
        { error: "Access denied to this receipt" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createAssignmentsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid assignment data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { assignments, groupId } = validation.data;

    // Get all items for this receipt
    const items = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
    });

    const itemIds = new Set(items.map((item) => item.id));

    // Validate that all assignment itemIds belong to this receipt
    const invalidItems = assignments.filter(
      (a) => !itemIds.has(a.receiptItemId)
    );

    if (invalidItems.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid items",
          details: `Items ${invalidItems
            .map((a) => a.receiptItemId)
            .join(", ")} do not belong to this receipt`,
        },
        { status: 400 }
      );
    }

    // Get group members if groupId is provided
    let groupMembersList: GroupMember[] = [];
    if (groupId) {
      const members = await db.query.groupMembers.findMany({
        where: eq(groupMembers.groupId, groupId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      });
      groupMembersList = members.map((m) => ({
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        imageUrl: m.user.imageUrl,
        role: m.role,
        joinedAt: m.joinedAt,
      }));
    }

    // Perform transaction: delete existing + insert new + update status + generate settlements
    await db.transaction(async (tx) => {
      // 1. Delete existing assignments for all items in this receipt
      const itemIdsArray = Array.from(itemIds);
      if (itemIdsArray.length > 0) {
        await tx
          .delete(itemAssignments)
          .where(inArray(itemAssignments.receiptItemId, itemIdsArray));
      }

      // 2. Batch insert new assignments
      if (assignments.length > 0) {
        await tx.insert(itemAssignments).values(
          assignments.map((a) => ({
            receiptItemId: a.receiptItemId,
            userId: a.userId,
            splitType: a.splitType,
            splitValue: a.splitValue,
            calculatedAmount: a.calculatedAmount,
          }))
        );
      }

      // 3. Update receipt status to completed and set groupId
      await tx
        .update(receipts)
        .set({
          status: "completed",
          groupId: groupId || null,
          updatedAt: new Date(),
        })
        .where(eq(receipts.id, receiptId));
    });

    // 4. Generate settlements (outside transaction to avoid deadlocks)
    if (groupId && groupMembersList.length > 0 && assignments.length > 0) {
      // Build assignment map for calculation
      const assignmentMap = new Map<string, Set<string>>();
      assignments.forEach((a) => {
        const existing =
          assignmentMap.get(a.receiptItemId) || new Set<string>();
        existing.add(a.userId);
        assignmentMap.set(a.receiptItemId, existing);
      });

      // Calculate person totals
      const personTotals = calculatePersonTotals(
        items.map((item) => ({
          id: item.id,
          totalPrice: item.totalPrice,
        })),
        assignmentMap,
        groupMembersList,
        receipt.tax
      );

      // Generate settlements
      await calculateSettlements(receiptId, userId, personTotals, groupId);
    }

    return NextResponse.json({
      success: true,
      count: assignments.length,
    });
  } catch (error) {
    console.error("Error saving assignments:", error);
    return NextResponse.json(
      { error: "Failed to save assignments" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/receipts/[id]/assignments
 * Fetch existing assignments for a receipt
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const receiptId = id;

    if (!isValidUUID(receiptId)) {
      return NextResponse.json(
        { error: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    // Verify receipt exists and check access
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Check access: owner, group member, or has item assignments
    const isOwner = receipt.userId === userId;
    let hasAccess = isOwner;

    // Check if user is a member of the receipt's group
    if (!hasAccess && receipt.groupId) {
      const groupMember = await db.query.groupMembers.findFirst({
        where: and(
          eq(groupMembers.groupId, receipt.groupId),
          eq(groupMembers.userId, userId)
        ),
      });
      hasAccess = !!groupMember;
    }

    // Check if user has item assignments on this receipt
    if (!hasAccess) {
      const receiptItemsList = await db.query.receiptItems.findMany({
        where: eq(receiptItems.receiptId, receiptId),
        columns: { id: true },
      });

      if (receiptItemsList.length > 0) {
        const itemIds = receiptItemsList.map((item) => item.id);
        const assignment = await db.query.itemAssignments.findFirst({
          where: and(
            eq(itemAssignments.userId, userId),
            inArray(itemAssignments.receiptItemId, itemIds)
          ),
        });
        hasAccess = !!assignment;
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this receipt" },
        { status: 403 }
      );
    }

    // Get all items for this receipt
    const items = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
    });

    const itemIds = items.map((item) => item.id);

    if (itemIds.length === 0) {
      return NextResponse.json({ assignments: [], isOwner });
    }

    // Fetch assignments - owners see all, non-owners see only their own
    const assignments = await db.query.itemAssignments.findMany({
      where: isOwner
        ? inArray(itemAssignments.receiptItemId, itemIds)
        : and(
            inArray(itemAssignments.receiptItemId, itemIds),
            eq(itemAssignments.userId, userId)
          ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        item: {
          columns: {
            id: true,
            name: true,
            totalPrice: true,
          },
        },
      },
    });

    return NextResponse.json({ assignments, isOwner });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/receipts/[id]/assignments
 * Reset/clear all assignments for a receipt
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const receiptId = id;

    if (!isValidUUID(receiptId)) {
      return NextResponse.json(
        { error: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    // Verify receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return NextResponse.json(
        { error: "Access denied to this receipt" },
        { status: 403 }
      );
    }

    // Get all items for this receipt
    const items = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
    });

    const itemIds = items.map((item) => item.id);

    // Delete all assignments for these items
    if (itemIds.length > 0) {
      await db
        .delete(itemAssignments)
        .where(inArray(itemAssignments.receiptItemId, itemIds));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assignments:", error);
    return NextResponse.json(
      { error: "Failed to delete assignments" },
      { status: 500 }
    );
  }
}
