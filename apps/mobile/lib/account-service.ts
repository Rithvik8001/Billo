import { useApiClient } from "./api-client";
import type { Subscription, AiUsage, EmailPreferences } from "@/types/account";

export function useAccountService() {
  const { apiRequest } = useApiClient();

  const fetchSubscription = async (): Promise<Subscription> => {
    const data = await apiRequest<{
      tier: "free" | "pro";
      status: "active" | "canceled" | null;
      currentPeriodEnd: string | null;
      hasPortalAccess: boolean;
    }>("/api/users/subscription");

    return {
      tier: data.tier,
      status: data.status,
      currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null,
      hasPortalAccess: data.hasPortalAccess,
    };
  };

  const fetchAiUsage = async (): Promise<AiUsage> => {
    const data = await apiRequest<{
      aiScans: {
        remaining: number;
        limit: number;
        used: number;
        resetsAt: string;
        isLimited: boolean;
        isPro: boolean;
      };
    }>("/api/users/usage");

    return {
      remaining: data.aiScans.remaining,
      limit: data.aiScans.limit,
      used: data.aiScans.used,
      resetsAt: new Date(data.aiScans.resetsAt),
      isLimited: data.aiScans.isLimited,
      isPro: data.aiScans.isPro,
    };
  };

  const fetchCurrencyPreference = async (): Promise<string> => {
    const data = await apiRequest<{ currencyCode: string }>("/api/users/preferences");
    return data.currencyCode || "USD";
  };

  const updateCurrencyPreference = async (currencyCode: string): Promise<string> => {
    const data = await apiRequest<{ currencyCode: string }>("/api/users/preferences", {
      method: "PUT",
      body: JSON.stringify({ currencyCode }),
    });
    return data.currencyCode;
  };

  const fetchEmailPreferences = async (): Promise<EmailPreferences> => {
    return await apiRequest<EmailPreferences>("/api/users/preferences/email");
  };

  const updateEmailPreference = async (
    key: keyof EmailPreferences,
    value: boolean
  ): Promise<EmailPreferences> => {
    return await apiRequest<EmailPreferences>("/api/users/preferences/email", {
      method: "PUT",
      body: JSON.stringify({ [key]: value }),
    });
  };

  return {
    fetchSubscription,
    fetchAiUsage,
    fetchCurrencyPreference,
    updateCurrencyPreference,
    fetchEmailPreferences,
    updateEmailPreference,
  };
}

