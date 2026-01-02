import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { groupMembers, users } from "@/db/models/schema";
import { eq, and } from "drizzle-orm";
import { updateMemberRoleSchema } from "@/lib/api/group-schemas";

interface RouteParams {
  params: Promise<{ id: string; userId: string }>;
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

async function getAdminCount(groupId: number): Promise<number> {
  const admins = await db.query.groupMembers.findMany({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.role, "admin")
    ),
  });

  return admins.length;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, userId } = await params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Check admin access
    const isAdmin = await checkAdminAccess(groupId, currentUserId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can change member roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateMemberRoleSchema.parse(body);

    // Verify member exists
    const member = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ),
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent demoting the last admin
    if (member.role === "admin" && validatedData.role === "member") {
      const adminCount = await getAdminCount(groupId);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last admin" },
          { status: 400 }
        );
      }
    }

    // Update member role
    const [updatedMember] = await db
      .update(groupMembers)
      .set({ role: validatedData.role })
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
      )
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
      .where(eq(groupMembers.id, updatedMember.id))
      .limit(1);

    return NextResponse.json({ member: memberWithUser[0] });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating member role:", error);
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, userId } = await params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Check admin access
    const isAdmin = await checkAdminAccess(groupId, currentUserId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can remove members" },
        { status: 403 }
      );
    }

    // Verify member exists
    const member = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ),
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent removing the last admin
    if (member.role === "admin") {
      const adminCount = await getAdminCount(groupId);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin" },
          { status: 400 }
        );
      }
    }

    // Remove member
    await db
      .delete(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
