"use client";

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
      <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
          You Owe
        </p>
        <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
          <AnimatedNumber
            value={summary.totalYouOwe}
            formatValue={(num) => formatAmount(num.toFixed(2))}
          />
        </p>
        <p className="text-xs text-muted-foreground">
          {summary.pendingYouOweCount ?? 0} pending settlement
          {(summary.pendingYouOweCount ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
          You&apos;re Owed
        </p>
        <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
          <AnimatedNumber
            value={summary.totalOwedToYou}
            formatValue={(num) => formatAmount(num.toFixed(2))}
          />
        </p>
        <p className="text-xs text-muted-foreground">
          {summary.pendingOwedToYouCount ?? 0} pending settlement
          {(summary.pendingOwedToYouCount ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-[#F9FAFB] rounded-lg p-4 md:p-6">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
          Net Balance
        </p>
        <p className="text-[28px] font-mono font-semibold mb-1 leading-tight">
          {isPositive ? "+" : ""}
          <AnimatedNumber
            value={Math.abs(summary.netBalance)}
            formatValue={(num) => formatAmount(num.toFixed(2))}
          />
        </p>
        <p className="text-xs text-muted-foreground">
          {isPositive ? "You're owed" : "You owe"}
        </p>
      </div>
    </div>
  );
}
