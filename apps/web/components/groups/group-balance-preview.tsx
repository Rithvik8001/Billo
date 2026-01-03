"use client";

import { useEffect, useState, useCallback } from "react";
import { Wallet } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import type { GroupBalance } from "@/lib/settlement-types";

interface GroupBalancePreviewProps {
  groupId: string;
  currentUserId: string;
}

export function GroupBalancePreview({
  groupId,
  currentUserId,
}: GroupBalancePreviewProps) {
  const { formatAmount } = useCurrency();
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBalances = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/balances`);
      if (!response.ok) {
        throw new Error("Failed to load balances");
      }

      const data = await response.json();
      setBalances(data.balances || []);
    } catch (error) {
      console.error("Failed to load balances:", error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-small text-muted-foreground">
        <Wallet className="size-4 shrink-0" />
        <span>Loading balances...</span>
      </div>
    );
  }

  const currentUserBalance = balances.find((b) => b.userId === currentUserId);

  if (!currentUserBalance || currentUserBalance.netBalance === 0) {
    return (
      <div className="flex items-center gap-2 text-small text-muted-foreground">
        <Wallet className="size-4 shrink-0" />
        <span>No pending balances</span>
      </div>
    );
  }

  const isOwed = currentUserBalance.netBalance < 0;
  const amount = Math.abs(currentUserBalance.netBalance);

  return (
    <div className="flex items-center gap-2 text-small">
      <Wallet className="size-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">
        {isOwed ? "You're owed" : "You owe"}:
      </span>
      <span
        className={`font-semibold ${
          isOwed
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {formatAmount(amount.toFixed(2))}
      </span>
    </div>
  );
}
