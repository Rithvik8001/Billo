import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAccountService } from "@/lib/account-service";
import { formatAmount as formatAmountUtil, getCurrencyByCode } from "@/lib/currency";

interface CurrencyContextValue {
  currency: string;
  setCurrency: (code: string) => Promise<void>;
  formatAmount: (amount: string | number | null) => string;
  getCurrency: () => ReturnType<typeof getCurrencyByCode>;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const accountService = useAccountService();
  const [currency, setCurrencyState] = useState<string>("USD");
  const [isInitialized, setIsInitialized] = useState(false);

  const serviceRef = useRef(accountService);
  serviceRef.current = accountService;

  // Fetch initial currency preference
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const code = await serviceRef.current.fetchCurrencyPreference();
        setCurrencyState(code);
      } catch (error) {
        console.error("Error fetching currency preference:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    fetchCurrency();
  }, []);

  const setCurrency = useCallback(async (code: string) => {
    try {
      const updated = await serviceRef.current.updateCurrencyPreference(code);
      setCurrencyState(updated);
    } catch (error) {
      console.error("Error updating currency:", error);
      throw error;
    }
  }, []);

  const formatAmount = useCallback(
    (amount: string | number | null) => {
      return formatAmountUtil(amount, currency);
    },
    [currency]
  );

  const getCurrency = useCallback(() => {
    return getCurrencyByCode(currency);
  }, [currency]);

  if (!isInitialized) {
    // Return default values while loading
    return (
      <CurrencyContext.Provider
        value={{
          currency: "USD",
          setCurrency: async () => {},
          formatAmount: (amount) => formatAmountUtil(amount, "USD"),
          getCurrency: () => getCurrencyByCode("USD"),
        }}
      >
        {children}
      </CurrencyContext.Provider>
    );
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount,
        getCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

