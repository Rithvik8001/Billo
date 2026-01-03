"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReceiptItemsSection } from "@/components/receipt-review/receipt-items-section";
import { AssignmentSection } from "@/components/receipt-assignment/assignment-section";
import { ExistingAssignmentsView } from "@/components/receipt-assignment/existing-assignments-view";
import { EditItemsDialog } from "@/components/manual-entry/edit-items-dialog";
import { Pencil } from "lucide-react";

interface ReceiptItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  lineNumber: number | null;
}

interface ReceiptClientProps {
  receipt: {
    id: string;
    userId: string;
    imageUrl: string | null;
    merchantName: string | null;
    purchaseDate: Date | null;
    totalAmount: string | null;
    tax: string | null;
  };
  items: ReceiptItem[];
  isOwner: boolean;
  existingAssignments: Array<{
    receiptItemId: string;
    userId: string;
    userName: string | null;
    userEmail: string | null;
    userImageUrl: string | null;
    calculatedAmount: string;
  }>;
  groupInfo: { id: string; name: string; emoji: string | null } | null;
}

export function ReceiptClient({
  receipt,
  items,
  isOwner,
  existingAssignments,
  groupInfo,
}: ReceiptClientProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(
    existingAssignments.length === 0
  );
  const isManualReceipt = receipt.imageUrl === "manual";

  const handleEditSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display">Receipt Review</h1>
            <p className="text-body text-muted-foreground">
              Review and assign items from your receipt
            </p>
          </div>
          {isManualReceipt && isOwner && (
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="size-4 mr-2" />
              Edit Items
            </Button>
          )}
        </div>
      </div>

      {/* Receipt Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-6">
            {isManualReceipt ? (
              <div className="shrink-0 flex items-center justify-center w-full max-w-xs h-48 bg-muted/50 rounded-lg border border-border">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-1.5">
                    Manual Entry
                  </Badge>
                  <p className="text-small text-muted-foreground">
                    No image available
                  </p>
                </div>
              </div>
            ) : receipt.imageUrl ? (
              <div className="shrink-0">
                <Image
                  src={receipt.imageUrl}
                  alt="Receipt"
                  width={300}
                  height={400}
                  className="w-full max-w-xs h-auto rounded-lg object-contain border border-border"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-heading-2 mb-3">
                  {receipt.merchantName || "Receipt"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {receipt.purchaseDate && (
                    <div>
                      <p className="text-small text-muted-foreground mb-1">
                        Date
                      </p>
                      <p className="text-body font-medium">
                        {new Date(receipt.purchaseDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {receipt.totalAmount && (
                    <div>
                      <p className="text-small text-muted-foreground mb-1">
                        Total
                      </p>
                      <p className="text-heading-2">${receipt.totalAmount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReceiptItemsSection
        items={items}
        tax={receipt.tax}
        totalAmount={receipt.totalAmount}
      />

      {existingAssignments.length > 0 && !isEditMode ? (
        <ExistingAssignmentsView
          assignments={existingAssignments}
          items={items.map((item) => ({
            id: item.id,
            name: item.name,
            totalPrice: item.totalPrice,
          }))}
          tax={receipt.tax}
          totalAmount={receipt.totalAmount}
          groupInfo={groupInfo}
          receiptId={receipt.id}
          onReSplit={() => setIsEditMode(true)}
        />
      ) : (
        <AssignmentSection
          items={items}
          receiptId={receipt.id}
          tax={receipt.tax}
          totalAmount={receipt.totalAmount}
          onSaveSuccess={() => {
            setIsEditMode(false);
            router.refresh();
          }}
        />
      )}

      {isManualReceipt && isOwner && (
        <EditItemsDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          receiptId={receipt.id}
          items={items}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
