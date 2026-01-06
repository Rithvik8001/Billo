export type ActivityType = "settlement" | "receipt" | "payment" | "group";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string; // Formatted timestamp (e.g., "2h ago")
  rawTimestamp: string; // ISO date string for sorting/grouping
  amount?: string; // Formatted amount (e.g., "$25.00")
  amountType?: "owe" | "owed" | "neutral";
  metadata: {
    settlementId?: string;
    receiptId?: string;
    groupId?: string;
    groupName?: string;
    merchantName?: string;
    otherUserName?: string;
  };
}

