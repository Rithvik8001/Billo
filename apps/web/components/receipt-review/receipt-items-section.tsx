import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  calculateSubtotal,
  formatCurrency,
  getPriceEmoji,
  getItemCountEmoji,
} from "@/lib/receipt-helpers";

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
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="text-center py-8">
          <AlertCircle className="size-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="font-semibold text-lg mb-2">No Items Found</h3>
          <p className="text-muted-foreground">
            No items were extracted from this receipt.
          </p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal(items);
  const priceEmoji = getPriceEmoji(totalAmount);
  const itemCountEmoji = getItemCountEmoji(items.length);

  return (
    <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">
        {itemCountEmoji} Items ({items.length})
      </h3>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.quantity && item.quantity !== "1" && (
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">${item.totalPrice}</p>
              {item.unitPrice && item.quantity !== "1" && (
                <p className="text-xs text-muted-foreground">
                  ${item.unitPrice} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-3">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-medium">{formatCurrency(subtotal)}</p>
        </div>

        {tax && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Tax</p>
            <p className="font-medium">{formatCurrency(tax)}</p>
          </div>
        )}

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Total {priceEmoji}</p>
          <p className="font-semibold text-lg">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
}
