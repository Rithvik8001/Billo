import { useState, useEffect, useCallback, useRef } from "react";
import { useAccountService } from "@/lib/account-service";
import type { Subscription } from "@/types/account";

export function useSubscription() {
  const accountService = useAccountService();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef(accountService);
  serviceRef.current = accountService;

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await serviceRef.current.fetchSubscription();
      setSubscription(data);
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

