"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettlementCard } from "@/components/settlements/settlement-card";
import { BalanceSummary } from "@/components/settlements/balance-summary";
import { SettleDialog } from "@/components/settlements/settle-dialog";
import { toast } from "sonner";
import type { SettlementWithUsers, BalanceSummary as BalanceSummaryType } from "@/lib/settlement-types";
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
    pendingCount: 0,
    completedCount: 0,
  });
  const [groups, setGroups] = useState<Array<{ id: number; name: string; emoji: string }>>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [settlingId, setSettlingId] = useState<number | null>(null);
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);
  const [settlementToSettle, setSettlementToSettle] = useState<SettlementWithUsers | null>(null);

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

  useEffect(() => {
    loadData();
  }, [selectedGroupId, statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load groups
      const groupsRes = await fetch("/api/groups");
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData.groups || []);
      }

      // Load settlements
      const params = new URLSearchParams();
      if (selectedGroupId !== "all") {
        params.append("groupId", selectedGroupId.toString());
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const settlementsRes = await fetch(`/api/settlements?${params.toString()}`);
      if (!settlementsRes.ok) {
        const errorData = await settlementsRes.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load settlements (${settlementsRes.status})`);
      }

      const settlementsData = await settlementsRes.json();
      const allSettlements = settlementsData.settlements || [];
      setSettlements(allSettlements);

      // Calculate summary from ALL settlements (not filtered)
      const allPending = allSettlements.filter(
        (s: SettlementWithUsers) => s.status === "pending"
      );
      const allCompleted = allSettlements.filter(
        (s: SettlementWithUsers) => s.status === "completed"
      );

      const totalYouOwe = allPending
        .filter((s: SettlementWithUsers) => s.fromUserId === userId)
        .reduce((sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount), 0);

      const totalOwedToYou = allPending
        .filter((s: SettlementWithUsers) => s.toUserId === userId)
        .reduce((sum: number, s: SettlementWithUsers) => sum + parseFloat(s.amount), 0);

      setSummary({
        totalYouOwe,
        totalOwedToYou,
        netBalance: totalYouOwe - totalOwedToYou,
        pendingCount: allPending.length,
        completedCount: allCompleted.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load settlements";
      toast.error(errorMessage);
      console.error("Error loading settlements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettle = (settlement: SettlementWithUsers) => {
    setSettlementToSettle(settlement);
    setSettleDialogOpen(true);
  };

  const confirmSettle = async () => {
    if (!settlementToSettle) return;

    setSettlingId(settlementToSettle.id);
    try {
      const response = await fetch(`/api/settlements/${settlementToSettle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

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
  const completedSettlements = settlements.filter((s) => s.status === "completed");

  const youOwe = pendingSettlements.filter((s) => s.fromUserId === userId);
  const youAreOwed = pendingSettlements.filter((s) => s.toUserId === userId);

  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <BalanceSummary summary={summary} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter settlements by group and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Group</label>
              <Select
                value={selectedGroupId === "all" ? "all" : selectedGroupId.toString()}
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
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
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
        </CardContent>
      </Card>

      {/* You Owe Section */}
      {youOwe.length > 0 && statusFilter !== "completed" && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
            You Owe ({formatCurrency(youOwe.reduce((sum, s) => sum + parseFloat(s.amount), 0))})
          </h2>
          <div className="space-y-3">
            {youOwe.map((settlement) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                currentUserId={userId}
                onSettle={(id) => {
                  const s = settlements.find((sett) => sett.id === id);
                  if (s) handleSettle(s);
                }}
                isSettling={settlingId === settlement.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* You're Owed Section */}
      {youAreOwed.length > 0 && statusFilter !== "completed" && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
            You&apos;re Owed ({formatCurrency(youAreOwed.reduce((sum, s) => sum + parseFloat(s.amount), 0))})
          </h2>
          <div className="space-y-3">
            {youAreOwed.map((settlement) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                currentUserId={userId}
                onSettle={(id) => {
                  const s = settlements.find((sett) => sett.id === id);
                  if (s) handleSettle(s);
                }}
                isSettling={settlingId === settlement.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Settlements */}
      {completedSettlements.length > 0 && statusFilter !== "pending" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Settlements</h2>
          <div className="space-y-3">
            {completedSettlements.map((settlement) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                currentUserId={userId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {settlements.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {statusFilter === "all"
                ? "No settlements found. Start splitting bills to see settlements here."
                : `No ${statusFilter} settlements found.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading settlements...</p>
          </CardContent>
        </Card>
      )}

      {/* Settle Dialog */}
      {settlementToSettle && (
        <SettleDialog
          open={settleDialogOpen}
          onOpenChange={setSettleDialogOpen}
          onConfirm={confirmSettle}
          amount={formatCurrency(parseFloat(settlementToSettle.amount))}
          userName={
            settlementToSettle.fromUserId === userId
              ? settlementToSettle.toUser.name || settlementToSettle.toUser.email.split("@")[0]
              : settlementToSettle.fromUser.name || settlementToSettle.fromUser.email.split("@")[0]
          }
          isLoading={settlingId === settlementToSettle.id}
        />
      )}
    </div>
  );
}

