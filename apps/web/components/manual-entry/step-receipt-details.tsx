"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Store, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ManualEntryReceiptDetails } from "@/hooks/use-manual-entry";
import { cn } from "@/lib/utils";

interface StepReceiptDetailsProps {
  receiptDetails: ManualEntryReceiptDetails;
  updateReceiptDetails: (updates: Partial<ManualEntryReceiptDetails>) => void;
}

export function StepReceiptDetails({
  receiptDetails,
  updateReceiptDetails,
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
    <Card>
      <CardHeader>
        <CardTitle>Receipt Details</CardTitle>
        <CardDescription>
          Enter basic information about your receipt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Merchant Name */}
        <div className="flex items-center gap-2.5">
          <div className="shrink-0">
            <Store className="size-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="merchant-name" className="text-small">
              Merchant Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="merchant-name"
              value={receiptDetails.merchantName}
              onChange={(e) =>
                updateReceiptDetails({ merchantName: e.target.value })
              }
              placeholder="e.g., Joe's Pizza"
              className={cn(
                !receiptDetails.merchantName.trim() && "border-destructive/50"
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
            <Label className="text-small">
              Purchase Date <span className="text-destructive">*</span>
            </Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11",
                    !selectedDate && "text-muted-foreground",
                    !selectedDate && "border-destructive/50"
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
            <Label htmlFor="tax" className="text-small">
              Tax Amount ($)
            </Label>
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

