"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, ArrowRight } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface ReceiptsClientProps {
  userId: string;
}

interface ReceiptItem {
  id: string;
  merchantName: string | null;
  totalAmount: string | null;
  purchaseDate: Date | null;
  createdAt: Date;
  status: string;
  imageUrl: string | null;
}

export function ReceiptsClient({ userId }: ReceiptsClientProps) {
  const { formatAmount } = useCurrency();
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
      <div className="space-y-1">
        <h1 className="text-h1">Receipts</h1>
        <p className="text-body text-muted-foreground">
          View and manage all your receipts
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-body text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse ml-auto" />
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : receipts.length === 0 ? (
        <div className="py-20 text-center">
          <Receipt className="size-16 mx-auto mb-6 text-muted-foreground opacity-40" />
          <h2 className="text-h2 mb-2">No receipts yet</h2>
          <p className="text-body text-muted-foreground mb-8">
            Start by scanning or entering a receipt manually
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/dashboard/scan-receipt">Scan Receipt</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/manual">Manual Entry</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {receipts.map((receipt) => (
              <Card
                key={receipt.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => {
                  window.location.href = `/dashboard/receipts/${receipt.id}`;
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-body truncate">
                          {receipt.merchantName || "Receipt"}
                        </p>
                        <Badge
                          variant={
                            receipt.status === "completed"
                              ? "completed"
                              : receipt.status === "failed"
                              ? "cancelled"
                              : "pending"
                          }
                          className="capitalize shrink-0"
                        >
                          {receipt.status}
                        </Badge>
                      </div>
                      <span className="text-small text-muted-foreground">
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
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {receipt.totalAmount && (
                        <p className="font-medium text-body font-mono">
                          {formatAmount(receipt.totalAmount)}
                        </p>
                      )}
                      <ArrowRight className="size-4 text-muted-foreground opacity-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      className="cursor-pointer"
                      onClick={() => {
                        window.location.href = `/dashboard/receipts/${receipt.id}`;
                      }}
                    >
                      <TableCell>
                        <p className="font-medium text-body">
                          {receipt.merchantName || "Receipt"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-small text-muted-foreground">
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
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            receipt.status === "completed"
                              ? "completed"
                              : receipt.status === "failed"
                              ? "cancelled"
                              : "pending"
                          }
                          className="capitalize"
                        >
                          {receipt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {receipt.totalAmount ? (
                          <p className="font-medium text-body font-mono">
                            {formatAmount(receipt.totalAmount)}
                          </p>
                        ) : (
                          <span className="text-small text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <ArrowRight className="size-4 text-muted-foreground opacity-40" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
