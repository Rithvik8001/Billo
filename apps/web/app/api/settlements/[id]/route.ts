import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { settlements } from "@/db/models/schema";
import { eq, and, or } from "drizzle-orm";
import { updateSettlementSchema } from "@/lib/api/settlement-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const settlementId = parseInt(id, 10);

    if (isNaN(settlementId)) {
      return NextResponse.json(
        { error: "Invalid settlement ID" },
        { status: 400 }
      );
    }

    // Fetch settlement - user must be involved
    const settlement = await db.query.settlements.findFirst({
      where: and(
        eq(settlements.id, settlementId),
        or(eq(settlements.fromUserId, userId), eq(settlements.toUserId, userId))
      ),
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

    if (!settlement) {
      return NextResponse.json(
        { error: "Settlement not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ settlement });
  } catch (error) {
    console.error("Error fetching settlement:", error);
    return NextResponse.json(
      { error: "Failed to fetch settlement" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const settlementId = parseInt(id, 10);

    if (isNaN(settlementId)) {
      return NextResponse.json(
        { error: "Invalid settlement ID" },
        { status: 400 }
      );
    }

    // Verify settlement exists and user is involved
    const existingSettlement = await db.query.settlements.findFirst({
      where: and(
        eq(settlements.id, settlementId),
        or(eq(settlements.fromUserId, userId), eq(settlements.toUserId, userId))
      ),
    });

    if (!existingSettlement) {
      return NextResponse.json(
        { error: "Settlement not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateSettlementSchema.parse(body);

    // Update settlement
    const updateData: {
      status: "pending" | "completed" | "cancelled";
      settledAt?: Date | null;
      notes?: string | null;
      updatedAt: Date;
    } = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    // Set settledAt when marking as completed
    if (validatedData.status === "completed" && existingSettlement.status !== "completed") {
      updateData.settledAt = new Date();
    } else if (validatedData.status !== "completed") {
      updateData.settledAt = null;
    }

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes || null;
    }

    const [updatedSettlement] = await db
      .update(settlements)
      .set(updateData)
      .where(eq(settlements.id, settlementId))
      .returning();

    // --- EMAIL NOTIFICATION: Payment Confirmation ---
    // Only send when status changes TO "completed"
    if (
      validatedData.status === "completed" &&
      existingSettlement.status !== "completed"
    ) {
      // Fetch settlement with full relations for email
      const settlementForEmail = await db.query.settlements.findFirst({
        where: eq(settlements.id, settlementId),
        with: {
          fromUser: { columns: { id: true, name: true, email: true, currencyCode: true } },
          toUser: { columns: { id: true, name: true, email: true } },
          receipt: { columns: { merchantName: true } },
        },
      });

      if (settlementForEmail && settlementForEmail.settledAt) {
        const { formatAmount } = await import("@/lib/currency");
        const { sendPaymentConfirmationEmail } = await import(
          "@/lib/email/email-helpers"
        );

        await sendPaymentConfirmationEmail({
          settlementId: settlementForEmail.id,
          fromUserId: settlementForEmail.fromUser.id,
          fromUserName: settlementForEmail.fromUser.name || "Unknown",
          fromUserEmail: settlementForEmail.fromUser.email,
          toUserId: settlementForEmail.toUser.id,
          toUserName: settlementForEmail.toUser.name || "Unknown",
          toUserEmail: settlementForEmail.toUser.email,
          formattedAmount: formatAmount(
            settlementForEmail.amount,
            settlementForEmail.fromUser.currencyCode || "USD"
          ),
          merchantName: settlementForEmail.receipt?.merchantName || "Unknown",
          settledAt: new Date(settlementForEmail.settledAt).toLocaleDateString(),
        });
      }
    }
    // --- END EMAIL NOTIFICATION ---

    // Fetch with relations
    const settlementWithUsers = await db.query.settlements.findFirst({
      where: eq(settlements.id, settlementId),
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

    return NextResponse.json({ settlement: settlementWithUsers });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating settlement:", error);
    return NextResponse.json(
      { error: "Failed to update settlement" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const settlementId = parseInt(id, 10);

    if (isNaN(settlementId)) {
      return NextResponse.json(
        { error: "Invalid settlement ID" },
        { status: 400 }
      );
    }

    // Verify settlement exists and user is involved
    const existingSettlement = await db.query.settlements.findFirst({
      where: and(
        eq(settlements.id, settlementId),
        or(eq(settlements.fromUserId, userId), eq(settlements.toUserId, userId))
      ),
    });

    if (!existingSettlement) {
      return NextResponse.json(
        { error: "Settlement not found or access denied" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending settlements
    if (existingSettlement.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending settlements can be deleted" },
        { status: 400 }
      );
    }

    await db.delete(settlements).where(eq(settlements.id, settlementId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting settlement:", error);
    return NextResponse.json(
      { error: "Failed to delete settlement" },
      { status: 500 }
    );
  }
}

