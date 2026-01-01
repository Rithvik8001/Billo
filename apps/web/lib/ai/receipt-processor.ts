import db from "@/db/config/connection";
import { receipts, receiptItems } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type { ReceiptExtractionResult } from "./schemas";

/**
 * Process and save extracted receipt data to database
 */
export async function saveExtractedReceiptData(
  receiptId: number,
  extractedData: ReceiptExtractionResult
): Promise<{
  receiptId: number;
  itemCount: number;
}> {
  // Parse purchase date if available
  let purchaseDate: Date | null = null;
  if (extractedData.purchaseDate) {
    const parsedDate = new Date(extractedData.purchaseDate);
    if (!isNaN(parsedDate.getTime())) {
      purchaseDate = parsedDate;
    }
  }

  // Prepare receipt items for insertion
  const itemsToInsert = extractedData.items.map((item, index) => ({
    receiptId,
    name: item.name,
    quantity: item.quantity || "1",
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    lineNumber: item.lineNumber ?? index + 1,
    category: item.category || null,
  }));

  // Insert receipt items
  if (itemsToInsert.length > 0) {
    await db.insert(receiptItems).values(itemsToInsert);
  }

  // Update receipt with extracted metadata
  await db
    .update(receipts)
    .set({
      merchantName: extractedData.merchantName || null,
      merchantAddress: extractedData.merchantAddress || null,
      purchaseDate,
      totalAmount: extractedData.totalAmount || null,
      tax: extractedData.tax || null,
      extractedData: extractedData as unknown,
      extractedAt: new Date(),
      status: "completed",
      updatedAt: new Date(),
    })
    .where(eq(receipts.id, receiptId));

  return {
    receiptId,
    itemCount: itemsToInsert.length,
  };
}

/**
 * Mark receipt extraction as failed
 */
export async function markReceiptExtractionFailed(
  receiptId: number,
  errorMessage: string
): Promise<void> {
  await db
    .update(receipts)
    .set({
      status: "failed",
      extractionError: errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(receipts.id, receiptId));
}

