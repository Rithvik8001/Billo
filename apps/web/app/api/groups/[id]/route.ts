import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { groups, groupMembers } from "@/db/models/schema";
import { eq, and, sql } from "drizzle-orm";
import { updateGroupSchema } from "@/lib/api/group-schemas";
import { isValidUUID } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function checkAdminAccess(
  groupId: string,
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
    const groupId = id;

    if (!isValidUUID(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Fetch group
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

    // Get member count
    const [memberCountResult] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    return NextResponse.json({
      group: {
        ...group,
        memberCount: memberCountResult?.count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const groupId = id;

    if (!isValidUUID(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Check admin access
    const isAdmin = await checkAdminAccess(groupId, userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can edit groups" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateGroupSchema.parse(body);

    // Update group
    const [updatedGroup] = await db
      .update(groups)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId))
      .returning();

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Get member count
    const [memberCountResult] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    return NextResponse.json({
      group: {
        ...updatedGroup,
        memberCount: memberCountResult?.count || 0,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const groupId = id;

    if (!isValidUUID(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // Check admin access
    const isAdmin = await checkAdminAccess(groupId, userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can delete groups" },
        { status: 403 }
      );
    }

    // Delete group (cascade will handle group_members)
    await db.delete(groups).where(eq(groups.id, groupId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
