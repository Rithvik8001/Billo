"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/currency-context";
import type { PersonTotal } from "@/lib/assignment-types";

interface AssignmentSummaryProps {
  personTotals: PersonTotal[];
  tax: string | null;
  totalAmount: string | null;
}

export function AssignmentSummary({
  personTotals,
  tax,
  totalAmount,
}: AssignmentSummaryProps) {
  const { formatAmount } = useCurrency();

  if (personTotals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Split Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {personTotals.map((person) => (
          <div
            key={person.userId}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {person.imageUrl && (
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="size-6 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{person.name}</span>
                {tax && parseFloat(tax) > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatAmount(person.subtotal.toFixed(2))} + tax {formatAmount(person.taxShare.toFixed(2))}
                  </span>
                )}
              </div>
            </div>
            <span className="font-semibold">{formatAmount(person.total.toFixed(2))}</span>
          </div>
        ))}

        <Separator className="my-3" />

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatAmount(totalAmount)}</span>
        </div>

        {personTotals.length > 1 && (
          <p className="text-xs text-muted-foreground mt-2">
            Split among {personTotals.length} people
          </p>
        )}
      </CardContent>
    </Card>
  );
}
