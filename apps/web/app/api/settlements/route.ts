import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { settlements, users } from "@/db/models/schema";
import { eq, or, and } from "drizzle-orm";
import { settlementFiltersSchema, createSettlementSchema } from "@/lib/api/settlement-schemas";
import { isValidUUID } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse filters manually to avoid schema issues
    const groupIdParam = searchParams.get("groupId");
    const statusParam = searchParams.get("status");
    const directionParam = searchParams.get("direction");
    
    const filters: {
      groupId?: string;
      status?: "pending" | "completed" | "cancelled";
      direction?: "owed" | "owing";
    } = {};
    
    if (groupIdParam && isValidUUID(groupIdParam)) {
      filters.groupId = groupIdParam;
    }
    
    if (statusParam && ["pending", "completed", "cancelled"].includes(statusParam)) {
      filters.status = statusParam as "pending" | "completed" | "cancelled";
    }
    
    if (directionParam && ["owed", "owing"].includes(directionParam)) {
      filters.direction = directionParam as "owed" | "owing";
    }

    // Build where conditions
    const conditions = [];

    // User must be involved (either owes or is owed)
    // If direction filter is set, use that instead of the general or condition
    if (filters.direction === "owed") {
      conditions.push(eq(settlements.toUserId, userId));
    } else if (filters.direction === "owing") {
      conditions.push(eq(settlements.fromUserId, userId));
    } else {
      conditions.push(or(eq(settlements.fromUserId, userId), eq(settlements.toUserId, userId)));
    }

    // Apply filters
    if (filters.groupId) {
      conditions.push(eq(settlements.groupId, filters.groupId));
    }

    if (filters.status) {
      conditions.push(eq(settlements.status, filters.status));
    }

    // Build where clause - use and() only if we have multiple conditions
    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

    // Fetch settlements with user details
    const settlementsList = await db.query.settlements.findMany({
      where: whereClause,
      with: {
        fromUser: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        toUser: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        receipt: {
          columns: {
            id: true,
            merchantName: true,
            purchaseDate: true,
            totalAmount: true,
          },
        },
        group: {
          columns: {
            id: true,
            name: true,
            emoji: true,
          },
        },
      },
      orderBy: (settlements, { desc }) => [desc(settlements.createdAt)],
    });

    return NextResponse.json({ settlements: settlementsList });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid filter parameters", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error fetching settlements:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch settlements", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSettlementSchema.parse(body);

    // Verify users exist
    const fromUser = await db.query.users.findFirst({
      where: eq(users.id, validatedData.fromUserId),
    });

    const toUser = await db.query.users.findFirst({
      where: eq(users.id, validatedData.toUserId),
    });

    if (!fromUser || !toUser) {
      return NextResponse.json(
        { error: "Invalid user IDs" },
        { status: 400 }
      );
    }

    // Create settlement
    const [newSettlement] = await db
      .insert(settlements)
      .values({
        receiptId: validatedData.receiptId || null,
        groupId: validatedData.groupId || null,
        fromUserId: validatedData.fromUserId,
        toUserId: validatedData.toUserId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        notes: validatedData.notes || null,
        status: "pending",
      })
      .returning();

    // Fetch with relations
    const settlementWithUsers = await db.query.settlements.findFirst({
      where: eq(settlements.id, newSettlement.id),
      with: {
        fromUser: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        toUser: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        receipt: {
          columns: {
            id: true,
            merchantName: true,
            purchaseDate: true,
            totalAmount: true,
          },
        },
        group: {
          columns: {
            id: true,
            name: true,
            emoji: true,
          },
        },
      },
    });

    return NextResponse.json({ settlement: settlementWithUsers }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating settlement:", error);
    return NextResponse.json(
      { error: "Failed to create settlement" },
      { status: 500 }
    );
  }
}

