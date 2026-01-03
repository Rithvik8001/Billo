"use client";

import { CurrencyProvider } from "@/contexts/currency-context";
import { ReactNode } from "react";

interface CurrencyProviderWrapperProps {
  children: ReactNode;
  initialCurrency: string;
}

export function CurrencyProviderWrapper({
  children,
  initialCurrency,
}: CurrencyProviderWrapperProps) {
  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      {children}
    </CurrencyProvider>
  );
}
