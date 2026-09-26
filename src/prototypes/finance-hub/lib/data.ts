/** Mock data for the finance-hub prototype. Amounts in USD. */
import type { CreditCard, MonthSpend, Transaction } from "./types";

export const TRANSACTIONS: Transaction[] = [
  { id: "TX-90412", merchant: "Aurora Coffee", category: "Dining", amount: -4.8, date: "2026-09-26", status: "completed" },
  { id: "TX-90398", merchant: "Metro Transit", category: "Transport", amount: -2.75, date: "2026-09-26", status: "completed" },
  { id: "TX-90377", merchant: "Nimbus Market", category: "Groceries", amount: -64.32, date: "2026-09-25", status: "completed" },
  { id: "TX-90361", merchant: "Acme Corp Payroll", category: "Salary", amount: 3120.0, date: "2026-09-25", status: "completed" },
  { id: "TX-90344", merchant: "Streambox", category: "Subscriptions", amount: -15.99, date: "2026-09-24", status: "pending" },
  { id: "TX-90320", merchant: "Volt Energy", category: "Utilities", amount: -87.4, date: "2026-09-23", status: "completed" },
  { id: "TX-90302", merchant: "Refund — Kite Store", category: "Shopping", amount: 129.0, date: "2026-09-22", status: "completed" },
  { id: "TX-90287", merchant: "Ember Grill", category: "Dining", amount: -52.6, date: "2026-09-21", status: "completed" },
  { id: "TX-90261", merchant: "Apex Fitness", category: "Health", amount: -39.0, date: "2026-09-19", status: "completed" },
  { id: "TX-90240", merchant: "Orbit Books", category: "Shopping", amount: -23.45, date: "2026-09-18", status: "completed" },
  { id: "TX-90218", merchant: "Transfer from Savings", category: "Transfer", amount: 500.0, date: "2026-09-16", status: "completed" },
  { id: "TX-90195", merchant: "Cirrus Cloud Hosting", category: "Subscriptions", amount: -29.0, date: "2026-09-14", status: "scheduled" },
];

export const CARDS: CreditCard[] = [
  {
    id: "card-1",
    label: "IBM Credit — Platinum",
    holder: "A. MERCER",
    number: "4021 8811 2233 4021",
    expiry: "09/29",
    balance: 1284.5,
  },
  {
    id: "card-2",
    label: "IBM Credit — Business",
    holder: "A. MERCER",
    number: "5310 4425 9087 1176",
    expiry: "04/28",
    balance: 312.18,
  },
];

export const MONTHLY_SPENDING: MonthSpend[] = [
  { month: "O", value: 1720 },
  { month: "N", value: 1980 },
  { month: "D", value: 2410 },
  { month: "J", value: 1540 },
  { month: "F", value: 1660 },
  { month: "M", value: 1810 },
  { month: "A", value: 1490 },
  { month: "M", value: 1735 },
  { month: "J", value: 2100 },
  { month: "J", value: 1620 },
  { month: "A", value: 1890 },
  { month: "S", value: 2260 },
];

export function maxMonthlySpend(data: MonthSpend[]): number {
  return data.reduce((max, m) => Math.max(max, m.value), 0);
}

export function peakMonthIndex(data: MonthSpend[]): number {
  return data.reduce(
    (peak, m, i) => (m.value > data[peak].value ? i : peak),
    0
  );
}

/** Derive two uppercase initials from a merchant name. */
export function initialsOf(merchant: string): string {
  const words = merchant.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return merchant.slice(0, 2).toUpperCase();
}

export const TOTAL_BALANCE = 24562.8;
