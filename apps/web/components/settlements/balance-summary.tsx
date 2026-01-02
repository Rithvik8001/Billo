"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/receipt-helpers";
import type { BalanceSummary } from "@/lib/settlement-types";

interface BalanceSummaryProps {
  summary: BalanceSummary;
}

export function BalanceSummary({ summary }: BalanceSummaryProps) {
  const isPositive = summary.netBalance < 0; // Negative netBalance means you're owed

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            You Owe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.totalYouOwe.toFixed(2))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.pendingCount} pending settlement
            {summary.pendingCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            You&apos;re Owed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.totalOwedToYou.toFixed(2))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.completedCount} completed settlement
            {summary.completedCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className={isPositive ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(Math.abs(summary.netBalance).toFixed(2))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive ? "You're owed" : "You owe"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

