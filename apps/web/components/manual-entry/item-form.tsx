"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ManualEntryItem } from "@/hooks/use-manual-entry";
import { X } from "lucide-react";

interface ItemFormProps {
  item: ManualEntryItem;
  onUpdate: (updates: Partial<ManualEntryItem>) => void;
  onRemove: () => void;
  onSave?: () => void;
  showRemove?: boolean;
}

export function ItemForm({
  item,
  onUpdate,
  onRemove,
  onSave,
  showRemove = true,
}: ItemFormProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [unitPrice, setUnitPrice] = useState(item.unitPrice);

  useEffect(() => {
    setName(item.name);
    setQuantity(item.quantity);
    setUnitPrice(item.unitPrice);
  }, [item.id, item.name, item.quantity, item.unitPrice]);

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate({ name: value });
  };

  const handleQuantityChange = (value: string) => {
    // Allow empty, numbers, and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
      onUpdate({ quantity: value || "1" });
    }
  };

  const handleUnitPriceChange = (value: string) => {
    // Allow empty, numbers, and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUnitPrice(value);
      onUpdate({ unitPrice: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSave) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`item-name-${item.id}`}>Item Name *</Label>
            <Input
              id={`item-name-${item.id}`}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Pizza Margherita"
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
              <Input
                id={`item-quantity-${item.id}`}
                type="text"
                inputMode="decimal"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="1"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`item-unit-price-${item.id}`}>Unit Price ($) *</Label>
              <Input
                id={`item-unit-price-${item.id}`}
                type="text"
                inputMode="decimal"
                value={unitPrice}
                onChange={(e) => handleUnitPriceChange(e.target.value)}
                placeholder="0.00"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-small text-muted-foreground">Total</span>
            <span className="text-heading-2 font-semibold">
              ${item.totalPrice}
            </span>
          </div>
        </div>

        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="shrink-0"
          >
            <X className="size-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        )}
      </div>
    </div>
  );
}

