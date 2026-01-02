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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="interactive">
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">You Owe</p>
          <p className="text-heading-1 text-red-600 mb-1">
            {formatCurrency(summary.totalYouOwe.toFixed(2))}
          </p>
          <p className="text-small text-muted-foreground">
            {summary.pendingCount} pending settlement
            {summary.pendingCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="interactive">
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">You&apos;re Owed</p>
          <p className="text-heading-1 text-green-600 mb-1">
            {formatCurrency(summary.totalOwedToYou.toFixed(2))}
          </p>
          <p className="text-small text-muted-foreground">
            {summary.completedCount} completed settlement
            {summary.completedCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className={`interactive ${isPositive ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">Net Balance</p>
          <p
            className={`text-heading-1 mb-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(Math.abs(summary.netBalance).toFixed(2))}
          </p>
          <p className="text-small text-muted-foreground">
            {isPositive ? "You're owed" : "You owe"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

