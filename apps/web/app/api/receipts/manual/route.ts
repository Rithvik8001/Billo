import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts, receiptItems, users } from "@/db/models/schema";
import { createManualReceiptSchema } from "@/lib/api/manual-entry-schemas";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createManualReceiptSchema.parse(body);

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

    // Calculate total amount from items + tax
    const itemsTotal = validatedData.items.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice || "0"),
      0
    );
    const taxAmount = validatedData.tax
      ? parseFloat(validatedData.tax)
      : 0;
    const totalAmount = (itemsTotal + taxAmount).toFixed(2);

    // Create receipt with manual sentinel values
    const [receipt] = await db
      .insert(receipts)
      .values({
        userId,
        imageUrl: "manual",
        imagePublicId: "manual",
        merchantName: validatedData.merchantName || null,
        merchantAddress: validatedData.merchantAddress || null,
        purchaseDate: validatedData.purchaseDate
          ? new Date(validatedData.purchaseDate)
          : null,
        tax: validatedData.tax || null,
        totalAmount,
        status: "completed",
      })
      .returning();

    // Insert all items
    const itemsToInsert = validatedData.items.map((item, index) => ({
      receiptId: receipt.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      lineNumber: index + 1,
    }));

    await db.insert(receiptItems).values(itemsToInsert);

    // Fetch receipt with items for response
    const receiptWithItems = await db.query.receipts.findFirst({
      where: eq(receipts.id, receipt.id),
      with: {
        items: true,
      },
    });

    return Response.json(receiptWithItems, { status: 201 });
  } catch (error) {
    console.error("Error creating manual receipt:", error);
    
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
      error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        error: "Failed to create receipt",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

