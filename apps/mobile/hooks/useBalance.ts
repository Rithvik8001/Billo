import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useBalanceService } from "@/lib/balance-service";
import { useCurrency } from "@/hooks/useCurrency";
import type { BalanceSummary } from "@/types/activity";

export interface FormattedBalanceData {
  youOwe: string;
  owedToYou: string;
  netBalance: string;
  youOweCount: number;
  owedToYouCount: number;
}

export function useBalance() {
  const { userId } = useAuth();
  const balanceService = useBalanceService();
  const { formatAmount } = useCurrency();
  const [balances, setBalances] = useState<BalanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use ref to store the service functions to avoid recreating callbacks
  const serviceRef = useRef(balanceService);
  serviceRef.current = balanceService;

  const fetchBalances = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const balanceSummary = await serviceRef.current.fetchBalanceSummary(userId);
      setBalances(balanceSummary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch balances";
      setError(errorMessage);
      console.error("Error fetching balances:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalances();
  }, [fetchBalances]);

  // Format balance data with currency
  const getFormattedBalances = useCallback((): FormattedBalanceData | null => {
    if (!balances) return null;

    return {
      youOwe: formatAmount(balances.totalYouOwe.toString()),
      owedToYou: formatAmount(balances.totalOwedToYou.toString()),
      netBalance: formatAmount(balances.netBalance.toString()),
      youOweCount: balances.youOweCount,
      owedToYouCount: balances.owedToYouCount,
    };
  }, [balances, formatAmount]);

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Only run when userId changes

  return {
    balances,
    formattedBalances: getFormattedBalances(),
    isLoading,
    error,
    refreshing,
    fetchBalances,
    refresh,
  };
}

