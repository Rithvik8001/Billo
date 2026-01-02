"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { PersonTotal } from "@/lib/assignment-types";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personTotals: PersonTotal[];
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  personTotals,
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Bill Split</AlertDialogTitle>
          <AlertDialogDescription>
            Review the split before saving. Once saved, this will assign items
            to people.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2">
          <p className="text-sm font-medium">Split Summary:</p>
          {personTotals.map((person) => (
            <div
              key={person.userId}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                {person.imageUrl && (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="size-5 rounded-full"
                  />
                )}
                <span>{person.name}</span>
              </div>
              <span className="font-medium">${person.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Saving..." : "Confirm & Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
