"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ItemForm } from "./item-form";
import { ItemRow } from "./item-row";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/receipt-helpers";
import { toast } from "sonner";
import { ManualEntryItem } from "@/hooks/use-manual-entry";

interface ReceiptItem {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface EditItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: number;
  items: ReceiptItem[];
  onSuccess: () => void;
}

export function EditItemsDialog({
  open,
  onOpenChange,
  receiptId,
  items: initialItems,
  onSuccess,
}: EditItemsDialogProps) {
  const [items, setItems] = useState<Array<ReceiptItem & { tempId?: string }>>(
    initialItems.map((item) => ({ ...item, tempId: `existing-${item.id}` }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset items when dialog opens/closes
  useEffect(() => {
    if (open) {
      setItems(
        initialItems.map((item) => ({ ...item, tempId: `existing-${item.id}` }))
      );
      setEditingId(null);
    }
  }, [open, initialItems]);

  const handleAddItem = () => {
    const newItem: ReceiptItem & { tempId: string } = {
      id: 0,
      name: "",
      quantity: "1",
      unitPrice: "",
      totalPrice: "0.00",
      tempId: `temp-${Date.now()}-${Math.random()}`,
    };
    setItems([...items, newItem]);
    setEditingId(newItem.tempId);
  };

  const handleUpdateItem = (
    tempId: string,
    updates: Partial<ManualEntryItem>
  ) => {
    setItems(
      items.map((item) => {
        if (item.tempId === tempId) {
          // Exclude 'id' from updates since we use tempId for identification
          const { id, ...updateFields } = updates;
          const updated = { ...item, ...updateFields };
          // Auto-calculate totalPrice
          if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
            const qty = parseFloat(updated.quantity || "1");
            const unitPrice = parseFloat(updated.unitPrice || "0");
            updated.totalPrice = (qty * unitPrice).toFixed(2);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(items.filter((item) => item.tempId !== tempId));
    if (editingId === tempId) {
      setEditingId(null);
    }
  };

  const handleSave = async () => {
    // Validate items
    const invalidItems = items.filter(
      (item) => !item.name.trim() || !item.unitPrice || !item.totalPrice
    );

    if (invalidItems.length > 0) {
      toast.error("Please fill in all item details");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      };

      const response = await fetch(`/api/receipts/${receiptId}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update items");
      }

      toast.success("Items updated successfully!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update items";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.totalPrice || "0"),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Items</DialogTitle>
          <DialogDescription>
            Add, edit, or remove items from this receipt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-border rounded-lg">
              <p className="text-body text-muted-foreground mb-4">
                No items yet. Add your first item.
              </p>
              <Button onClick={handleAddItem} variant="outline">
                <Plus className="size-4 mr-2" />
                Add Item
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) =>
                  editingId === item.tempId ? (
                    <ItemForm
                      key={item.tempId}
                      item={{
                        id: item.tempId,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                      }}
                      onUpdate={(updates) =>
                        handleUpdateItem(item.tempId!, updates)
                      }
                      onRemove={() => handleRemoveItem(item.tempId!)}
                      onSave={() => setEditingId(null)}
                    />
                  ) : (
                    <ItemRow
                      key={item.tempId}
                      item={{
                        id: item.tempId!,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                      }}
                      onEdit={() => setEditingId(item.tempId!)}
                      onRemove={() => handleRemoveItem(item.tempId!)}
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

              <Button
                onClick={handleAddItem}
                variant="outline"
                className="w-full"
              >
                <Plus className="size-4 mr-2" />
                Add Another Item
              </Button>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || items.length === 0}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

