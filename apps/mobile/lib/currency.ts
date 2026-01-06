export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export function getCurrencyByCode(code: string): Currency {
  return (
    SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0] // Default to USD
  );
}

export function formatAmount(
  amount: string | number | null,
  currencyCode: string = "USD"
): string {
  if (amount === null || amount === undefined) {
    const currency = getCurrencyByCode(currencyCode);
    return `${currency.symbol}0.00`;
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    const currency = getCurrencyByCode(currencyCode);
    return `${currency.symbol}0.00`;
  }

  const currency = getCurrencyByCode(currencyCode);
  return `${currency.symbol}${num.toFixed(2)}`;
}

