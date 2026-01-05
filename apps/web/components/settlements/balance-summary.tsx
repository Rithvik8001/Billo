"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/currency-context";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { BalanceSummary } from "@/lib/settlement-types";

interface BalanceSummaryProps {
  summary: BalanceSummary;
}

export function BalanceSummary({ summary }: BalanceSummaryProps) {
  const { formatAmount } = useCurrency();
  const isPositive = summary.netBalance < 0; // Negative netBalance means you're owed

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="interactive">
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">You Owe</p>
          <p className="text-heading-1 text-red-600 mb-1">
            <AnimatedNumber
              value={summary.totalYouOwe}
              formatValue={(num) => formatAmount(num.toFixed(2))}
            />
          </p>
          <p className="text-small text-muted-foreground">
            {summary.pendingYouOweCount ?? 0} pending settlement
            {(summary.pendingYouOweCount ?? 0) !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="interactive">
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">
            You&apos;re Owed
          </p>
          <p className="text-heading-1 text-green-600 mb-1">
            <AnimatedNumber
              value={summary.totalOwedToYou}
              formatValue={(num) => formatAmount(num.toFixed(2))}
            />
          </p>
          <p className="text-small text-muted-foreground">
            {summary.pendingOwedToYouCount ?? 0} pending settlement
            {(summary.pendingOwedToYouCount ?? 0) !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card
        className={`interactive ${
          isPositive
            ? "border-green-500/30 bg-green-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <CardContent className="pt-6">
          <p className="text-small text-muted-foreground mb-2">Net Balance</p>
          <p
            className={`text-heading-1 mb-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            <AnimatedNumber
              value={Math.abs(summary.netBalance)}
              formatValue={(num) => formatAmount(num.toFixed(2))}
            />
          </p>
          <p className="text-small text-muted-foreground">
            {isPositive ? "You're owed" : "You owe"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
