"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ManualEntryReceiptDetails, ManualEntryItem } from "@/hooks/use-manual-entry";
import { formatCurrency, getPriceEmoji, getItemCountEmoji } from "@/lib/receipt-helpers";
import { ReceiptItemsSection } from "@/components/receipt-review/receipt-items-section";

interface StepReviewProps {
  receiptDetails: ManualEntryReceiptDetails;
  items: ManualEntryItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export function StepReview({
  receiptDetails,
  items,
  subtotal,
  taxAmount,
  totalAmount,
}: StepReviewProps) {

  // Convert items to format expected by ReceiptItemsSection
  const receiptItems = items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    lineNumber: index + 1,
  }));

  const priceEmoji = getPriceEmoji(totalAmount.toFixed(2));
  const itemCountEmoji = getItemCountEmoji(items.length);

  return (
    <div className="space-y-6">
      {/* Receipt Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Summary</CardTitle>
          <CardDescription>Review your receipt details before saving</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {receiptDetails.merchantName && (
            <div>
              <p className="text-small text-muted-foreground mb-1">Merchant</p>
              <p className="text-body font-medium">{receiptDetails.merchantName}</p>
            </div>
          )}

          {receiptDetails.purchaseDate && (
            <div>
              <p className="text-small text-muted-foreground mb-1">Date</p>
              <p className="text-body font-medium">
                {new Date(receiptDetails.purchaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items List */}
      <ReceiptItemsSection
        items={receiptItems}
        tax={receiptDetails.tax || null}
        totalAmount={totalAmount.toFixed(2)}
      />
    </div>
  );
}

