"use client";

import {
  ManualEntryReceiptDetails,
  ManualEntryItem,
} from "@/hooks/use-manual-entry";
import { ReceiptItemsSection } from "@/components/receipt-review/receipt-items-section";

interface StepReviewProps {
  receiptDetails: ManualEntryReceiptDetails;
  items: ManualEntryItem[];
  // subtotal: number;
  // taxAmount: number;
  totalAmount: number;
}

export function StepReview({
  receiptDetails,
  items,
  totalAmount,
}: StepReviewProps) {
  const receiptItems = items.map((item, index) => ({
    id: `temp-${index}`,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    lineNumber: index + 1,
  }));

  // const priceEmoji = getPriceEmoji(totalAmount.toFixed(2));
  // const itemCountEmoji = getItemCountEmoji(items.length);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-h2">Review</h2>
        <p className="text-body text-muted-foreground">
          Review your receipt details before saving
        </p>
      </div>

      <div className="space-y-6">
        {/* Receipt Summary */}
        <div className="space-y-4 p-6 border border-border/60 rounded-lg bg-[#F9FAFB]">
          {receiptDetails.merchantName && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Merchant</p>
              <p className="text-body font-medium">
                {receiptDetails.merchantName}
              </p>
            </div>
          )}

          {receiptDetails.purchaseDate && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Date</p>
              <p className="text-body font-medium">
                {new Date(receiptDetails.purchaseDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          )}
        </div>

        {/* Items Section */}
        <ReceiptItemsSection
          items={receiptItems}
          tax={receiptDetails.tax || null}
          totalAmount={totalAmount.toFixed(2)}
        />
      </div>
    </div>
  );
}
