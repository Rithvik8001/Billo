export type SubscriptionTier = "free" | "pro";
export type SubscriptionStatus = "active" | "canceled" | null;

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  hasPortalAccess: boolean;
}

export interface AiUsage {
  remaining: number;
  limit: number;
  used: number;
  resetsAt: Date;
  isLimited: boolean;
  isPro: boolean;
}

export interface EmailPreferences {
  emailGroupInvites: boolean;
  emailSettlements: boolean;
  emailPayments: boolean;
  emailWeeklySummary: boolean;
}

