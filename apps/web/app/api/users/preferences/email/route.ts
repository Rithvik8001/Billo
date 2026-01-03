import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import { emailPreferencesSchema } from "@/lib/email/email-schemas";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        emailGroupInvites: true,
        emailSettlements: true,
        emailPayments: true,
        emailWeeklySummary: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      emailGroupInvites: user.emailGroupInvites,
      emailSettlements: user.emailSettlements,
      emailPayments: user.emailPayments,
      emailWeeklySummary: user.emailWeeklySummary,
    });
  } catch (error) {
    console.error("Error fetching email preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch email preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = emailPreferencesSchema.parse(body);

    const updateData: Record<string, boolean | Date> = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (validatedData.emailGroupInvites !== undefined) {
      updateData.emailGroupInvites = validatedData.emailGroupInvites;
    }
    if (validatedData.emailSettlements !== undefined) {
      updateData.emailSettlements = validatedData.emailSettlements;
    }
    if (validatedData.emailPayments !== undefined) {
      updateData.emailPayments = validatedData.emailPayments;
    }
    if (validatedData.emailWeeklySummary !== undefined) {
      updateData.emailWeeklySummary = validatedData.emailWeeklySummary;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      emailGroupInvites: updatedUser.emailGroupInvites,
      emailSettlements: updatedUser.emailSettlements,
      emailPayments: updatedUser.emailPayments,
      emailWeeklySummary: updatedUser.emailWeeklySummary,
    });
  } catch (error) {
    console.error("Error updating email preferences:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update email preferences" },
      { status: 500 }
    );
  }
}
