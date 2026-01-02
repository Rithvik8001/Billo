import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { ilike, ne, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const emailQuery = searchParams.get("email");

    if (!emailQuery || emailQuery.trim().length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Case-insensitive partial email match, exclude current user
    // Limit to 10 results
    const matchingUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        imageUrl: users.imageUrl,
      })
      .from(users)
      .where(
        sql`${users.email} ILIKE ${`%${emailQuery.trim()}%`} AND ${users.id} != ${userId}`
      )
      .limit(10);

    return NextResponse.json({ users: matchingUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}

