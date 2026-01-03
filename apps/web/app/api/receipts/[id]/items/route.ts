import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, receiptItems } from "@/db/models/schema";
import { manualItemSchema } from "@/lib/api/manual-entry-schemas";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { isValidUUID } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
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

    // Check receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch items
    const items = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
      orderBy: (items) => [items.lineNumber],
    });

    return Response.json({ items });
  } catch (error) {
    console.error("Error fetching receipt items:", error);
    return Response.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
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

    // Check receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow editing manual receipts
    if (receipt.imageUrl !== "manual") {
      return Response.json(
        { error: "Only manual receipts can be edited" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const itemsSchema = z.array(manualItemSchema).min(1);
    const validatedItems = itemsSchema.parse(body.items);

    // Calculate new total
    const itemsTotal = validatedItems.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice || "0"),
      0
    );
    const taxAmount = receipt.tax ? parseFloat(receipt.tax) : 0;
    const totalAmount = (itemsTotal + taxAmount).toFixed(2);

    // Delete existing items and insert new ones in a transaction
    await db.transaction(async (tx) => {
      await tx.delete(receiptItems).where(eq(receiptItems.receiptId, receiptId));

      const itemsToInsert = validatedItems.map((item, index) => ({
        receiptId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        lineNumber: index + 1,
      }));

      await tx.insert(receiptItems).values(itemsToInsert);

      // Update receipt total
      await tx
        .update(receipts)
        .set({ totalAmount, updatedAt: new Date() })
        .where(eq(receipts.id, receiptId));
    });

    // Fetch updated items
    const updatedItems = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
      orderBy: (items) => [items.lineNumber],
    });

    return Response.json({ items: updatedItems });
  } catch (error) {
    console.error("Error updating receipt items:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        {
          error: "Validation error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Failed to update items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
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

    // Check receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow editing manual receipts
    if (receipt.imageUrl !== "manual") {
      return Response.json(
        { error: "Only manual receipts can be edited" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedItem = manualItemSchema.parse(body);

    // Get current max line number
    const existingItems = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
    });

    const maxLineNumber =
      existingItems.length > 0
        ? Math.max(...existingItems.map((item) => item.lineNumber || 0))
        : 0;

    // Insert new item
    const [newItem] = await db
      .insert(receiptItems)
      .values({
        receiptId,
        name: validatedItem.name,
        quantity: validatedItem.quantity,
        unitPrice: validatedItem.unitPrice,
        totalPrice: validatedItem.totalPrice,
        lineNumber: maxLineNumber + 1,
      })
      .returning();

    // Recalculate and update receipt total
    const allItems = [...existingItems, newItem];
    const itemsTotal = allItems.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice || "0"),
      0
    );
    const taxAmount = receipt.tax ? parseFloat(receipt.tax) : 0;
    const totalAmount = (itemsTotal + taxAmount).toFixed(2);

    await db
      .update(receipts)
      .set({ totalAmount, updatedAt: new Date() })
      .where(eq(receipts.id, receiptId));

    return Response.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding receipt item:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        {
          error: "Validation error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
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

    // Check receipt ownership
    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow editing manual receipts
    if (receipt.imageUrl !== "manual") {
      return Response.json(
        { error: "Only manual receipts can be edited" },
        { status: 400 }
      );
    }

    // Delete all items
    await db.delete(receiptItems).where(eq(receiptItems.receiptId, receiptId));

    // Update receipt total to 0 (or tax if exists)
    const taxAmount = receipt.tax ? parseFloat(receipt.tax) : 0;
    const totalAmount = taxAmount.toFixed(2);

    await db
      .update(receipts)
      .set({ totalAmount, updatedAt: new Date() })
      .where(eq(receipts.id, receiptId));

    return Response.json({ message: "Items deleted successfully" });
  } catch (error) {
    console.error("Error deleting receipt items:", error);
    return Response.json(
      { error: "Failed to delete items" },
      { status: 500 }
    );
  }
}

