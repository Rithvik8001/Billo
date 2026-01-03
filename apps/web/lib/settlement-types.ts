export interface Settlement {
  id: string;
  receiptId: string | null;
  groupId: string | null;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  settledAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettlementWithUsers extends Settlement {
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
    purchaseDate: Date | null;
    totalAmount: string | null;
  } | null;
  group?: {
    id: string;
    name: string;
    emoji: string;
  } | null;
}

export interface GroupBalance {
  userId: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  totalOwed: number; // Total amount this user owes to others
  totalOwedTo: number; // Total amount others owe to this user
  netBalance: number; // Positive = they owe, Negative = they're owed
}

export interface BalanceSummary {
  totalYouOwe: number;
  totalOwedToYou: number;
  netBalance: number;
  pendingYouOweCount: number; // settlements where you owe
  pendingOwedToYouCount: number; // settlements where you're owed
  completedCount: number;
}

export interface SettlementFilters {
  groupId?: string;
  status?: "pending" | "completed" | "cancelled";
  direction?: "owed" | "owing"; // "owed" = you're owed, "owing" = you owe
}

