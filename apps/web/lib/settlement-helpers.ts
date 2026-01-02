import db from "@/db/config/connection";
import { settlements, itemAssignments, receiptItems, receipts } from "@/db/models/schema";
import { eq, and, sql, or } from "drizzle-orm";
import type { PersonTotal } from "./assignment-types";
import type { GroupBalance } from "./settlement-types";

/**
 * Calculate and create settlement records for a receipt
 * Receipt owner is the payer (toUserId), everyone else owes them
 */
export async function calculateSettlements(
  receiptId: number,
  ownerId: string,
  personTotals: PersonTotal[],
  groupId: number | null
): Promise<void> {
  // Delete existing settlements for this receipt (in case of re-assignment)
  await db.delete(settlements).where(eq(settlements.receiptId, receiptId));

  // Create settlement records for each person who owes money
  const settlementRecords = personTotals
    .filter((person) => person.userId !== ownerId && person.total > 0)
    .map((person) => ({
      receiptId,
      groupId,
      fromUserId: person.userId, // Person who owes
      toUserId: ownerId, // Receipt owner who paid
      amount: person.total.toFixed(2),
      currency: "USD",
      status: "pending" as const,
    }));

  if (settlementRecords.length > 0) {
    await db.insert(settlements).values(settlementRecords);
  }
}

/**
 * Get all settlements for a specific receipt
 */
export async function getReceiptSettlements(receiptId: number) {
  return await db.query.settlements.findMany({
    where: eq(settlements.receiptId, receiptId),
    with: {
      fromUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      toUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });
}

/**
 * Calculate aggregated balances for all members in a group
 * Returns net balances (positive = they owe, negative = they're owed)
 */
export async function getGroupBalances(groupId: number, currentUserId: string): Promise<GroupBalance[]> {
  // Get all pending settlements for this group
  const groupSettlements = await db.query.settlements.findMany({
    where: and(eq(settlements.groupId, groupId), eq(settlements.status, "pending")),
    with: {
      fromUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      toUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  // Aggregate balances per user
  const balanceMap = new Map<string, GroupBalance>();

  groupSettlements.forEach((settlement) => {
    const amount = parseFloat(settlement.amount);

    // User owes money (fromUserId)
    if (!balanceMap.has(settlement.fromUserId)) {
      const user = settlement.fromUser;
      balanceMap.set(settlement.fromUserId, {
        userId: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        totalOwed: 0,
        totalOwedTo: 0,
        netBalance: 0,
      });
    }
    const debtor = balanceMap.get(settlement.fromUserId)!;
    debtor.totalOwed += amount;
    debtor.netBalance += amount;

    // User is owed money (toUserId)
    if (!balanceMap.has(settlement.toUserId)) {
      const user = settlement.toUser;
      balanceMap.set(settlement.toUserId, {
        userId: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        totalOwed: 0,
        totalOwedTo: 0,
        netBalance: 0,
      });
    }
    const creditor = balanceMap.get(settlement.toUserId)!;
    creditor.totalOwedTo += amount;
    creditor.netBalance -= amount;
  });

  // Convert to array and sort by net balance (highest debtors first)
  return Array.from(balanceMap.values()).sort((a, b) => b.netBalance - a.netBalance);
}

/**
 * Calculate balance summary for a user
 */
export async function getBalanceSummary(userId: string): Promise<{
  totalYouOwe: number;
  totalOwedToYou: number;
  netBalance: number;
  pendingCount: number;
  completedCount: number;
}> {
  // Get all settlements where user is involved
  const settlementsOwed = await db
    .select({
      amount: settlements.amount,
      status: settlements.status,
    })
    .from(settlements)
    .where(and(eq(settlements.fromUserId, userId), eq(settlements.status, "pending")));

  const settlementsOwedTo = await db
    .select({
      amount: settlements.amount,
      status: settlements.status,
    })
    .from(settlements)
    .where(and(eq(settlements.toUserId, userId), eq(settlements.status, "pending")));

  const completedSettlements = await db
    .select({
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(settlements)
    .where(
      and(
        eq(settlements.status, "completed"),
        or(eq(settlements.fromUserId, userId), eq(settlements.toUserId, userId))
      )
    );

  const totalYouOwe = settlementsOwed.reduce((sum, s) => sum + parseFloat(s.amount), 0);
  const totalOwedToYou = settlementsOwedTo.reduce((sum, s) => sum + parseFloat(s.amount), 0);
  const netBalance = totalYouOwe - totalOwedToYou;
  const completedCount = Number(completedSettlements[0]?.count || 0);

  return {
    totalYouOwe,
    totalOwedToYou,
    netBalance,
    pendingCount: settlementsOwed.length + settlementsOwedTo.length,
    completedCount,
  };
}

