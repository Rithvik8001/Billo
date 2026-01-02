"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/receipt-helpers";

interface ReceiptsClientProps {
  userId: string;
}

interface ReceiptItem {
  id: number;
  merchantName: string | null;
  totalAmount: string | null;
  purchaseDate: Date | null;
  createdAt: Date;
  status: string;
  imageUrl: string | null;
}

export function ReceiptsClient({ userId }: ReceiptsClientProps) {
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/receipts");
      if (!response.ok) {
        throw new Error("Failed to load receipts");
      }
      const data = await response.json();
      setReceipts(data.receipts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load receipts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-display">Receipts</h1>
        <p className="text-body text-muted-foreground">
          View and manage all your receipts
        </p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4">
            <p className="text-body text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : receipts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Receipt className="size-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-heading-2 mb-2">No receipts yet</h2>
            <p className="text-body text-muted-foreground mb-8">
              Start by scanning or entering a receipt manually
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/dashboard/scan-receipt">Scan Receipt</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/manual">Manual Entry</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {receipts.map((receipt) => (
            <Link
              key={receipt.id}
              href={`/dashboard/receipts/${receipt.id}`}
              className="block"
            >
              <Card className="interactive hover:border-primary/50">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Receipt className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-body truncate">
                          {receipt.merchantName || "Receipt"}
                        </p>
                        <p className="text-small text-muted-foreground">
                          {receipt.purchaseDate
                            ? new Date(receipt.purchaseDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : new Date(receipt.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {receipt.totalAmount && (
                        <p className="font-semibold text-body">
                          {formatCurrency(receipt.totalAmount)}
                        </p>
                      )}
                      <span className="text-small text-muted-foreground capitalize">
                        {receipt.status}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
