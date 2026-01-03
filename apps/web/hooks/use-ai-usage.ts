"use client";

import { useState, useCallback, useEffect } from "react";

export interface AiUsage {
  remaining: number;
  limit: number;
  used: number;
  resetsAt: Date;
  isLimited: boolean;
}

export interface UseAiUsageReturn {
  usage: AiUsage | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useAiUsage(): UseAiUsageReturn {
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/usage");

      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }

      const data = await response.json();
      const aiScans = data.aiScans;

      setUsage({
        remaining: aiScans.remaining,
        limit: aiScans.limit,
        used: aiScans.used,
        resetsAt: new Date(aiScans.resetsAt),
        isLimited: aiScans.isLimited,
      });
    } catch (error) {
      console.error("Error fetching AI usage:", error);
      // Set default values on error
      setUsage({
        remaining: 3,
        limit: 3,
        used: 0,
        resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isLimited: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchUsage();
  }, [fetchUsage]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, isLoading, refetch };
}
