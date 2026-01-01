import db from "@/db/config/connection";
import { receipts } from "@/db/models/schema";
import { eq, and } from "drizzle-orm";

/**
 * Validate receipt ownership and status
 */
export async function validateReceipt(
  receiptId: number,
  userId: string
): Promise<{
  receipt: typeof receipts.$inferSelect;
  isValid: boolean;
  error?: string;
}> {
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(and(eq(receipts.id, receiptId), eq(receipts.userId, userId)))
    .limit(1);

  if (!receipt) {
    return {
      receipt: null as unknown as typeof receipts.$inferSelect,
      isValid: false,
      error: "Receipt not found",
    };
  }

  if (receipt.status === "completed") {
    return {
      receipt,
      isValid: false,
      error: "Receipt already processed",
    };
  }

  return {
    receipt,
    isValid: true,
  };
}

/**
 * Update receipt status to processing
 */
export async function markReceiptAsProcessing(
  receiptId: number
): Promise<void> {
  await db
    .update(receipts)
    .set({
      status: "processing",
      updatedAt: new Date(),
    })
    .where(eq(receipts.id, receiptId));
}

