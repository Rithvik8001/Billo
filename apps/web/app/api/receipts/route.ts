import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, users, groupMembers, itemAssignments, receiptItems } from "@/db/models/schema";
import { eq, desc, or, and, inArray } from "drizzle-orm";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, imagePublicId, thumbnailUrl } = body;

    // Validate required fields
    if (!imageUrl || !imagePublicId) {
      return Response.json(
        { error: "Missing required fields: imageUrl and imagePublicId" },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    const user = await currentUser();
    if (user) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!existingUser) {
        await db.insert(users).values({
          id: userId,
          clerkUserId: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          imageUrl: user.imageUrl || null,
        });
      }
    }

    // Create receipt record
    const [receipt] = await db
      .insert(receipts)
      .values({
        userId,
        imageUrl,
        imagePublicId,
        thumbnailUrl: thumbnailUrl || null,
        status: "pending",
      })
      .returning();

    return Response.json(receipt, { status: 201 });
  } catch (error) {
    console.error("Error creating receipt:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("Error details:", errorDetails);
    return Response.json(
      {
        error: "Failed to create receipt",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // Validate status filter
    const validStatuses = [
      "pending",
      "uploading",
      "processing",
      "completed",
      "failed",
    ] as const;
    type ReceiptStatus = (typeof validStatuses)[number];

    // Get all group IDs the user belongs to
    const userGroups = await db.query.groupMembers.findMany({
      where: eq(groupMembers.userId, userId),
      columns: { groupId: true },
    });
    const groupIds = userGroups.map((gm) => gm.groupId);

    // Get all receipt IDs where user has item assignments
    const userAssignments = await db.query.itemAssignments.findMany({
      where: eq(itemAssignments.userId, userId),
      columns: { receiptItemId: true },
      with: {
        item: {
          columns: { receiptId: true },
        },
      },
    });
    const receiptIdsWithAssignments = [
      ...new Set(userAssignments.map((a) => a.item.receiptId)),
    ];

    // Build access conditions: owner OR group member OR has assignments
    const accessConditions = [eq(receipts.userId, userId)];

    if (groupIds.length > 0) {
      accessConditions.push(inArray(receipts.groupId, groupIds));
    }

    if (receiptIdsWithAssignments.length > 0) {
      accessConditions.push(inArray(receipts.id, receiptIdsWithAssignments));
    }

    // Build WHERE conditions combining access control and status filter
    const whereConditions = [or(...accessConditions)];

    // Apply status filter if provided and valid
    if (statusFilter && validStatuses.includes(statusFilter as ReceiptStatus)) {
      whereConditions.push(eq(receipts.status, statusFilter as ReceiptStatus));
    }

    // Build query with access control and status filter
    const userReceipts = await db
      .select()
      .from(receipts)
      .where(and(...whereConditions))
      .orderBy(desc(receipts.createdAt));

    return Response.json({
      receipts: userReceipts,
      total: userReceipts.length,
    });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return Response.json(
      { error: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}
