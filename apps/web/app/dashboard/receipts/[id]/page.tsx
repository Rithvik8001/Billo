import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts } from "@/db/models/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ReceiptItemsSection } from "@/components/receipt-review/receipt-items-section";
import { AssignmentSection } from "@/components/receipt-assignment/assignment-section";

interface ReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const { id } = await params;
  const receiptId = parseInt(id, 10);

  if (isNaN(receiptId)) {
    notFound();
  }

  const receipt = await db.query.receipts.findFirst({
    where: eq(receipts.id, receiptId),
    with: {
      items: {
        orderBy: (items) => [asc(items.lineNumber)],
      },
    },
  });

  if (!receipt || receipt.userId !== userId) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-display">Receipt Review</h1>
        <p className="text-body text-muted-foreground">
          Review and assign items from your receipt
        </p>
      </div>

      {/* Receipt Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            {receipt.imageUrl && (
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
            )}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-heading-2 mb-4">
                  {receipt.merchantName || "Receipt"}
                </h2>
                <div className="grid grid-cols-2 gap-6">
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
        items={receipt.items}
        tax={receipt.tax}
        totalAmount={receipt.totalAmount}
      />

      <AssignmentSection
        items={receipt.items}
        receiptId={receipt.id}
        tax={receipt.tax}
        totalAmount={receipt.totalAmount}
      />
    </div>
  );
}
