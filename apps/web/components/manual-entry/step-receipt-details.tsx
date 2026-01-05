"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Store, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ManualEntryReceiptDetails } from "@/hooks/use-manual-entry";
import { cn } from "@/lib/utils";
import { PhotoUploadField } from "./photo-upload-field";

interface StepReceiptDetailsProps {
  receiptDetails: ManualEntryReceiptDetails;
  updateReceiptDetails: (updates: Partial<ManualEntryReceiptDetails>) => void;
  imageUrl?: string;
  imagePublicId?: string;
  uploadPhoto: (imageUrl: string, imagePublicId: string) => void;
  removePhoto: () => void;
}

export function StepReceiptDetails({
  receiptDetails,
  updateReceiptDetails,
  imageUrl,
  imagePublicId,
  uploadPhoto,
  removePhoto,
}: StepReceiptDetailsProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const selectedDate = receiptDetails.purchaseDate
    ? new Date(receiptDetails.purchaseDate)
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD for ISO string compatibility
      const formattedDate = format(date, "yyyy-MM-dd");
      updateReceiptDetails({ purchaseDate: formattedDate });
      setDatePickerOpen(false);
    } else {
      updateReceiptDetails({ purchaseDate: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-h2">Receipt Details</h2>
        <p className="text-body text-muted-foreground">
          Enter basic information about your receipt
        </p>
      </div>
      
      <div className="space-y-5">
        {/* Merchant Name */}
        <div className="space-y-2">
          <Label htmlFor="merchant-name" className="text-small font-medium">
            Merchant Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="merchant-name"
              value={receiptDetails.merchantName}
              onChange={(e) =>
                updateReceiptDetails({ merchantName: e.target.value })
              }
              placeholder="e.g., Joe's Pizza"
              className={cn(
                "pl-10",
                !receiptDetails.merchantName.trim() && "border-destructive/50"
              )}
            />
          </div>
        </div>

        {/* Purchase Date */}
        <div className="space-y-2">
          <Label className="text-small font-medium">
            Purchase Date <span className="text-destructive">*</span>
          </Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 pl-10 relative",
                  !selectedDate && "text-muted-foreground",
                  !selectedDate && "border-destructive/50"
                )}
              >
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 pointer-events-none" />
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

        {/* Tax Amount */}
        <div className="space-y-2">
          <Label htmlFor="tax" className="text-small font-medium">
            Tax Amount ($)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="tax"
              type="text"
              inputMode="decimal"
              value={receiptDetails.tax}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty, numbers, and decimals
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  updateReceiptDetails({ tax: value });
                }
              }}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <PhotoUploadField
          imageUrl={imageUrl}
          imagePublicId={imagePublicId}
          onUpload={uploadPhoto}
          onRemove={removePhoto}
        />
      </div>
    </div>
  );
}

