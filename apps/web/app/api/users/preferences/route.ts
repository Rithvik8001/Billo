import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import { updatePreferencesSchema } from "@/lib/api/preferences-schemas";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        currencyCode: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      currencyCode: user.currencyCode || "USD",
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return Response.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);

    const [updatedUser] = await db
      .update(users)
      .set({
        currencyCode: validatedData.currencyCode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      currencyCode: updatedUser.currencyCode,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);

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
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
