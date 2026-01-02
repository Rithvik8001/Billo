"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Receipt } from "lucide-react";
import type { SettlementWithUsers } from "@/lib/settlement-types";
import { formatCurrency } from "@/lib/receipt-helpers";

interface SettlementCardProps {
  settlement: SettlementWithUsers;
  currentUserId: string;
  onSettle?: (settlementId: number) => void;
  isSettling?: boolean;
}

export function SettlementCard({
  settlement,
  currentUserId,
  onSettle,
  isSettling = false,
}: SettlementCardProps) {
  const isOwed = settlement.toUserId === currentUserId;
  const isOwing = settlement.fromUserId === currentUserId;
  const otherUser = isOwed ? settlement.fromUser : settlement.toUser;

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
    },
    completed: {
      icon: CheckCircle2,
      label: "Paid",
      variant: "default" as const,
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      variant: "outline" as const,
    },
  };

  const status = statusConfig[settlement.status];
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* User Avatar */}
            {otherUser.imageUrl ? (
              <Image
                src={otherUser.imageUrl}
                alt={otherUser.name || otherUser.email}
                width={40}
                height={40}
                className="size-10 rounded-full shrink-0 ring-1 ring-border"
              />
            ) : (
              <div className="size-10 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
                <span className="text-sm font-medium text-muted-foreground">
                  {otherUser.email[0].toUpperCase()}
                </span>
              </div>
            )}

            {/* Settlement Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm truncate">
                  {otherUser.name || otherUser.email.split("@")[0]}
                </p>
                <Badge variant={status.variant} className="text-xs">
                  <StatusIcon className="size-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground truncate mb-2">
                {otherUser.email}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <span
                  className={`font-semibold ${
                    isOwed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isOwed ? "+" : "-"}
                  {formatCurrency(settlement.amount)}
                </span>

                {settlement.receipt && (
                  <Link
                    href={`/dashboard/receipts/${settlement.receipt.id}`}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Receipt className="size-3" />
                    <span className="text-xs">
                      {settlement.receipt.merchantName || "Receipt"}
                    </span>
                  </Link>
                )}

                {settlement.group && (
                  <span className="text-xs text-muted-foreground">
                    {settlement.group.emoji} {settlement.group.name}
                  </span>
                )}
              </div>

              {settlement.settledAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Settled on{" "}
                  {new Date(settlement.settledAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          {settlement.status === "pending" && onSettle && (
            <Button
              size="sm"
              onClick={() => onSettle(settlement.id)}
              disabled={isSettling}
              variant={isOwed ? "default" : "outline"}
            >
              {isSettling ? "Marking..." : "Mark as Paid"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

