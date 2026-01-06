import { useState, useEffect, useCallback, useRef } from "react";
import { useAccountService } from "@/lib/account-service";
import type { AiUsage } from "@/types/account";

export function useAiUsage() {
  const accountService = useAccountService();
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const serviceRef = useRef(accountService);
  serviceRef.current = accountService;

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await serviceRef.current.fetchAiUsage();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching AI usage:", error);
      // Set default values on error
      setUsage({
        remaining: 3,
        limit: 3,
        used: 0,
        resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isLimited: false,
        isPro: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, isLoading, refetch: fetchUsage };
}

