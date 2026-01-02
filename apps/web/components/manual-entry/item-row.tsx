"use client";

import { Button } from "@/components/ui/button";
import { ManualEntryItem } from "@/hooks/use-manual-entry";
import { Pencil, Trash2 } from "lucide-react";

interface ItemRowProps {
  item: ManualEntryItem;
  onEdit: () => void;
  onRemove: () => void;
}

export function ItemRow({ item, onEdit, onRemove }: ItemRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-body">{item.name || "Unnamed Item"}</p>
        <div className="flex items-center gap-4 mt-1">
          {item.quantity && item.quantity !== "1" && (
            <p className="text-small text-muted-foreground">
              Qty: {item.quantity}
            </p>
          )}
          {item.unitPrice && (
            <p className="text-small text-muted-foreground">
              ${item.unitPrice} each
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-body">${item.totalPrice}</p>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit item</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

