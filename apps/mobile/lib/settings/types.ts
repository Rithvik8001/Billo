export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CNY";

export interface UserPreferences {
  currencyCode: CurrencyCode;
}

export interface EmailPreferences {
  emailGroupInvites: boolean;
  emailSettlements: boolean;
  emailPayments: boolean;
  emailWeeklySummary: boolean;
}

export type EmailPreferenceKey = keyof EmailPreferences;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
