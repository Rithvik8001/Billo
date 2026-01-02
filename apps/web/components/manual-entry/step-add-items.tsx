"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ItemForm } from "./item-form";
import { ItemRow } from "./item-row";
import { ManualEntryItem } from "@/hooks/use-manual-entry";
import { Plus, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/receipt-helpers";

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
    <Card>
      <CardHeader>
        <CardTitle>Add Items</CardTitle>
        <CardDescription>
          Add items to your receipt. Each item needs a name and price.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-border rounded-lg">
            <ShoppingCart className="size-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-heading-2 mb-1.5">No Items Yet</h3>
            <p className="text-body text-muted-foreground mb-4">
              Add your first item to get started
            </p>
            <Button onClick={handleAddItem}>
              <Plus className="size-4 mr-2" />
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

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-body text-muted-foreground">Subtotal</span>
              <span className="text-heading-2 font-semibold">
                {formatCurrency(subtotal.toFixed(2))}
              </span>
            </div>

            <Button onClick={handleAddItem} variant="outline" className="w-full">
              <Plus className="size-4 mr-2" />
              Add Another Item
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

