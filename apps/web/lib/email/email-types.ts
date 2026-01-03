export interface GroupInviteEmailData {
  newMemberId: string;
  newMemberName: string;
  newMemberEmail: string;
  groupName: string;
  groupEmoji: string;
  addedByName: string;
}

export interface SettlementEmailData {
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserName: string;
  toUserEmail: string;
  amount: string;
  formattedAmount: string;
  currency: string;
  merchantName: string;
  groupName?: string;
}

export interface PaymentEmailData {
  settlementId: number;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserName: string;
  toUserEmail: string;
  formattedAmount: string;
  merchantName: string;
  settledAt: string;
}

export interface WeeklySummaryData {
  userId: string;
  userName: string;
  userEmail: string;
  totalYouOwe: string;
  totalOwedToYou: string;
  netBalance: string;
  pendingSettlements: Array<{
    id: number;
    otherPersonName: string;
    amount: string;
    merchantName: string;
    type: "owe" | "owed";
  }>;
}

export type EmailPreferenceType =
  | "group_invites"
  | "settlements"
  | "payments"
  | "weekly_summary";
