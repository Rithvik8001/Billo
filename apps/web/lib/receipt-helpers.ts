export function calculateSubtotal(
  items: Array<{ totalPrice: string }>
): string {
  const sum = items.reduce(
    (acc, item) => acc + parseFloat(item.totalPrice || "0"),
    0
  );
  return sum.toFixed(2);
}

import { formatAmount } from "./currency";

export function formatCurrency(amount: string | null, currencyCode: string = "USD"): string {
  return formatAmount(amount, currencyCode);
}

export function getPriceEmoji(amount: string | null): string {
  if (!amount) return "🧾";
  const num = parseFloat(amount);

  if (num < 10) return "🎉";
  if (num < 25) return "😊";
  if (num < 50) return "💰";
  if (num < 100) return "😅";
  return "💸";
}

export function getItemCountEmoji(count: number): string {
  if (count === 0) return "📭";
  if (count <= 3) return "🛒";
  if (count <= 7) return "🛍️";
  return "🎒";
}
