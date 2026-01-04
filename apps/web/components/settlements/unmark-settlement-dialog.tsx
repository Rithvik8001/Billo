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

interface UnmarkSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  amount: string;
  userName: string;
  isLoading?: boolean;
}

export function UnmarkSettlementDialog({
  open,
  onOpenChange,
  onConfirm,
  amount,
  userName,
  isLoading = false,
}: UnmarkSettlementDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark as Unpaid?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark the settlement with{" "}
            <strong>{userName}</strong> for <strong>{amount}</strong> as unpaid?
            This will move it back to pending status and notify both parties.
            You can mark it as paid again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Unmarking..." : "Mark as Unpaid"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
