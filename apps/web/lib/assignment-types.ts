export interface GroupMember {
  userId: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: "admin" | "member";
  joinedAt: Date;
}

export interface PersonTotal {
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  subtotal: number;
  taxShare: number;
  total: number;
}

export interface AssignmentPayload {
  receiptItemId: string;
  userId: string;
  splitType: "full" | "percentage" | "amount";
  splitValue: string | null;
  calculatedAmount: string;
}

export interface AssignmentResponse {
  success: boolean;
  count: number;
  error?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}
