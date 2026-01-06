import { useState, useEffect, useCallback, useRef } from "react";
import { useAccountService } from "@/lib/account-service";
import type { EmailPreferences } from "@/types/account";

export function useEmailPreferences() {
  const accountService = useAccountService();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    emailGroupInvites: true,
    emailSettlements: true,
    emailPayments: true,
    emailWeeklySummary: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const serviceRef = useRef(accountService);
  serviceRef.current = accountService;

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await serviceRef.current.fetchEmailPreferences();
      setPreferences(data);
    } catch (error) {
      console.error("Error fetching email preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreference = useCallback(
    async (key: keyof EmailPreferences, value: boolean) => {
      try {
        // Optimistic update
        setPreferences((prev) => ({ ...prev, [key]: value }));
        const updated = await serviceRef.current.updateEmailPreference(key, value);
        setPreferences(updated);
      } catch (error) {
        console.error("Error updating preference:", error);
        // Revert on error
        await fetchPreferences();
        throw error;
      }
    },
    [fetchPreferences]
  );

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    updatePreference,
    refetch: fetchPreferences,
  };
}

