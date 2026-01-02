"use client";

import { useState, useCallback } from "react";
import type { GroupMember, PersonTotal } from "@/lib/assignment-types";
import {
  calculatePersonTotals,
  calculateEvenSplit,
  formatAssignmentsForAPI,
} from "@/lib/assignment-helpers";

interface ReceiptItem {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface AssignmentState {
  selectedGroupId: number | null;
  groupMembers: GroupMember[];
  assignments: Map<number, Set<string>>;
  personTotals: PersonTotal[];
  isLoading: boolean;
  error: string | null;
}

export function useItemAssignment(
  items: ReceiptItem[],
  tax: string | null
) {
  const [state, setState] = useState<AssignmentState>({
    selectedGroupId: null,
    groupMembers: [],
    assignments: new Map(),
    personTotals: [],
    isLoading: false,
    error: null,
  });

  /**
   * Load group members when a group is selected
   */
  const loadGroupMembers = useCallback(async (groupId: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/groups/${groupId}/members`);

      if (!response.ok) {
        throw new Error("Failed to load group members");
      }

      const data = await response.json();
      const members = data.members || [];

      setState((prev) => ({
        ...prev,
        selectedGroupId: groupId,
        groupMembers: members,
        assignments: new Map(),
        personTotals: [],
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load members",
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Toggle person assignment to an item
   */
  const toggleAssignment = useCallback(
    (itemId: number, userId: string) => {
      setState((prev) => {
        const newAssignments = new Map(prev.assignments);
        const assigned = newAssignments.get(itemId) || new Set<string>();

        const newAssigned = new Set(assigned);
        if (newAssigned.has(userId)) {
          newAssigned.delete(userId);
        } else {
          newAssigned.add(userId);
        }

        newAssignments.set(itemId, newAssigned);

        // Recalculate totals
        const totals = calculatePersonTotals(
          items,
          newAssignments,
          prev.groupMembers,
          tax
        );

        return {
          ...prev,
          assignments: newAssignments,
          personTotals: totals,
        };
      });
    },
    [items, tax]
  );

  /**
   * Split evenly across all people and items
   */
  const splitEvenly = useCallback(() => {
    setState((prev) => {
      const memberIds = prev.groupMembers.map((m) => m.userId);
      const evenAssignments = calculateEvenSplit(items, memberIds);
      const totals = calculatePersonTotals(
        items,
        evenAssignments,
        prev.groupMembers,
        tax
      );

      return {
        ...prev,
        assignments: evenAssignments,
        personTotals: totals,
      };
    });
  }, [items, tax]);

  /**
   * Save assignments to the database
   */
  const saveAssignments = useCallback(
    async (receiptId: number) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const payload = formatAssignmentsForAPI(state.assignments, items);

        const response = await fetch(`/api/receipts/${receiptId}/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignments: payload,
            groupId: state.selectedGroupId || undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save assignments");
        }

        const result = await response.json();

        setState((prev) => ({ ...prev, isLoading: false }));

        return result;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to save assignments",
          isLoading: false,
        }));
        throw err;
      }
    },
    [state.assignments, items]
  );

  return {
    selectedGroupId: state.selectedGroupId,
    groupMembers: state.groupMembers,
    assignments: state.assignments,
    personTotals: state.personTotals,
    isLoading: state.isLoading,
    error: state.error,
    loadGroupMembers,
    toggleAssignment,
    splitEvenly,
    saveAssignments,
  };
}
