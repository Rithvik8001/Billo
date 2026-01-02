"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BalanceSummary } from "@/components/settlements/balance-summary";
import { SettleDialog } from "@/components/settlements/settle-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Receipt } from "lucide-react";
import { toast } from "sonner";
import type {
  SettlementWithUsers,
  BalanceSummary as BalanceSummaryType,
} from "@/lib/settlement-types";
import { formatCurrency } from "@/lib/receipt-helpers";

interface SettleUpClientProps {
  userId: string;
}

export function SettleUpClient({ userId }: SettleUpClientProps) {
  const router = useRouter();
  const [settlements, setSettlements] = useState<SettlementWithUsers[]>([]);
  const [summary, setSummary] = useState<BalanceSummaryType>({
    totalYouOwe: 0,
    totalOwedToYou: 0,
    netBalance: 0,
    pendingYouOweCount: 0,
    pendingOwedToYouCount: 0,
    completedCount: 0,
  });
  const [groups, setGroups] = useState<
    Array<{ id: number; name: string; emoji: string }>
  >([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [settlingId, setSettlingId] = useState<number | null>(null);
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);
  const [settlementToSettle, setSettlementToSettle] =
    useState<SettlementWithUsers | null>(null);

  // Initialize from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const groupIdParam = params.get("groupId");
      if (groupIdParam) {
        setSelectedGroupId(parseInt(groupIdParam, 10));
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load groups
      const groupsRes = await fetch("/api/groups");
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData.groups || []);
      }

      // Load settlements with filters for display
      const params = new URLSearchParams();
      if (selectedGroupId !== "all") {
        params.append("groupId", selectedGroupId.toString());
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const settlementsRes = await fetch(
        `/api/settlements?${params.toString()}`
      );
      if (!settlementsRes.ok) {
        const errorData = await settlementsRes.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to load settlements (${settlementsRes.status})`
        );
      }

      const settlementsData = await settlementsRes.json();
      const filteredSettlements = settlementsData.settlements || [];
      setSettlements(filteredSettlements);

      // Fetch ALL settlements separately for summary calculation (no filters)
      // This ensures summary always shows correct totals regardless of current filters
      const allSettlementsRes = await fetch("/api/settlements").catch(
        () => null
      );

      if (allSettlementsRes && allSettlementsRes.ok) {
        const allSettlementsData = await allSettlementsRes.json();
        const allSettlements = allSettlementsData.settlements || [];

        // Calculate summary from ALL settlements (not filtered)
        const allPending = allSettlements.filter(
          (s: SettlementWithUsers) => s.status === "pending"
        );
        const allCompleted = allSettlements.filter(
          (s: SettlementWithUsers) => s.status === "completed"
        );

        const youOweSettlements = allPending.filter(
          (s: SettlementWithUsers) => s.fromUserId === userId
        );
        const owedToYouSettlements = allPending.filter(
          (s: SettlementWithUsers) => s.toUserId === userId
        );

        const totalYouOwe = youOweSettlements.reduce(
          (sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount),
          0
        );

        const totalOwedToYou = owedToYouSettlements.reduce(
          (sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount),
          0
        );

        setSummary({
          totalYouOwe,
          totalOwedToYou,
          netBalance: totalYouOwe - totalOwedToYou,
          pendingYouOweCount: youOweSettlements.length,
          pendingOwedToYouCount: owedToYouSettlements.length,
          completedCount: allCompleted.length,
        });
      } else {
        const allPending = filteredSettlements.filter(
          (s: SettlementWithUsers) => s.status === "pending"
        );
        const allCompleted = filteredSettlements.filter(
          (s: SettlementWithUsers) => s.status === "completed"
        );

        const youOweSettlements = allPending.filter(
          (s: SettlementWithUsers) => s.fromUserId === userId
        );
        const owedToYouSettlements = allPending.filter(
          (s: SettlementWithUsers) => s.toUserId === userId
        );

        const totalYouOwe = youOweSettlements.reduce(
          (sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount),
          0
        );

        const totalOwedToYou = owedToYouSettlements.reduce(
          (sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount),
          0
        );

        setSummary({
          totalYouOwe,
          totalOwedToYou,
          netBalance: totalYouOwe - totalOwedToYou,
          pendingYouOweCount: youOweSettlements.length,
          pendingOwedToYouCount: owedToYouSettlements.length,
          completedCount: allCompleted.length,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load settlements";
      toast.error(errorMessage);
      console.error("Error loading settlements:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGroupId, statusFilter, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettle = (settlement: SettlementWithUsers) => {
    setSettlementToSettle(settlement);
    setSettleDialogOpen(true);
  };

  const confirmSettle = async () => {
    if (!settlementToSettle) return;

    setSettlingId(settlementToSettle.id);
    try {
      const response = await fetch(
        `/api/settlements/${settlementToSettle.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark as paid");
      }

      toast.success("Settlement marked as paid");
      setSettleDialogOpen(false);
      setSettlementToSettle(null);
      router.refresh();
      loadData();
    } catch (error) {
      toast.error("Failed to mark settlement as paid");
      console.error(error);
    } finally {
      setSettlingId(null);
    }
  };

  const pendingSettlements = settlements.filter((s) => s.status === "pending");
  const completedSettlements = settlements.filter(
    (s) => s.status === "completed"
  );

  const youOwe = pendingSettlements.filter((s) => s.fromUserId === userId);
  const youAreOwed = pendingSettlements.filter((s) => s.toUserId === userId);

  // Helper function to render user avatar
  const renderUserAvatar = (user: {
    imageUrl: string | null;
    name: string | null;
    email: string;
  }) => {
    if (user.imageUrl) {
      return (
        <Image
          src={user.imageUrl}
          alt={user.name || user.email}
          width={32}
          height={32}
          className="size-8 rounded-full shrink-0 ring-1 ring-border"
        />
      );
    }
    return (
      <div className="size-8 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
        <span className="text-xs font-medium text-muted-foreground">
          {user.email[0].toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-display">Settle Up</h1>
        <p className="text-body text-muted-foreground">
          Track who owes what and mark payments as settled
        </p>
      </div>

      {/* Balance Summary */}
      <BalanceSummary summary={summary} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-small font-medium mb-2 block text-foreground">
            Group
          </label>
          <Select
            value={
              selectedGroupId === "all" ? "all" : selectedGroupId.toString()
            }
            onValueChange={(value) =>
              setSelectedGroupId(value === "all" ? "all" : parseInt(value, 10))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.emoji} {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-small font-medium mb-2 block text-foreground">
            Status
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "pending" | "completed") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* You Owe Section */}
      {youOwe.length > 0 && statusFilter !== "completed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-red-600">You Owe</h2>
            <p className="text-body font-semibold text-red-600">
              {formatCurrency(
                youOwe
                  .reduce((sum, s) => sum + parseFloat(s.amount), 0)
                  .toFixed(2)
              )}
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {youOwe.map((settlement) => {
                    const otherUser = settlement.toUser;
                    return (
                      <TableRow key={settlement.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {renderUserAvatar(otherUser)}
                            <div>
                              <p className="font-medium text-body">
                                {otherUser.name ||
                                  otherUser.email.split("@")[0]}
                              </p>
                              <p className="text-small text-muted-foreground">
                                {otherUser.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {settlement.receipt ? (
                            <Link
                              href={`/dashboard/receipts/${settlement.receipt.id}`}
                              className="text-small text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                              <Receipt className="size-3.5" />
                              <span>
                                {settlement.receipt.merchantName || "Receipt"}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {settlement.group ? (
                            <span className="text-small text-muted-foreground">
                              {settlement.group.emoji} {settlement.group.name}
                            </span>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-body text-red-600">
                            -{formatCurrency(settlement.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSettle(settlement)}
                            disabled={settlingId === settlement.id}
                          >
                            {settlingId === settlement.id
                              ? "Marking..."
                              : "Mark as Paid"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* You're Owed Section */}
      {youAreOwed.length > 0 && statusFilter !== "completed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-green-600">You&apos;re Owed</h2>
            <p className="text-body font-semibold text-green-600">
              {formatCurrency(
                youAreOwed
                  .reduce((sum, s) => sum + parseFloat(s.amount), 0)
                  .toFixed(2)
              )}
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {youAreOwed.map((settlement) => {
                    const otherUser = settlement.fromUser;
                    return (
                      <TableRow key={settlement.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {renderUserAvatar(otherUser)}
                            <div>
                              <p className="font-medium text-body">
                                {otherUser.name ||
                                  otherUser.email.split("@")[0]}
                              </p>
                              <p className="text-small text-muted-foreground">
                                {otherUser.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {settlement.receipt ? (
                            <Link
                              href={`/dashboard/receipts/${settlement.receipt.id}`}
                              className="text-small text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                              <Receipt className="size-3.5" />
                              <span>
                                {settlement.receipt.merchantName || "Receipt"}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {settlement.group ? (
                            <span className="text-small text-muted-foreground">
                              {settlement.group.emoji} {settlement.group.name}
                            </span>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-body text-green-600">
                            +{formatCurrency(settlement.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleSettle(settlement)}
                            disabled={settlingId === settlement.id}
                          >
                            {settlingId === settlement.id
                              ? "Marking..."
                              : "Mark as Paid"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completed Settlements */}
      {completedSettlements.length > 0 && statusFilter !== "pending" && (
        <div className="space-y-4">
          <h2 className="text-heading-2">Completed Settlements</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Settled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedSettlements.map((settlement) => {
                    const isOwed = settlement.toUserId === userId;
                    const otherUser = isOwed
                      ? settlement.fromUser
                      : settlement.toUser;
                    return (
                      <TableRow key={settlement.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {renderUserAvatar(otherUser)}
                            <div>
                              <p className="font-medium text-body">
                                {otherUser.name ||
                                  otherUser.email.split("@")[0]}
                              </p>
                              <p className="text-small text-muted-foreground">
                                {otherUser.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {settlement.receipt ? (
                            <Link
                              href={`/dashboard/receipts/${settlement.receipt.id}`}
                              className="text-small text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                              <Receipt className="size-3.5" />
                              <span>
                                {settlement.receipt.merchantName || "Receipt"}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {settlement.group ? (
                            <span className="text-small text-muted-foreground">
                              {settlement.group.emoji} {settlement.group.name}
                            </span>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="completed">
                            <CheckCircle2 className="size-3 mr-1" />
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-semibold text-body ${
                              isOwed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isOwed ? "+" : "-"}
                            {formatCurrency(settlement.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {settlement.settledAt ? (
                            <span className="text-small text-muted-foreground">
                              {new Date(
                                settlement.settledAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-small text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {settlements.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-body text-muted-foreground">
              {statusFilter === "all"
                ? "No settlements found. Start splitting bills to see settlements here."
                : `No ${statusFilter} settlements found.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settle Dialog */}
      {settlementToSettle && (
        <SettleDialog
          open={settleDialogOpen}
          onOpenChange={setSettleDialogOpen}
          onConfirm={confirmSettle}
          amount={formatCurrency(settlementToSettle.amount)}
          userName={
            settlementToSettle.fromUserId === userId
              ? settlementToSettle.toUser.name ||
                settlementToSettle.toUser.email.split("@")[0]
              : settlementToSettle.fromUser.name ||
                settlementToSettle.fromUser.email.split("@")[0]
          }
          isLoading={settlingId === settlementToSettle.id}
        />
      )}
    </div>
  );
}
