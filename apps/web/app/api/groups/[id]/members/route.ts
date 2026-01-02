import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { groups, groupMembers, users } from "@/db/models/schema";
import { eq, and } from "drizzle-orm";
import { addMemberSchema } from "@/lib/api/group-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function checkAdminAccess(
  groupId: number,
  userId: string
): Promise<boolean> {
  const member = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId),
      eq(groupMembers.role, "admin")
    ),
  });

  return !!member;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Verify user has access to this group
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is creator or member
    const isMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ),
    });

    if (group.createdBy !== userId && !isMember) {
      return NextResponse.json(
        { error: "Access denied to this group" },
        { status: 403 }
      );
    }

    // Fetch members with user details
    const members = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        imageUrl: users.imageUrl,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(groupMembers.joinedAt);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json(
      { error: "Failed to fetch group members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Check admin access
    const isAdmin = await checkAdminAccess(groupId, userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can add members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = addMemberSchema.parse(body);

    // Verify group exists
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Verify user exists in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, validatedData.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, validatedData.userId)
      ),
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this group" },
        { status: 400 }
      );
    }

    // Add member with default role 'member'
    const [newMember] = await db
      .insert(groupMembers)
      .values({
        groupId: groupId,
        userId: validatedData.userId,
        role: "member",
      })
      .returning();

    // Fetch member with user details
    const memberWithUser = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        imageUrl: users.imageUrl,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.id, newMember.id))
      .limit(1);

    return NextResponse.json({ member: memberWithUser[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error adding member:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}
