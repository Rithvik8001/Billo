"use client";

import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Store,
  DollarSign,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ItemForm } from "@/components/manual-entry/item-form";
import { ItemRow } from "@/components/manual-entry/item-row";
import { ManualEntryItem } from "@/hooks/use-manual-entry";
import type { ReceiptExtractionResult } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import Image from "next/image";
interface ExtractionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: number;
  imageUrl?: string;
  extractedData: ReceiptExtractionResult;
  onConfirm: (modifiedData: ReceiptExtractionResult) => Promise<void>;
  onCancel: () => void;
}

export function ExtractionConfirmationDialog({
  open,
  onOpenChange,
  receiptId: _receiptId, // eslint-disable-line @typescript-eslint/no-unused-vars
  imageUrl,
  extractedData,
  onConfirm,
  onCancel,
}: ExtractionConfirmationDialogProps) {
  const { formatAmount } = useCurrency();
  const [merchantName, setMerchantName] = useState(
    extractedData.merchantName || ""
  );
  const [purchaseDate, setPurchaseDate] = useState(
    extractedData.purchaseDate || ""
  );
  const [tax, setTax] = useState(extractedData.tax || "");
  const [items, setItems] = useState<ManualEntryItem[]>(() =>
    extractedData.items.map((item, index) => ({
      id: `item-${index}`,
      name: item.name,
      quantity: item.quantity || "1",
      unitPrice: item.unitPrice || "0",
      totalPrice: item.totalPrice || "0",
    }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDate = purchaseDate ? new Date(purchaseDate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setPurchaseDate(formattedDate);
      setDatePickerOpen(false);
    } else {
      setPurchaseDate("");
    }
  };

  const handleAddItem = useCallback(() => {
    const newItem: ManualEntryItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      name: "",
      quantity: "1",
      unitPrice: "",
      totalPrice: "0.00",
    };
    setItems((prev) => [...prev, newItem]);
    setEditingId(newItem.id);
  }, []);

  const handleUpdateItem = useCallback(
    (id: string, updates: Partial<ManualEntryItem>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updated = { ...item, ...updates };
            // Auto-calculate totalPrice if quantity or unitPrice changed
            if (
              updates.quantity !== undefined ||
              updates.unitPrice !== undefined
            ) {
              const qty = parseFloat(updated.quantity || "1");
              const unitPrice = parseFloat(updated.unitPrice || "0");
              updated.totalPrice = (qty * unitPrice).toFixed(2);
            }
            return updated;
          }
          return item;
        })
      );
    },
    []
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    },
    [editingId]
  );

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice || "0"),
      0
    );
  }, [items]);

  const taxAmount = useMemo(() => {
    return tax ? parseFloat(tax) : 0;
  }, [tax]);

  const totalAmount = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const handleConfirm = useCallback(async () => {
    // Validate required fields
    if (!merchantName.trim()) {
      return;
    }
    if (items.length === 0) {
      return;
    }

    // Validate all items have required fields
    const invalidItems = items.filter(
      (item) => !item.name.trim() || !item.unitPrice || !item.totalPrice
    );

    if (invalidItems.length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      const modifiedData: ReceiptExtractionResult = {
        merchantName: merchantName.trim(),
        merchantAddress: extractedData.merchantAddress,
        purchaseDate: purchaseDate || undefined,
        totalAmount: totalAmount.toFixed(2),
        tax: tax || undefined,
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      };

      await onConfirm(modifiedData);
    } finally {
      setIsSaving(false);
    }
  }, [
    merchantName,
    purchaseDate,
    tax,
    items,
    extractedData.merchantAddress,
    totalAmount,
    onConfirm,
  ]);

  const handleCancel = useCallback(() => {
    onCancel();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Extracted Receipt Data</DialogTitle>
          <DialogDescription>
            Review and edit the extracted data before saving. Make sure all
            information is correct.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Receipt Image Preview */}
          {imageUrl && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt="Receipt"
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
          )}

          {/* Receipt Details */}
          <div className="space-y-3">
            <h3 className="text-heading-2">Receipt Details</h3>

            {/* Merchant Name */}
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <Store className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="confirm-merchant-name" className="text-small">
                  Merchant Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirm-merchant-name"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g., Joe's Pizza"
                  className={cn(
                    !merchantName.trim() && "border-destructive/50"
                  )}
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <CalendarIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="text-small">Purchase Date</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tax Amount */}
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <DollarSign className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="confirm-tax" className="text-small">
                  Tax Amount ($)
                </Label>
                <Input
                  id="confirm-tax"
                  type="text"
                  inputMode="decimal"
                  value={tax}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setTax(value);
                    }
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-2">Items ({items.length})</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
              >
                <Plus className="size-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) =>
                editingId === item.id ? (
                  <ItemForm
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                    onRemove={() => handleRemoveItem(item.id)}
                    onSave={() => setEditingId(null)}
                  />
                ) : (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => setEditingId(item.id)}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                )
              )}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items added. Click &quot;Add Item&quot; to add items.</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-heading-2">Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body text-muted-foreground">
                  Subtotal
                </span>
                <span className="text-body font-medium">
                  {formatAmount(subtotal.toFixed(2))}
                </span>
              </div>
              {taxAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">Tax</span>
                  <span className="text-body font-medium">
                    {formatAmount(taxAmount.toFixed(2))}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-heading-2 font-semibold">Total</span>
                <span className="text-heading-2 font-semibold">
                  {formatAmount(totalAmount.toFixed(2))}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                isSaving ||
                !merchantName.trim() ||
                items.length === 0 ||
                items.some(
                  (item) =>
                    !item.name.trim() || !item.unitPrice || !item.totalPrice
                )
              }
            >
              {isSaving ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
