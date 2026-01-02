"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/receipt-helpers";
import type { GroupBalance } from "@/lib/settlement-types";

interface GroupBalancePreviewProps {
  groupId: number;
  currentUserId: string;
}

export function GroupBalancePreview({
  groupId,
  currentUserId,
}: GroupBalancePreviewProps) {
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBalances();
  }, [groupId]);

  const loadBalances = async () => {
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
  };

  if (isLoading) {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        Loading balances...
      </div>
    );
  }

  const currentUserBalance = balances.find((b) => b.userId === currentUserId);

  if (!currentUserBalance || currentUserBalance.netBalance === 0) {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        No pending balances
      </div>
    );
  }

  const isOwed = currentUserBalance.netBalance < 0;
  const amount = Math.abs(currentUserBalance.netBalance);

  return (
    <div className="mt-3 pt-3 border-t">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {isOwed ? "You're owed" : "You owe"}:{" "}
          </span>
          <span
            className={`font-semibold ${
              isOwed
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(amount.toFixed(2))}
          </span>
        </div>
        <Link href={`/dashboard/settle?groupId=${groupId}`}>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            View
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

