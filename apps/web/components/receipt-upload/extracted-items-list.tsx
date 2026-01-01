import type { ReceiptExtractionResult } from "@/lib/ai/schemas";

interface ExtractedItemsListProps {
  items: ReceiptExtractionResult["items"];
}

export function ExtractedItemsList({ items }: ExtractedItemsListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">
        Extracted Items ({items.length})
      </h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name || "Item"}</p>
              {item.quantity && (
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${item.totalPrice || item.unitPrice || "0.00"}
              </p>
              {item.unitPrice && item.totalPrice && (
                <p className="text-xs text-muted-foreground">
                  ${item.unitPrice} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

