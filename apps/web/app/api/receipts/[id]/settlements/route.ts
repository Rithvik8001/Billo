import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, settlements } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import { isValidUUID } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/receipts/[id]/settlements
 * Check settlement status for a receipt
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

    // Verify receipt exists and user has access
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Only owner can check settlement status
    if (receipt.userId !== userId) {
      return NextResponse.json(
        { error: "Access denied to this receipt" },
        { status: 403 }
      );
    }

    // Get all settlements for this receipt
    const receiptSettlements = await db.query.settlements.findMany({
      where: eq(settlements.receiptId, receiptId),
      columns: {
        id: true,
        status: true,
      },
    });

    const hasSettlements = receiptSettlements.length > 0;
    const hasCompletedSettlements = receiptSettlements.some(
      (s) => s.status === "completed"
    );
    const hasPendingSettlements = receiptSettlements.some(
      (s) => s.status === "pending"
    );

    return NextResponse.json({
      hasSettlements,
      hasCompletedSettlements,
      hasPendingSettlements,
      settlementCount: receiptSettlements.length,
      completedCount: receiptSettlements.filter((s) => s.status === "completed")
        .length,
      pendingCount: receiptSettlements.filter((s) => s.status === "pending")
        .length,
    });
  } catch (error) {
    console.error("Error checking settlement status:", error);
    return NextResponse.json(
      { error: "Failed to check settlement status" },
      { status: 500 }
    );
  }
}
