"use client";

import { useState, useCallback, useEffect } from "react";
import type { SubscriptionTier, SubscriptionStatus } from "@/lib/polar";

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  hasPortalAccess: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/users/subscription");

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();
      setSubscription({
        tier: data.tier,
        status: data.status,
        currentPeriodEnd: data.currentPeriodEnd
          ? new Date(data.currentPeriodEnd)
          : null,
        hasPortalAccess: data.hasPortalAccess,
      });
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Default to free tier on error
      setSubscription({
        tier: "free",
        status: null,
        currentPeriodEnd: null,
        hasPortalAccess: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    isPro: subscription?.tier === "pro",
  };
}
