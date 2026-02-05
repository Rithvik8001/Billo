import type { CurrencyCode, EmailPreferences, UserPreferences } from "./types";

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "EUR", name: "Euro" },
  { code: "GBP", symbol: "GBP", name: "British Pound" },
  { code: "INR", symbol: "INR", name: "Indian Rupee" },
  { code: "CAD", symbol: "CAD", name: "Canadian Dollar" },
  { code: "AUD", symbol: "AUD", name: "Australian Dollar" },
  { code: "JPY", symbol: "JPY", name: "Japanese Yen" },
  { code: "CNY", symbol: "CNY", name: "Chinese Yuan" },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  currencyCode: "USD",
};

export const DEFAULT_EMAIL_PREFERENCES: EmailPreferences = {
  emailGroupInvites: true,
  emailSettlements: true,
  emailPayments: true,
  emailWeeklySummary: true,
};
