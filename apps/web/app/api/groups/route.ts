import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { groups, groupMembers } from "@/db/models/schema";
import { eq, or, sql } from "drizzle-orm";
import { createGroupSchema } from "@/lib/api/group-schemas";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch groups where user is creator OR member
    const userGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        emoji: groups.emoji,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        memberCount: sql<number>`cast(count(${groupMembers.id}) as int)`,
      })
      .from(groups)
      .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(or(eq(groups.createdBy, userId), eq(groupMembers.userId, userId)))
      .groupBy(groups.id)
      .orderBy(groups.updatedAt);

    return NextResponse.json({ groups: userGroups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGroupSchema.parse(body);

    // Create group and add creator as admin member in a transaction
    const [newGroup] = await db.transaction(async (tx) => {
      // Create the group
      const [group] = await tx
        .insert(groups)
        .values({
          name: validatedData.name,
          description: validatedData.description || null,
          emoji: validatedData.emoji,
          createdBy: userId,
        })
        .returning();

      // Add creator as admin member
      await tx.insert(groupMembers).values({
        groupId: group.id,
        userId: userId,
        role: "admin",
      });

      return [group];
    });

    // Fetch member count
    const [memberCountResult] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, newGroup.id));

    return NextResponse.json(
      {
        group: {
          ...newGroup,
          memberCount: memberCountResult?.count || 1,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
