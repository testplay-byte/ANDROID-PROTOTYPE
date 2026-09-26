/** Shared types for the finance-hub prototype (IBM Carbon style). */

export type TxDirection = "in" | "out";

export type TxStatus = "completed" | "pending" | "scheduled";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  /** Positive = money in, negative = money out. USD. */
  amount: number;
  /** ISO date, e.g. "2026-09-26". */
  date: string;
  status: TxStatus;
}

export interface CreditCard {
  id: string;
  label: string;
  holder: string;
  /** Full card number (revealed by the "show number" toggle). */
  number: string;
  expiry: string;
  /** Current card balance owed, USD. */
  balance: number;
}

export interface MonthSpend {
  month: string;
  value: number;
}

export type ActivityFilter = "all" | "in" | "out";
