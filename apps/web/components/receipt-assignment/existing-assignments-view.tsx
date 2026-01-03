"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useCurrency } from "@/contexts/currency-context";
import { Edit2, Users, AlertTriangle } from "lucide-react";
import type { PersonTotal } from "@/lib/assignment-types";
import Image from "next/image";
import { toast } from "sonner";

interface ExistingAssignment {
  receiptItemId: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImageUrl: string | null;
  calculatedAmount: string;
}

interface ExistingAssignmentsViewProps {
  assignments: ExistingAssignment[];
  items: Array<{ id: string; name: string; totalPrice: string }>;
  tax: string | null;
  totalAmount: string | null;
  groupInfo: { id: string; name: string; emoji: string | null } | null;
  receiptId: string;
  onReSplit: () => void;
}

export function ExistingAssignmentsView({
  assignments,
  items,
  tax,
  totalAmount,
  groupInfo,
  receiptId,
  onReSplit,
}: ExistingAssignmentsViewProps) {
  const { formatAmount } = useCurrency();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [settlementStatus, setSettlementStatus] = useState<{
    hasSettlements: boolean;
    hasCompletedSettlements: boolean;
    hasPendingSettlements: boolean;
  } | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Check settlement status on mount
  useEffect(() => {
    const checkSettlementStatus = async () => {
      try {
        const response = await fetch(`/api/receipts/${receiptId}/settlements`);
        if (response.ok) {
          const data = await response.json();
          setSettlementStatus({
            hasSettlements: data.hasSettlements,
            hasCompletedSettlements: data.hasCompletedSettlements,
            hasPendingSettlements: data.hasPendingSettlements,
          });
        }
      } catch (error) {
        console.error("Failed to check settlement status:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkSettlementStatus();
  }, [receiptId]);

  const handleReSplitClick = () => {
    if (
      settlementStatus?.hasSettlements &&
      !settlementStatus.hasCompletedSettlements
    ) {
      // Show confirmation for pending settlements
      setShowConfirmDialog(true);
    } else if (settlementStatus?.hasCompletedSettlements) {
      // Show error - cannot re-split with completed settlements
      toast.error(
        "Cannot re-split receipt with completed settlements. Please mark all settlements as pending or cancelled first."
      );
    } else {
      // No settlements, proceed directly
      onReSplit();
    }
  };

  const handleConfirmReSplit = () => {
    setShowConfirmDialog(false);
    onReSplit();
  };

  // Convert assignments to PersonTotal format
  const personTotalsMap = new Map<string, PersonTotal>();

  assignments.forEach((assignment) => {
    const existing = personTotalsMap.get(assignment.userId);
    const amount = parseFloat(assignment.calculatedAmount);

    if (existing) {
      existing.subtotal += amount;
      existing.total += amount;
    } else {
      personTotalsMap.set(assignment.userId, {
        userId: assignment.userId,
        name:
          assignment.userName ||
          assignment.userEmail?.split("@")[0] ||
          "Unknown",
        email: assignment.userEmail || "",
        imageUrl: assignment.userImageUrl,
        subtotal: amount,
        taxShare: 0, // Tax is already included in calculatedAmount
        total: amount,
      });
    }
  });

  // Apply tax proportionally if tax exists
  if (tax && parseFloat(tax) > 0) {
    const taxAmount = parseFloat(tax);
    const totalSubtotal = Array.from(personTotalsMap.values()).reduce(
      (sum, p) => sum + p.subtotal,
      0
    );

    personTotalsMap.forEach((personTotal) => {
      if (totalSubtotal > 0) {
        personTotal.taxShare =
          (personTotal.subtotal / totalSubtotal) * taxAmount;
        personTotal.total = personTotal.subtotal + personTotal.taxShare;
      }
    });
  }

  const personTotals = Array.from(personTotalsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            <span>Bill Split</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReSplitClick}
            disabled={isLoadingStatus}
          >
            <Edit2 className="size-4 mr-2" />
            Re-split
          </Button>
        </div>
        {groupInfo && (
          <p className="text-sm text-muted-foreground mt-2">
            Split with {groupInfo.emoji} {groupInfo.name}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {personTotals.map((person) => (
          <div
            key={person.userId}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {person.imageUrl && (
                <Image
                  src={person.imageUrl}
                  alt={person.name}
                  width={24}
                  height={24}
                  className="size-6 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{person.name}</span>
                {tax && parseFloat(tax) > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatAmount(person.subtotal.toFixed(2))} + tax{" "}
                    {formatAmount(person.taxShare.toFixed(2))}
                  </span>
                )}
              </div>
            </div>
            <span className="font-semibold">
              {formatAmount(person.total.toFixed(2))}
            </span>
          </div>
        ))}

        <Separator className="my-3" />

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{totalAmount ? formatAmount(totalAmount) : "—"}</span>
        </div>

        {personTotals.length > 1 && (
          <p className="text-xs text-muted-foreground mt-2">
            Split among {personTotals.length} people
          </p>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />
              Re-split Receipt?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This receipt has pending settlements. Re-splitting will delete
              existing pending settlements and create new ones based on the new
              split. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReSplit}>
              Continue Re-split
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
