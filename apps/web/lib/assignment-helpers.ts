import type { GroupMember, PersonTotal, AssignmentPayload } from "./assignment-types";

interface ReceiptItem {
  id: string;
  totalPrice: string;
}

/**
 * Calculate how much each person owes based on assignments
 */
export function calculatePersonTotals(
  items: ReceiptItem[],
  assignments: Map<string, Set<string>>,
  members: GroupMember[],
  tax: string | null = null
): PersonTotal[] {
  // Initialize totals for each person
  const personTotalsMap = new Map<string, PersonTotal>();

  members.forEach((member) => {
    personTotalsMap.set(member.userId, {
      userId: member.userId,
      name: member.name || member.email.split("@")[0],
      email: member.email,
      imageUrl: member.imageUrl,
      subtotal: 0,
      taxShare: 0,
      total: 0,
    });
  });

  // Calculate subtotals
  let grandSubtotal = 0;

  items.forEach((item) => {
    const assignedUsers = assignments.get(item.id);
    if (!assignedUsers || assignedUsers.size === 0) return;

    const itemTotal = parseFloat(item.totalPrice);
    const sharePerPerson = itemTotal / assignedUsers.size;

    assignedUsers.forEach((userId) => {
      const personTotal = personTotalsMap.get(userId);
      if (personTotal) {
        personTotal.subtotal += sharePerPerson;
      }
    });

    grandSubtotal += itemTotal;
  });

  // Calculate proportional tax share
  const taxAmount = tax ? parseFloat(tax) : 0;

  personTotalsMap.forEach((personTotal) => {
    if (grandSubtotal > 0) {
      const taxRatio = personTotal.subtotal / grandSubtotal;
      personTotal.taxShare = taxAmount * taxRatio;
    }
    personTotal.total = personTotal.subtotal + personTotal.taxShare;
  });

  // Return sorted by total (highest first)
  return Array.from(personTotalsMap.values())
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);
}

/**
 * Create even split - assign all members to all items
 */
export function calculateEvenSplit(
  items: ReceiptItem[],
  memberIds: string[]
): Map<string, Set<string>> {
  const assignmentMap = new Map<string, Set<string>>();

  items.forEach((item) => {
    assignmentMap.set(item.id, new Set(memberIds));
  });

  return assignmentMap;
}

/**
 * Validate assignments before saving
 */
export function validateAssignments(
  items: ReceiptItem[],
  assignments: Map<string, Set<string>>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that every item has at least one person assigned
  items.forEach((item) => {
    const assignedUsers = assignments.get(item.id);
    if (!assignedUsers || assignedUsers.size === 0) {
      errors.push(`Item ID ${item.id} has no people assigned`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format assignments for API payload
 */
export function formatAssignmentsForAPI(
  assignments: Map<string, Set<string>>,
  items: ReceiptItem[]
): AssignmentPayload[] {
  const payload: AssignmentPayload[] = [];

  assignments.forEach((userIds, itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const itemTotal = parseFloat(item.totalPrice);
    const sharePerPerson = itemTotal / userIds.size;

    userIds.forEach((userId) => {
      payload.push({
        receiptItemId: itemId,
        userId,
        splitType: "full",
        splitValue: null,
        calculatedAmount: sharePerPerson.toFixed(2),
      });
    });
  });

  return payload;
}
