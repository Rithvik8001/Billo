import { useApiClient } from "./api-client";
import type { ActivityItem, ActivityType } from "@/types/activity";

// API response types
interface SettlementWithUsers {
  id: string;
  receiptId: string | null;
  groupId: string | null;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  settledAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  fromUser: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  toUser: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  receipt?: {
    id: string;
    merchantName: string | null;
    purchaseDate: string | null;
    totalAmount: string | null;
  } | null;
  group?: {
    id: string;
    name: string;
    emoji: string;
  } | null;
}

interface Receipt {
  id: string;
  userId: string;
  imageUrl: string;
  imagePublicId: string;
  thumbnailUrl: string | null;
  merchantName: string | null;
  merchantAddress: string | null;
  purchaseDate: string | null;
  totalAmount: string | null;
  tax: string | null;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  groupId: string | null;
  extractedData: unknown;
  extractionError: string | null;
  extractedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Format amount helper
function formatAmount(amount: string, currency: string = "USD"): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "$0.00";
  
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toFixed(2)}`;
}

// Format timestamp helper
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Transform settlement to activity item
function transformSettlement(
  settlement: SettlementWithUsers,
  currentUserId: string
): ActivityItem | null {
  const isOwing = settlement.fromUserId === currentUserId;
  const isOwed = settlement.toUserId === currentUserId;
  
  if (!isOwing && !isOwed) {
    return null; // User not involved in this settlement
  }

  const otherUser = isOwing ? settlement.toUser : settlement.fromUser;
  const otherUserName = otherUser.name || otherUser.email.split("@")[0];
  const amount = formatAmount(settlement.amount, settlement.currency);

  if (settlement.status === "completed") {
    // Payment completed
    return {
      id: `payment-${settlement.id}`,
      type: "payment",
      title: `Payment completed`,
      description: isOwing
        ? `You paid ${otherUserName}`
        : `${otherUserName} paid you`,
      timestamp: settlement.settledAt || settlement.updatedAt,
      amount,
      amountType: isOwing ? "owe" : "owed",
      metadata: {
        settlementId: settlement.id,
        receiptId: settlement.receiptId || undefined,
        groupId: settlement.groupId || undefined,
        groupName: settlement.group?.name,
        merchantName: settlement.receipt?.merchantName || undefined,
        otherUserName,
      },
    };
  } else if (settlement.status === "pending") {
    // Pending settlement
    return {
      id: `settlement-${settlement.id}`,
      type: "settlement",
      title: isOwing ? `You owe ${otherUserName}` : `${otherUserName} owes you`,
      description: settlement.receipt?.merchantName
        ? `For ${settlement.receipt.merchantName}`
        : settlement.group?.name
        ? `In ${settlement.group.emoji} ${settlement.group.name}`
        : undefined,
      timestamp: settlement.createdAt,
      amount,
      amountType: isOwing ? "owe" : "owed",
      metadata: {
        settlementId: settlement.id,
        receiptId: settlement.receiptId || undefined,
        groupId: settlement.groupId || undefined,
        groupName: settlement.group?.name,
        merchantName: settlement.receipt?.merchantName || undefined,
        otherUserName,
      },
    };
  }

  return null; // Cancelled settlements are not shown
}

// Transform receipt to activity item
function transformReceipt(receipt: Receipt): ActivityItem | null {
  if (receipt.status === "completed") {
    return {
      id: `receipt-${receipt.id}`,
      type: "receipt",
      title: receipt.merchantName
        ? `Receipt at ${receipt.merchantName}`
        : "Receipt scanned",
      description: receipt.totalAmount
        ? `Total: ${formatAmount(receipt.totalAmount)}`
        : undefined,
      timestamp: receipt.createdAt,
      amount: receipt.totalAmount ? formatAmount(receipt.totalAmount) : undefined,
      amountType: "neutral",
      metadata: {
        receiptId: receipt.id,
        groupId: receipt.groupId || undefined,
        merchantName: receipt.merchantName || undefined,
      },
    };
  } else if (receipt.status === "processing") {
    return {
      id: `receipt-processing-${receipt.id}`,
      type: "receipt",
      title: "Processing receipt...",
      description: receipt.merchantName || "Extracting details",
      timestamp: receipt.createdAt,
      metadata: {
        receiptId: receipt.id,
        groupId: receipt.groupId || undefined,
        merchantName: receipt.merchantName || undefined,
      },
    };
  }

  return null; // Other statuses not shown
}

export function useActivityService() {
  const { apiRequest } = useApiClient();

  const fetchActivity = async (
    currentUserId: string
  ): Promise<ActivityItem[]> => {
    try {
      // Fetch settlements and receipts in parallel
      const [settlementsRes, receiptsRes] = await Promise.all([
        apiRequest<{ settlements: SettlementWithUsers[] }>("/api/settlements"),
        apiRequest<{ receipts: Receipt[] }>("/api/receipts"),
      ]);

      // Transform settlements
      const settlementActivities = settlementsRes.settlements
        .map((s) => transformSettlement(s, currentUserId))
        .filter((item): item is ActivityItem => item !== null);

      // Transform receipts
      const receiptActivities = receiptsRes.receipts
        .map(transformReceipt)
        .filter((item): item is ActivityItem => item !== null);

      // Merge and sort by timestamp (newest first)
      const allActivities = [
        ...settlementActivities,
        ...receiptActivities,
      ].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA; // Descending order
      });

      // Format timestamps but keep raw timestamp for grouping
      return allActivities.map((item) => ({
        ...item,
        rawTimestamp: item.timestamp, // Keep original ISO string
        timestamp: formatTimestamp(item.timestamp), // Format for display
      }));
    } catch (error) {
      console.error("Error fetching activity:", error);
      throw error;
    }
  };

  return {
    fetchActivity,
  };
}

