"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { formatAmount } from "@/lib/currency";
import { toast } from "sonner";

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => Promise<void>;
  formatAmount: (amount: string | number | null) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
  initialCurrency: string;
}

export function CurrencyProvider({
  children,
  initialCurrency,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<string>(
    initialCurrency || "USD"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync with initialCurrency prop changes
  useEffect(() => {
    if (initialCurrency) {
      setCurrencyState(initialCurrency);
    }
  }, [initialCurrency]);

  const setCurrency = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currencyCode: code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update currency preference");
      }

      setCurrencyState(code);
      toast.success("Currency preference updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update currency preference";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatAmountWithCurrency = useCallback(
    (amount: string | number | null) => {
      return formatAmount(amount, currency);
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount: formatAmountWithCurrency,
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
