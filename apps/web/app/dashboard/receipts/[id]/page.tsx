import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { receipts } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

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

  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, receiptId))
    .limit(1);

  if (!receipt || receipt.userId !== userId) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Receipt Review
        </h1>
        <p className="text-lg text-muted-foreground/70">
          Review and assign items from your receipt
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Receipt Details</h3>
        <div className="space-y-4">
          {receipt.merchantName && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Merchant</p>
              <p className="font-medium">{receipt.merchantName}</p>
            </div>
          )}
          {receipt.purchaseDate && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-medium">
                {new Date(receipt.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {receipt.totalAmount && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="font-medium text-lg">${receipt.totalAmount}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="font-medium capitalize">{receipt.status}</p>
          </div>
        </div>

        {receipt.imageUrl && (
          <div className="mt-6">
            <Image
              src={receipt.imageUrl}
              alt="Receipt"
              width={800}
              height={600}
              className="w-full max-w-md h-auto rounded-lg object-contain border"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">
          Receipt Review Coming Soon
        </h3>
        <p className="text-muted-foreground">
          The receipt review and item assignment interface will be available in
          Phase 5.
        </p>
      </div>
    </div>
  );
}
