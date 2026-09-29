/**
 * mochi / data — deterministic demo data for the claymorphism planner.
 *
 * Every number here is a literal. There is no `Math.random`, no
 * `Date.now()` and no "days since epoch" arithmetic anywhere in Mochi, so
 * the dashboard, the rings, the streaks and the 30-day sparkline look
 * identical on every load and on every machine — the same rule every other
 * prototype in this repo follows.
 *
 * "Today" is PINNED to Tuesday 29 September 2026 (`TODAY_DOW = 2`, counted
 * from Sunday) rather than read from the clock, so a reviewer opening Mochi
 * in a week still sees the same agenda and the same streaks. Change the four
 * constants below if you want a different frozen day.
 */

/* ------------------------------------------------------------------ *
 * Frozen "today"
 * ------------------------------------------------------------------ */

export const TODAY = {
  weekday: "Tuesday",
  day: 29,
  month: "September",
  monthShort: "Sep",
  year: 2026,
  iso: "2026-09-29",
  /** 0 = Sunday … 6 = Saturday. 2026-09-29 is a Tuesday. */
  dow: 2,
} as const;

export type Tone = "primary" | "secondary" | "tertiary" | "warn" | "error";

/** 1 = done, 0 = missed. Written as digits in the seeds so a 28-day strip
 *  reads as one line of 0s and 1s in this file. */
export type HabitDay = 0 | 1;

/* ------------------------------------------------------------------ *
 * Week maths — the week-start preference really re-derives the layout
 * ------------------------------------------------------------------ */

export type WeekStart = "mon" | "sun";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const DAY_INITIAL = 0; // oldest → newest

export interface WeekSlot {
  /** absolute Sunday-indexed weekday of this slot */
  abs: number;
  /** 0..6 position inside the configured week (index 0 = week start) */
  group: number;
  letter: string;
  full: string;
  /** days back from today, 6 → 0 */
  back: number;
  isToday: boolean;
}

/** The last 7 days, oldest first, grouped by the configured week start. */
export function weekSlots(weekStart: WeekStart, todayDow: number = TODAY.dow): WeekSlot[] {
  const base = weekStart === "mon" ? 1 : 0;
  const out: WeekSlot[] = [];
  for (let i = 0; i < 7; i++) {
    const back = 6 - i;
    const abs = (((todayDow - back) % 7) + 7) % 7;
    out.push({
      abs,
      group: (((abs - base) % 7) + 7) % 7,
      letter: DAY_LETTERS[abs],
      full: DAY_FULL[abs],
      back,
      isToday: back === 0,
    });
  }
  return out;
}

/** Completing days in each of the 7 weekday groups, oldest group first. */
export function weekCounts(history: HabitDay[], weekStart: WeekStart, todayDow: number = TODAY.dow): number[] {
  const base = weekStart === "mon" ? 1 : 0;
  const counts = new Array(7).fill(0);
  history.forEach((done, idx) => {
    if (!done) return;
    const back = (history.length - 1) - idx;
    const abs = (((todayDow - back) % 7) + 7) % 7;
    counts[((abs - base) % 7 + 7) % 7] += 1;
  });
  return counts;
}

/** Four 7-day blocks, oldest first — the "weekly completion" trend. */
export function weekBlocks(history: HabitDay[]): { done: number; of: number }[] {
  const blocks: { done: number; of: number }[] = [];
  for (let b = 3; b >= 0; b--) {
    const slice = history.slice(b * 7, b * 7 + 7);
    blocks.push({ done: slice.filter(Boolean).length, of: slice.length });
  }
  return blocks;
}

/** Consecutive completed days ending today (or yesterday, if today is open). */
export function streakOf(history: HabitDay[]): number {
  let i = history.length - 1;
  if (i >= 0 && !history[i]) i -= 1; // today not ticked yet — don't break the run
  let n = 0;
  while (i >= 0 && history[i]) {
    n += 1;
    i -= 1;
  }
  return n;
}

/* ------------------------------------------------------------------ *
 * Budget
 * ------------------------------------------------------------------ */

export interface Category {
  id: string;
  name: string;
  /** monthly limit, editable in the app */
  limit: number;
  /** spent so far this month */
  spent: number;
  tone: Tone;
  note: string;
  /** Monday-first spend split for the current month (7 values) */
  byDay: number[];
}

export const CATEGORIES: Category[] = [
  {
    id: "c-rent",
    name: "Rent & bills",
    limit: 1450,
    spent: 1450,
    tone: "secondary",
    note: "Rent 1,240 + utilities 210. Fixed — pays itself on the 1st.",
    byDay: [207.15, 207.14, 207.15, 207.14, 207.14, 207.14, 207.14],
  },
  {
    id: "c-groceries",
    name: "Groceries",
    limit: 520,
    spent: 318.4,
    tone: "primary",
    note: "One big shop on Friday, small top-ups mid-week.",
    byDay: [62.4, 0, 48.8, 55.3, 0, 89.6, 62.3],
  },
  {
    id: "c-dining",
    name: "Eating out",
    limit: 260,
    spent: 231.75,
    tone: "warn",
    note: "Two team lunches already booked this month.",
    byDay: [18.2, 42.5, 0, 66.25, 28.8, 51, 25],
  },
  {
    id: "c-fun",
    name: "Fun & subscriptions",
    limit: 140,
    spent: 138.9,
    tone: "error",
    note: "Two renewals landed on the same day. Trim one before October.",
    byDay: [11.99, 11.99, 14.9, 0, 32.5, 9.99, 57.53],
  },
  {
    id: "c-home",
    name: "Home & kit",
    limit: 300,
    spent: 122.65,
    tone: "primary",
    note: "Desk lamp and a second monitor arm.",
    byDay: [0, 24.1, 0, 38.55, 0, 60, 0],
  },
  {
    id: "c-transport",
    name: "Transport",
    limit: 180,
    spent: 96.4,
    tone: "tertiary",
    note: "Season ticket + the occasional bus home late.",
    byDay: [12.4, 8.2, 14.6, 0, 9.8, 18.2, 33.2],
  },
  {
    id: "c-health",
    name: "Health",
    limit: 200,
    spent: 74,
    tone: "tertiary",
    note: "Gym day pass and the dentist.",
    byDay: [0, 30, 0, 44, 0, 0, 0],
  },
];

