"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Receipt } from "lucide-react";
import type { SettlementWithUsers } from "@/lib/settlement-types";
import { useCurrency } from "@/contexts/currency-context";

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
  const { formatAmount } = useCurrency();
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
    <Card className="interactive">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* User Avatar */}
            {otherUser.imageUrl ? (
              <Image
                src={otherUser.imageUrl}
                alt={otherUser.name || otherUser.email}
                width={48}
                height={48}
                className="size-12 rounded-full shrink-0 ring-1 ring-border"
              />
            ) : (
              <div className="size-12 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
                <span className="text-base font-medium text-muted-foreground">
                  {otherUser.email[0].toUpperCase()}
                </span>
              </div>
            )}

            {/* Settlement Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-body truncate">
                  {otherUser.name || otherUser.email.split("@")[0]}
                </p>
                <Badge
                  variant={
                    settlement.status === "pending"
                      ? "pending"
                      : settlement.status === "completed"
                      ? "completed"
                      : "cancelled"
                  }
                  className="text-xs"
                >
                  <StatusIcon className="size-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <p className="text-small text-muted-foreground truncate mb-2">
                {otherUser.email}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`font-semibold text-body ${
                    isOwed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isOwed ? "+" : "-"}
                  {formatAmount(settlement.amount)}
                </span>

                {settlement.receipt && (
                  <Link
                    href={`/dashboard/receipts/${settlement.receipt.id}`}
                    className="text-small text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Receipt className="size-3.5" />
                    <span>{settlement.receipt.merchantName || "Receipt"}</span>
                  </Link>
                )}

                {settlement.group && (
                  <span className="text-small text-muted-foreground">
                    {settlement.group.emoji} {settlement.group.name}
                  </span>
                )}

                {settlement.settledAt && (
                  <span className="text-small text-muted-foreground">
                    Settled{" "}
                    {new Date(settlement.settledAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}
              </div>
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
