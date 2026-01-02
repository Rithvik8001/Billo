"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GroupSelector } from "./group-selector";
import { PersonManager } from "./person-manager";
import { ItemAssignmentGrid } from "./item-assignment-grid";
import { AssignmentSummary } from "./assignment-summary";
import { ConfirmationDialog } from "./confirmation-dialog";
import { useItemAssignment } from "@/hooks/use-item-assignment";

interface ReceiptItem {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface AssignmentSectionProps {
  items: ReceiptItem[];
  receiptId: number;
  tax: string | null;
  totalAmount: string | null;
}

export function AssignmentSection({
  items,
  receiptId,
  tax,
  totalAmount,
}: AssignmentSectionProps) {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    selectedGroupId,
    groupMembers,
    assignments,
    personTotals,
    isLoading,
    error,
    loadGroupMembers,
    toggleAssignment,
    splitEvenly,
    saveAssignments,
  } = useItemAssignment(items, tax);

  const handleConfirm = async () => {
    try {
      await saveAssignments(receiptId);
      setSaveSuccess(true);

      // Refresh the page to show updated data
      router.refresh();

      // Auto-close dialog after success
      setTimeout(() => {
        setConfirmDialogOpen(false);
      }, 500);
    } catch (err) {
      // Error is already handled in the hook
      console.error("Failed to save assignments:", err);
    }
  };

  const canSave = personTotals.length > 0 && !isLoading;

  return (
    <div className="mt-6 space-y-6">
      {/* Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Who&apos;s Splitting This Bill?</span>
          </CardTitle>
          <CardDescription>
            Select a group and assign items to people
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupSelector
            selectedGroupId={selectedGroupId}
            onGroupSelect={loadGroupMembers}
          />
          <PersonManager members={groupMembers} />
        </CardContent>
      </Card>

      {/* Item Assignment Grid */}
      {selectedGroupId && (
        <ItemAssignmentGrid
          items={items}
          members={groupMembers}
          assignments={assignments}
          onToggleAssignment={toggleAssignment}
          onSplitEvenly={splitEvenly}
        />
      )}

      {/* Summary */}
      {personTotals.length > 0 && (
        <AssignmentSummary
          personTotals={personTotals}
          tax={tax}
          totalAmount={totalAmount}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          Assignments saved successfully!
        </div>
      )}

      {/* Action Buttons */}
      {selectedGroupId && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={splitEvenly}
            disabled={groupMembers.length === 0}
          >
            Split Evenly
          </Button>
          <Button
            onClick={() => setConfirmDialogOpen(true)}
            disabled={!canSave}
          >
            Preview & Save
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        personTotals={personTotals}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}
