import { Polar } from "@polar-sh/sdk";

// Polar SDK client instance
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_MODE as "sandbox" | "production") || "sandbox",
});

// Subscription tier types
export type SubscriptionTier = "free" | "pro";

// AI scan limits by tier
export const SCAN_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  pro: 50,
};

// Subscription status types (from Polar)
export type SubscriptionStatus = "active" | "canceled" | null;

// Helper to check if user has Pro tier
export function isPro(tier: SubscriptionTier | null | undefined): boolean {
  return tier === "pro";
}

// Get scan limit for a tier
export function getScanLimit(tier: SubscriptionTier): number {
  return SCAN_LIMITS[tier] || SCAN_LIMITS.free;
}

// Subscription state interface
export interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  hasPortalAccess: boolean;
}
