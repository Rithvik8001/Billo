import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { groups, groupMembers } from "@/db/models/schema";
import { eq, and } from "drizzle-orm";
import { getGroupBalances } from "@/lib/settlement-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
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

    // Verify group exists and user is a member
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is a member
    const membership = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      ),
    });

    if (group.createdBy !== userId && !membership) {
      return NextResponse.json(
        { error: "Access denied to this group" },
        { status: 403 }
      );
    }

    // Get balances for all members
    const balances = await getGroupBalances(groupId, userId);

    return NextResponse.json({ balances });
  } catch (error) {
    console.error("Error fetching group balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch group balances" },
      { status: 500 }
    );
  }
}

