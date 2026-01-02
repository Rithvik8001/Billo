import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, receiptItems, itemAssignments } from "@/db/models/schema";
import { eq, inArray } from "drizzle-orm";
import { createAssignmentsSchema } from "@/lib/api/assignment-schemas";

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
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
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

    const { assignments } = validation.data;

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

    // Perform transaction: delete existing + insert new + update status
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

      // 3. Update receipt status to completed
      await tx
        .update(receipts)
        .set({
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(receipts.id, receiptId));
    });

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
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
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

    if (itemIds.length === 0) {
      return NextResponse.json({ assignments: [] });
    }

    // Fetch all assignments for these items
    const assignments = await db.query.itemAssignments.findMany({
      where: inArray(itemAssignments.receiptItemId, itemIds),
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

    return NextResponse.json({ assignments });
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
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
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
