import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import {
  receipts,
  groupMembers,
  itemAssignments,
  receiptItems,
  groups,
} from "@/db/models/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import { ReceiptClient } from "./receipt-client";

interface ReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const { id } = await params;
  const receiptId = id;

  const receipt = await db.query.receipts.findFirst({
    where: eq(receipts.id, receiptId),
    with: {
      items: {
        orderBy: (items) => [asc(items.lineNumber)],
      },
    },
  });

  if (!receipt) {
    notFound();
  }

  // Check access: owner, group member, or has item assignments
  const isOwner = receipt.userId === userId;

  let hasAccess = isOwner;

  // Check if user is a member of the receipt's group
  if (!hasAccess && receipt.groupId) {
    const groupMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, receipt.groupId),
        eq(groupMembers.userId, userId)
      ),
    });
    hasAccess = !!groupMember;
  }

  // Check if user has item assignments on this receipt
  if (!hasAccess) {
    // Get all receipt item IDs for this receipt
    const receiptItemsList = await db.query.receiptItems.findMany({
      where: eq(receiptItems.receiptId, receiptId),
      columns: { id: true },
    });

    if (receiptItemsList.length > 0) {
      const itemIds = receiptItemsList.map((item) => item.id);
      const assignment = await db.query.itemAssignments.findFirst({
        where: and(
          eq(itemAssignments.userId, userId),
          inArray(itemAssignments.receiptItemId, itemIds)
        ),
      });
      hasAccess = !!assignment;
    }
  }

  if (!hasAccess) {
    notFound();
  }

  // Fetch existing assignments for this receipt
  const itemIds = receipt.items.map((item) => item.id);
  let existingAssignments: Array<{
    receiptItemId: string;
    userId: string;
    userName: string | null;
    userEmail: string | null;
    userImageUrl: string | null;
    calculatedAmount: string;
  }> = [];
  let groupInfo: { id: string; name: string; emoji: string | null } | null =
    null;

  if (itemIds.length > 0) {
    const assignments = await db.query.itemAssignments.findMany({
      where: inArray(itemAssignments.receiptItemId, itemIds),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        item: {
          columns: {
            id: true,
          },
        },
      },
    });

    existingAssignments = assignments.map((a) => ({
      receiptItemId: a.item.id,
      userId: a.userId,
      userName: a.user.name,
      userEmail: a.user.email,
      userImageUrl: a.user.imageUrl,
      calculatedAmount: a.calculatedAmount,
    }));
  }

  // Fetch group info if receipt has a groupId
  if (receipt.groupId) {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, receipt.groupId),
      columns: {
        id: true,
        name: true,
        emoji: true,
      },
    });
    if (group) {
      groupInfo = {
        id: group.id,
        name: group.name,
        emoji: group.emoji,
      };
    }
  }

  return (
    <ReceiptClient
      receipt={{
        id: receipt.id,
        userId: receipt.userId,
        imageUrl: receipt.imageUrl,
        merchantName: receipt.merchantName,
        purchaseDate: receipt.purchaseDate,
        totalAmount: receipt.totalAmount,
        tax: receipt.tax,
      }}
      items={receipt.items}
      isOwner={isOwner}
      existingAssignments={existingAssignments}
      groupInfo={groupInfo}
    />
  );
}
