/**
 * habit-tracker / lib/stats — pure computations over habit history.
 */

import type { Habit, WeekStart } from "./types";
import { isoDate, todayKey } from "./data";

export interface DayProgress {
  done: number;
  total: number;
  pct: number;
}

/** How many habits are checked off today. */
export function todayProgress(habits: Habit[]): DayProgress {
  const key = todayKey();
  const done = habits.filter((h) => h.history[key]).length;
  const total = habits.length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/**
 * The current calendar week's 7 ISO keys, ordered per weekStart
 * (Mon-first or Sun-first). Days after today are "future".
 */
export function currentWeekKeys(weekStart: WeekStart): string[] {
  const now = new Date();
  const dow = now.getDay(); // 0 = Sunday
  const offset = weekStart === "mon" ? (dow + 6) % 7 : dow;
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset + i);
    keys.push(isoDate(d));
  }
  return keys;
}

export function weekDayLabels(weekStart: WeekStart): string[] {
  return weekStart === "mon"
    ? ["M", "T", "W", "T", "F", "S", "S"]
    : ["S", "M", "T", "W", "T", "F", "S"];
}

export interface WeekStats {
  /** Checks recorded so far this week. */
  done: number;
  /** Habits × elapsed days — the maximum possible so far. */
  possible: number;
  /** done / possible, as 0–100. */
  pct: number;
  /** Highest best-streak across habits. */
  bestStreak: number;
  /** ISO keys for the week (Mon/Sun first). */
  keys: string[];
  /** Index of today within `keys`. */
  todayIdx: number;
}

export function weekStats(habits: Habit[], weekStart: WeekStart): WeekStats {
  const keys = currentWeekKeys(weekStart);
  const today = todayKey();
  const todayIdx = Math.max(0, keys.indexOf(today));
  const elapsed = todayIdx + 1;

  let done = 0;
  for (const h of habits) {
    for (const k of keys.slice(0, elapsed)) {
      if (h.history[k]) done++;
    }
  }
  const possible = habits.length * elapsed;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.bestStreak), 0);

  return { done, possible, pct: possible === 0 ? 0 : Math.round((done / possible) * 100), bestStreak, keys, todayIdx };
}
