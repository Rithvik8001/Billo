"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Receipt,
  ArrowRight,
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { BalanceSummary, Settlement } from "@/lib/settlement-types";

interface DashboardClientProps {
  userId: string;
  userName: string;
}

interface RecentReceipt {
  id: string;
  merchantName: string | null;
  totalAmount: string | null;
  purchaseDate: Date | null;
  createdAt: Date;
  groupId: string | null;
}

export function DashboardClient({ userId, userName }: DashboardClientProps) {
  const { formatAmount } = useCurrency();
  const [summary, setSummary] = useState<BalanceSummary>({
    totalYouOwe: 0,
    totalOwedToYou: 0,
    netBalance: 0,
    pendingYouOweCount: 0,
    pendingOwedToYouCount: 0,
    completedCount: 0,
  });
  const [recentReceipts, setRecentReceipts] = useState<RecentReceipt[]>([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load balance summary
      const summaryRes = await fetch("/api/settlements");
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        const allSettlements = (summaryData.settlements || []) as Settlement[];
        const pending = allSettlements.filter((s) => s.status === "pending");
        const completed = allSettlements.filter(
          (s) => s.status === "completed"
        );

        const youOweSettlements = pending.filter(
          (s) => s.fromUserId === userId
        );
        const owedToYouSettlements = pending.filter(
          (s) => s.toUserId === userId
        );

        const totalYouOwe = youOweSettlements.reduce(
          (sum, s) => sum + parseFloat(s.amount),
          0
        );

        const totalOwedToYou = owedToYouSettlements.reduce(
          (sum, s) => sum + parseFloat(s.amount),
          0
        );

        setSummary({
          totalYouOwe,
          totalOwedToYou,
          netBalance: totalYouOwe - totalOwedToYou,
          pendingYouOweCount: youOweSettlements.length,
          pendingOwedToYouCount: owedToYouSettlements.length,
          completedCount: completed.length,
        });
      }

      // Load recent receipts
      const receiptsRes = await fetch("/api/receipts?status=completed&limit=5");
      if (receiptsRes.ok) {
        const receiptsData = await receiptsRes.json();
        setRecentReceipts(receiptsData.receipts?.slice(0, 5) || []);
      }

      // Load groups count
      const groupsRes = await fetch("/api/groups");
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroupsCount(groupsData.groups?.length || 0);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="space-y-16">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
            You Owe
          </p>
          <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
            {isLoading ? (
              "..."
            ) : (
              <AnimatedNumber
                value={summary.totalYouOwe}
                formatValue={(num) => formatAmount(num.toFixed(2))}
              />
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.pendingYouOweCount} pending settlement
            {summary.pendingYouOweCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
            You&apos;re Owed
          </p>
          <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
            {isLoading ? (
              "..."
            ) : (
              <AnimatedNumber
                value={summary.totalOwedToYou}
                formatValue={(num) => formatAmount(num.toFixed(2))}
              />
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.completedCount} completed settlement
            {summary.completedCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
            Active Groups
          </p>
          <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
            {isLoading ? "..." : groupsCount}
          </p>
          <p className="text-xs text-muted-foreground">
            {groupsCount === 1 ? "group" : "groups"} total
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h2">Recent Activity</h2>
          <Link
            href="/dashboard/receipts"
            className="text-xs text-accent hover:underline flex items-center gap-1 transition-opacity hover:opacity-80"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 border-b border-border/40 last:border-0">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : recentReceipts.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="size-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-body text-muted-foreground mb-1">
              No receipts yet
            </p>
            <p className="text-xs text-muted-foreground">
              Start by scanning or entering a receipt manually
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {recentReceipts.map((receipt, index) => (
              <Link
                key={receipt.id}
                href={`/dashboard/receipts/${receipt.id}`}
                className="flex items-center justify-between py-4 border-b border-border/40 last:border-0 hover:bg-[#F9FAFB] transition-colors -mx-2 px-2 rounded"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <p className="font-medium text-body truncate">
                    {receipt.merchantName || "Receipt"}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {receipt.purchaseDate
                      ? new Date(receipt.purchaseDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : new Date(receipt.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                  </span>
                </div>
                {receipt.totalAmount && (
                  <p className="text-body font-mono text-foreground ml-4 shrink-0">
                    {formatAmount(receipt.totalAmount)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
