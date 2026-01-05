"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemForm } from "./item-form";
import { ItemRow } from "./item-row";
import { ManualEntryItem } from "@/hooks/use-manual-entry";
import { Plus, ShoppingCart } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface StepAddItemsProps {
  items: ManualEntryItem[];
  addItem: () => string;
  updateItem: (id: string, updates: Partial<ManualEntryItem>) => void;
  removeItem: (id: string) => void;
  subtotal: number;
}

export function StepAddItems({
  items,
  addItem,
  updateItem,
  removeItem,
  subtotal,
}: StepAddItemsProps) {
  const { formatAmount } = useCurrency();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddItem = () => {
    const newId = addItem();
    setEditingId(newId);
  };

  const handleEditItem = (id: string) => {
    setEditingId(id);
  };

  const handleSaveItem = () => {
    setEditingId(null);
  };

  const handleUpdateItem = (id: string, updates: Partial<ManualEntryItem>) => {
    updateItem(id, updates);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-h2">Add Items</h2>
        <p className="text-body text-muted-foreground">
          Add items to your receipt. Each item needs a name and price.
        </p>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border/60 rounded-lg bg-[#F9FAFB]">
            <ShoppingCart className="size-10 mx-auto mb-3 text-muted-foreground opacity-40" />
            <h3 className="text-h3 mb-1.5">No Items Yet</h3>
            <p className="text-body text-muted-foreground mb-4">
              Add your first item to get started
            </p>
            <Button onClick={handleAddItem} className="gap-2">
              <Plus className="size-4" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) =>
                editingId === item.id ? (
                  <ItemForm
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                    onRemove={() => handleRemoveItem(item.id)}
                    onSave={handleSaveItem}
                  />
                ) : (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => handleEditItem(item.id)}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                )
              )}
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-body text-muted-foreground">Subtotal</span>
                <span className="text-h3 font-medium font-mono">
                  {formatAmount(subtotal.toFixed(2))}
                </span>
              </div>

              <Button
                onClick={handleAddItem}
                variant="ghost"
                className="w-full gap-2"
              >
                <Plus className="size-4" />
                Add Another Item
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