export const CATEGORY_TONE_HINT: Record<Tone, string> = {
  primary: "everyday",
  secondary: "committed",
  tertiary: "flexible",
  warn: "watch it",
  error: "over",
};

/** Last 30 days of daily spend, oldest first. Sums to 1,533.45. */
export const SPEND_30: number[] = [
  42.1, 88.45, 31.2, 0, 64.8, 27.35, 96.5, 55.25, 18.9, 73.4, 46.1, 0, 38.75, 112.6, 29.4,
  51.85, 0, 67.3, 84.15, 22.6, 44.95, 103.25, 35.7, 0, 58.4, 91.8, 26.15, 49.3, 78.55,
  33.4, 61.25,
];

export const SPEND_30_LABEL = { from: "31 Aug", to: "29 Sep", total: 1533.45, peak: 112.6, dryDays: 6 };

/* ------------------------------------------------------------------ *
 * Habits
 * ------------------------------------------------------------------ */

export interface Habit {
  id: string;
  name: string;
  cue: string;
  /** completions wanted in a full week */
  target: number;
  tone: Tone;
  /** 28 days, oldest first, index 27 = today (always starts at 0) */
  history: HabitDay[];
}

export const HABITS: Habit[] = [
  {
    id: "h-stretch",
    name: "Morning stretch",
    cue: "Before the first coffee",
    target: 7,
    tone: "tertiary",
    history: [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  },
  {
    id: "h-water",
    name: "Drink 2L water",
    cue: "Refill the bottle at three",
    target: 7,
    tone: "primary",
    history: [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  },
  {
    id: "h-walk",
    name: "30-minute walk",
    cue: "Lunch break, phone in pocket",
    target: 5,
    tone: "tertiary",
    history: [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  },
  {
    id: "h-read",
    name: "Read 20 pages",
    cue: "After dinner, before the screen",
    target: 6,
    tone: "secondary",
    history: [0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  },
  {
    id: "h-journal",
    name: "Evening journal",
    cue: "22:00, phone face down",
    target: 7,
    tone: "primary",
    history: [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  },
  {
    id: "h-tidy",
    name: "10-minute tidy",
    cue: "Before bed, timer on",
    target: 7,
    tone: "warn",
    history: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
  },
];

/* ------------------------------------------------------------------ *
 * Agenda
 * ------------------------------------------------------------------ */

export type AgendaKind = "habit" | "money" | "event";

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  kind: AgendaKind;
  done: boolean;
}

export const AGENDA: AgendaItem[] = [
  { id: "a-stretch", time: "07:30", title: "Morning stretch", detail: "Habit · 10 minutes", kind: "habit", done: true },
  { id: "a-review", time: "08:15", title: "Review September budget", detail: "Money · Fun & subscriptions is nearly spent", kind: "money", done: true },
  { id: "a-standup", time: "10:00", title: "Team stand-up", detail: "Calendar · 15 minutes", kind: "event", done: false },
  { id: "a-lunch", time: "12:30", title: "Lunch with Sam", detail: "Calendar · owes you from last week", kind: "event", done: false },
  { id: "a-groceries", time: "18:00", title: "Big grocery run", detail: "Money · ~90 today", kind: "money", done: false },
  { id: "a-transfer", time: "20:00", title: "Move 300 to savings", detail: "Money · standing transfer", kind: "money", done: false },
  { id: "a-journal", time: "22:00", title: "Evening journal", detail: "Habit · phone face down", kind: "habit", done: false },
];

/* ------------------------------------------------------------------ *
 * Money summary
 * ------------------------------------------------------------------ */

export const BALANCE = {
  /** what is actually in the account today */
  available: 2840.65,
  /** month income */
  income: 4120,
  /** month spend — equals the sum of the seeded category spends */
  spend: 2432.1,
  /** money moved to savings this month */
  saved: 600,
  /** not counted as spend — the standing transfer */
  essentials: 1450,
};

export const BALANCE_AFTER = BALANCE.available - BALANCE.saved;

/* ------------------------------------------------------------------ *
 * Formatters
 * ------------------------------------------------------------------ */

/** £1,234.56 — hand-rolled so the output never depends on ICU data. */
export function money(n: number): string {
  const neg = n < 0;
  const v = Math.abs(Math.round(n * 100));
  const whole = Math.floor(v / 100).toLocaleString("en-GB");
  const pence = String(v % 100).padStart(2, "0");
  return `${neg ? "−" : ""}£${whole}.${pence}`;
}

/** £1.5k — for axis labels where the pence are noise. */
export function moneyK(n: number): string {
  if (Math.abs(n) >= 1000) return `£${(n / 1000).toFixed(1)}k`;
  return `£${Math.round(n)}`;
}

export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.max(0, Math.min(1, part / whole));
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
