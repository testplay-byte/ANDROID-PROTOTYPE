/**
 * Currency display helper.
 * Prices are stored in USD; the Settings screen's segmented control
 * switches the display currency via formatPrice().
 */

export type Currency = "USD" | "EUR" | "GBP";

export const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"];

const RATES: Record<Currency, { rate: number; symbol: string }> = {
  USD: { rate: 1, symbol: "$" },
  EUR: { rate: 0.92, symbol: "\u20AC" },
  GBP: { rate: 0.79, symbol: "\u00A3" },
};

/** Format a USD amount for display in the selected currency. */
export function formatPrice(usd: number, currency: Currency): string {
  const { rate, symbol } = RATES[currency];
  const value = usd * rate;
  return `${symbol}${value.toFixed(2)}`;
}
