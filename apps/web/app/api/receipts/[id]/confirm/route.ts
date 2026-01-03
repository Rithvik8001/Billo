import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, receiptItems } from "@/db/models/schema";
import { receiptExtractionSchema } from "@/lib/ai/schemas";
import { eq } from "drizzle-orm";
import { isValidUUID } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const receiptId = id;

    if (!isValidUUID(receiptId)) {
      return Response.json({ error: "Invalid receipt ID" }, { status: 400 });
    }

    // Verify receipt exists and belongs to user
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse and validate extraction data
    const body = await request.json();
    const validatedData = receiptExtractionSchema.parse(body.extractedData);

    // Parse purchase date if available
    let purchaseDate: Date | null = null;
    if (
      validatedData.purchaseDate &&
      validatedData.purchaseDate.toLowerCase() !== "null" &&
      validatedData.purchaseDate.trim() !== ""
    ) {
      const parsedDate = new Date(validatedData.purchaseDate);
      if (!isNaN(parsedDate.getTime())) {
        purchaseDate = parsedDate;
      }
    }

    // Delete existing items before inserting new ones
    await db.delete(receiptItems).where(eq(receiptItems.receiptId, receiptId));

    // Prepare receipt items for insertion with validation
    const itemsToInsert = validatedData.items.map((item, index) => {
      // Validate decimal values
      const quantity = item.quantity?.trim() || "1";
      const unitPrice = item.unitPrice?.trim();
      const totalPrice = item.totalPrice?.trim();

      // Validate that prices are not empty
      if (!unitPrice || !totalPrice) {
        throw new Error(
          `Invalid item data: missing prices for item "${item.name}"`
        );
      }

      // Validate that prices are valid numbers
      if (isNaN(parseFloat(unitPrice)) || isNaN(parseFloat(totalPrice))) {
        throw new Error(
          `Invalid item data: prices must be valid numbers for item "${item.name}"`
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
      await db.insert(receiptItems).values(itemsToInsert);
    }

    // Clean and validate tax field
    const cleanTax =
      validatedData.tax &&
      validatedData.tax.toLowerCase() !== "null" &&
      validatedData.tax.trim() !== ""
        ? validatedData.tax
        : null;

    // Update receipt with extracted metadata
    await db
      .update(receipts)
      .set({
        merchantName: validatedData.merchantName || null,
        merchantAddress: validatedData.merchantAddress || null,
        purchaseDate,
        totalAmount: validatedData.totalAmount || null,
        tax: cleanTax,
        extractedData: validatedData as unknown as Record<string, unknown>,
        extractedAt: new Date(),
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, receiptId));

    return Response.json({
      receiptId,
      itemCount: itemsToInsert.length,
    });
  } catch (error) {
    console.error("Error confirming receipt extraction:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        {
          error: "Validation error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to confirm extraction";
    return Response.json(
      {
        error: "Failed to confirm extraction",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

