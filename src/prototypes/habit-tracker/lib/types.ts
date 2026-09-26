/**
 * habit-tracker / lib/types — shared domain types.
 */

/** The 6 inline SVG icons a habit can pick from. */
export type IconId = "run" | "read" | "water" | "meditate" | "sleep" | "code";

/** "mon" = Monday first, "sun" = Sunday first (Settings). */
export type WeekStart = "mon" | "sun";

export interface Habit {
  id: number;
  name: string;
  icon: IconId;
  /** Target days per week (1–7). */
  targetDays: number;
  /** Consecutive days completed, ending today (today counts once checked). */
  streak: number;
  bestStreak: number;
  /** ISO date (yyyy-mm-dd) → completed. Covers the last 7 days. */
  history: Record<string, boolean>;
}

/** Draft used by the inline add/edit form on the Habits screen. */
export interface HabitDraft {
  name: string;
  icon: IconId;
  targetDays: number;
}
