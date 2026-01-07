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

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  lineNumber: number | null;
}

export interface Receipt {
  id: string;
  userId: string;
  imageUrl: string | null;
  imagePublicId: string | null;
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
  items?: ReceiptItem[];
}

export interface SettlementUser {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

export interface SettlementReceipt {
  id: string;
  merchantName: string | null;
  purchaseDate: string | null;
  totalAmount: string | null;
}

export interface SettlementGroup {
  id: string;
  name: string;
  emoji: string | null;
}

export interface Settlement {
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
  fromUser: SettlementUser;
  toUser: SettlementUser;
  receipt: SettlementReceipt | null;
  group: SettlementGroup | null;
}
