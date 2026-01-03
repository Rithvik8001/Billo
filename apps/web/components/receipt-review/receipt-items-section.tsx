"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  calculateSubtotal,
  getPriceEmoji,
  getItemCountEmoji,
} from "@/lib/receipt-helpers";
import { useCurrency } from "@/contexts/currency-context";

interface ReceiptItemsSectionProps {
  items: Array<{
    id: number;
    name: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    lineNumber: number | null;
  }>;
  tax: string | null;
  totalAmount: string | null;
}

export function ReceiptItemsSection({
  items,
  tax,
  totalAmount,
}: ReceiptItemsSectionProps) {
  const { formatAmount } = useCurrency();

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <AlertCircle className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-heading-2 mb-2">No Items Found</h3>
          <p className="text-body text-muted-foreground">
            No items were extracted from this receipt.
          </p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = calculateSubtotal(items);
  const priceEmoji = getPriceEmoji(totalAmount);
  const itemCountEmoji = getItemCountEmoji(items.length);

  return (
    <Card>
      <CardContent className="pt-4">
        <h2 className="text-heading-2 mb-4">
          {itemCountEmoji} Items ({items.length})
        </h2>

        <div className="space-y-2 mb-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-body">{item.name}</p>
                {item.quantity && item.quantity !== "1" && (
                  <p className="text-small text-muted-foreground mt-0.5">
                    Qty: {item.quantity}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-body">
                  {formatAmount(item.totalPrice)}
                </p>
                {item.unitPrice && item.quantity !== "1" && (
                  <p className="text-small text-muted-foreground">
                    {formatAmount(item.unitPrice)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="text-heading-2 mb-3">Summary</h3>

          <div className="flex items-center justify-between">
            <p className="text-body text-muted-foreground">Subtotal</p>
            <p className="font-medium text-body">{formatAmount(subtotal)}</p>
          </div>

          {tax && (
            <div className="flex items-center justify-between">
              <p className="text-body text-muted-foreground">Tax</p>
              <p className="font-medium text-body">{formatAmount(tax)}</p>
            </div>
          )}

          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            <p className="font-semibold text-heading-2">Total {priceEmoji}</p>
            <p className="font-semibold text-heading-2">
              {formatAmount(totalAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
