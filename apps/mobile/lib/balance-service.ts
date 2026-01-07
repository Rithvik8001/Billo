import { useApiClient } from "./api-client";
import type { BalanceSummary } from "@/types/activity";

// API response type for settlements
interface SettlementResponse {
  id: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  fromUserId: string;
  toUserId: string;
}

interface SettlementsResponse {
  settlements: SettlementResponse[];
}

export function useBalanceService() {
  const { apiRequest } = useApiClient();

  const fetchBalanceSummary = async (
    currentUserId: string
  ): Promise<BalanceSummary> => {
    try {
      // Fetch settlements in both directions in parallel
      const [owingRes, owedRes] = await Promise.all([
        apiRequest<SettlementsResponse>(
          `/api/settlements?status=pending&direction=owing`
        ),
        apiRequest<SettlementsResponse>(
          `/api/settlements?status=pending&direction=owed`
        ),
      ]);

      // Calculate totals
      const totalYouOwe = owingRes.settlements.reduce(
        (sum, s) => sum + parseFloat(s.amount),
        0
      );
      const totalOwedToYou = owedRes.settlements.reduce(
        (sum, s) => sum + parseFloat(s.amount),
        0
      );
      const netBalance = totalYouOwe - totalOwedToYou;

      return {
        totalYouOwe,
        totalOwedToYou,
        netBalance,
        youOweCount: owingRes.settlements.length,
        owedToYouCount: owedRes.settlements.length,
      };
    } catch (error) {
      console.error("Error fetching balance summary:", error);
      throw error;
    }
  };

  return {
    fetchBalanceSummary,
  };
}
