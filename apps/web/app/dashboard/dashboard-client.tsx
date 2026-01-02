"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt, ArrowRight, Users, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/receipt-helpers";
import type { BalanceSummary } from "@/lib/settlement-types";

interface DashboardClientProps {
  userId: string;
  userName: string;
}

interface RecentReceipt {
  id: number;
  merchantName: string | null;
  totalAmount: string | null;
  purchaseDate: Date | null;
  createdAt: Date;
  groupId: number | null;
}

export function DashboardClient({ userId, userName }: DashboardClientProps) {
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load balance summary
      const summaryRes = await fetch("/api/settlements");
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        const allSettlements = summaryData.settlements || [];
        const pending = allSettlements.filter((s: any) => s.status === "pending");
        const completed = allSettlements.filter((s: any) => s.status === "completed");

        const youOweSettlements = pending.filter((s: any) => s.fromUserId === userId);
        const owedToYouSettlements = pending.filter((s: any) => s.toUserId === userId);

        const totalYouOwe = youOweSettlements.reduce(
          (sum: number, s: any) => sum + parseFloat(s.amount),
          0
        );

        const totalOwedToYou = owedToYouSettlements.reduce(
          (sum: number, s: any) => sum + parseFloat(s.amount),
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
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-display">
          Welcome back, {userName}
        </h1>
        <p className="text-body text-muted-foreground">
          Your bill splitting overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-small text-muted-foreground">You Owe</p>
              <DollarSign className="size-5 text-red-500" />
            </div>
            <p className="text-heading-1 text-red-600 mb-1">
              {isLoading ? "..." : formatCurrency(summary.totalYouOwe.toFixed(2))}
            </p>
            <p className="text-small text-muted-foreground">
              {summary.pendingYouOweCount} pending settlement{summary.pendingYouOweCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-small text-muted-foreground">You&apos;re Owed</p>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <p className="text-heading-1 text-green-600 mb-1">
              {isLoading ? "..." : formatCurrency(summary.totalOwedToYou.toFixed(2))}
            </p>
            <p className="text-small text-muted-foreground">
              {summary.completedCount} completed settlement{summary.completedCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-small text-muted-foreground">Active Groups</p>
              <Users className="size-5 text-primary" />
            </div>
            <p className="text-heading-1 mb-1">
              {isLoading ? "..." : groupsCount}
            </p>
            <p className="text-small text-muted-foreground">
              {groupsCount === 1 ? "group" : "groups"} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-2">Recent Activity</h2>
          <Link
            href="/dashboard/receipts"
            className="text-small text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="py-4">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentReceipts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Receipt className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-body text-muted-foreground mb-2">
                No receipts yet
              </p>
              <p className="text-small text-muted-foreground">
                Start by scanning or entering a receipt manually
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReceipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        window.location.href = `/dashboard/receipts/${receipt.id}`;
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Receipt className="size-4 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-body">
                            {receipt.merchantName || "Receipt"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-small text-muted-foreground">
                          {receipt.purchaseDate
                            ? new Date(receipt.purchaseDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : new Date(receipt.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {receipt.totalAmount && (
                          <p className="font-semibold text-body">
                            {formatCurrency(receipt.totalAmount)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

