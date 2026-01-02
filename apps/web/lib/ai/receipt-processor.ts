import db from "@/db/config/connection";
import { receipts, receiptItems } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type { ReceiptExtractionResult } from "./schemas";

export async function saveExtractedReceiptData(
  receiptId: number,
  extractedData: ReceiptExtractionResult
): Promise<{
  receiptId: number;
  itemCount: number;
}> {
  // Parse purchase date if available
  let purchaseDate: Date | null = null;
  if (
    extractedData.purchaseDate &&
    extractedData.purchaseDate.toLowerCase() !== "null" &&
    extractedData.purchaseDate.trim() !== ""
  ) {
    const parsedDate = new Date(extractedData.purchaseDate);
    if (!isNaN(parsedDate.getTime())) {
      purchaseDate = parsedDate;
    }
  }

  // Prepare receipt items for insertion with validation
  const itemsToInsert = extractedData.items.map((item, index) => {
    // Validate decimal values - ensure they're not empty and are valid decimals
    const quantity = item.quantity?.trim() || "1";
    const unitPrice = item.unitPrice?.trim();
    const totalPrice = item.totalPrice?.trim();

    // Validate that prices are not empty
    if (!unitPrice || !totalPrice) {
      throw new Error(
        `Invalid item data: missing prices for item "${item.name}". unitPrice: ${unitPrice}, totalPrice: ${totalPrice}`
      );
    }

    // Validate that prices are valid numbers
    if (isNaN(parseFloat(unitPrice)) || isNaN(parseFloat(totalPrice))) {
      throw new Error(
        `Invalid item data: prices must be valid numbers for item "${item.name}". unitPrice: ${unitPrice}, totalPrice: ${totalPrice}`
      );
    }

    return {
      receiptId,
      name: item.name,
      quantity,
      unitPrice,
      totalPrice,
      lineNumber: item.lineNumber ?? index + 1,
      category: item.category || null,
    };
  });

  // Insert receipt items
  if (itemsToInsert.length > 0) {
    try {
      await db.insert(receiptItems).values(itemsToInsert);
    } catch (insertError) {
      console.error("Failed to insert receipt items:", insertError);
      console.error("Items to insert:", JSON.stringify(itemsToInsert, null, 2));
      throw new Error(
        `Database insert failed: ${insertError instanceof Error ? insertError.message : "Unknown error"}`
      );
    }
  }

  // Clean and validate tax field
  const cleanTax =
    extractedData.tax &&
    extractedData.tax.toLowerCase() !== "null" &&
    extractedData.tax.trim() !== ""
      ? extractedData.tax
      : null;

  // Update receipt with extracted metadata
  try {
    await db
      .update(receipts)
      .set({
        merchantName: extractedData.merchantName || null,
        merchantAddress: extractedData.merchantAddress || null,
        purchaseDate,
        totalAmount: extractedData.totalAmount || null,
        tax: cleanTax,
        extractedData: extractedData as unknown as Record<string, unknown>,
        extractedAt: new Date(),
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, receiptId));
  } catch (updateError) {
    console.error("Failed to update receipt:", updateError);
    console.error("Error details:", JSON.stringify(updateError, null, 2));
    console.error("Update data:", {
      receiptId,
      merchantName: extractedData.merchantName,
      merchantAddress: extractedData.merchantAddress,
      purchaseDate,
      totalAmount: extractedData.totalAmount,
      tax: cleanTax,
      extractedData,
    });

    // Check if this is a Drizzle error with a cause
    if (updateError && typeof updateError === "object" && "cause" in updateError) {
      const cause = (updateError as { cause?: unknown }).cause;
      console.error("Error cause:", cause);
      if (cause && typeof cause === "object" && "message" in cause) {
        throw new Error(
          `Failed to update receipt: ${(cause as { message: string }).message}`
        );
      }
    }

    throw new Error(
      `Failed to update receipt: ${updateError instanceof Error ? updateError.message : "Unknown error"}`
    );
  }

  return {
    receiptId,
    itemCount: itemsToInsert.length,
  };
}

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
