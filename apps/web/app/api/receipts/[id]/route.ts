import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, receiptItems } from "@/db/models/schema";
import { updateReceiptSchema } from "@/lib/api/manual-entry-schemas";
import { eq } from "drizzle-orm";

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
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
      return Response.json({ error: "Invalid receipt ID" }, { status: 400 });
    }

    const receipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
      with: {
        items: true,
      },
    });

    if (!receipt) {
      return Response.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Check access: owner, group member, or has assignments
    if (receipt.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json(receipt);
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return Response.json({ error: "Failed to fetch receipt" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
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

    // Only allow updating manual receipts
    if (receipt.imageUrl !== "manual") {
      return Response.json(
        { error: "Only manual receipts can be updated" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateReceiptSchema.parse(body);

    // Recalculate total if tax changed
    let totalAmount: string | null = receipt.totalAmount;
    if (validatedData.tax !== undefined) {
      const items = await db.query.receiptItems.findMany({
        where: eq(receiptItems.receiptId, receiptId),
      });

      const itemsTotal = items.reduce(
        (sum, item) => sum + parseFloat(item.totalPrice || "0"),
        0
      );
      const taxAmount = validatedData.tax ? parseFloat(validatedData.tax) : 0;
      totalAmount = (itemsTotal + taxAmount).toFixed(2);
    }

    // Update receipt
    const updateData: {
      merchantName?: string | null;
      merchantAddress?: string | null;
      purchaseDate?: Date | null;
      tax?: string | null;
      totalAmount?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (validatedData.merchantName !== undefined) {
      updateData.merchantName = validatedData.merchantName || null;
    }
    if (validatedData.merchantAddress !== undefined) {
      updateData.merchantAddress = validatedData.merchantAddress || null;
    }
    if (validatedData.purchaseDate !== undefined) {
      updateData.purchaseDate = validatedData.purchaseDate
        ? new Date(validatedData.purchaseDate)
        : null;
    }
    if (validatedData.tax !== undefined) {
      updateData.tax = validatedData.tax || null;
      updateData.totalAmount = totalAmount ?? null;
    }

    const [updatedReceipt] = await db
      .update(receipts)
      .set(updateData)
      .where(eq(receipts.id, receiptId))
      .returning();

    return Response.json(updatedReceipt);
  } catch (error) {
    console.error("Error updating receipt:", error);

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
      { error: "Failed to update receipt" },
      { status: 500 }
    );
  }
}
