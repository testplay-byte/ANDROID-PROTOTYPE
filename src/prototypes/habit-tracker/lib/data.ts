/**
 * habit-tracker / lib/data — date helpers + realistic mock habits.
 *
 * History is generated deterministically (string-seed hash, not Math.random)
 * so re-renders / reset give stable-looking data for the current week.
 */

import type { Habit, IconId } from "./types";

/** Local-time ISO date key: yyyy-mm-dd. */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return isoDate(new Date());
}

/** The 7 ISO keys ending today, oldest first. */
export function last7Days(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(isoDate(d));
  }
  return out;
}

/** Deterministic pseudo-random 0..1 from a string seed. */
function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

interface SeedHabit {
  name: string;
  icon: IconId;
  targetDays: number;
  /** Probability a past day was completed. */
  density: number;
}

const SEEDS: SeedHabit[] = [
  { name: "Morning run", icon: "run", targetDays: 5, density: 0.72 },
  { name: "Read 20 pages", icon: "read", targetDays: 7, density: 0.85 },
  { name: "Drink 2L water", icon: "water", targetDays: 7, density: 0.9 },
  { name: "Meditate 10 min", icon: "meditate", targetDays: 4, density: 0.5 },
  { name: "In bed by 23:00", icon: "sleep", targetDays: 6, density: 0.62 },
  { name: "Ship a commit", icon: "code", targetDays: 5, density: 0.7 },
];

export function makeHabits(): Habit[] {
  const days = last7Days();
  const past = days.slice(0, 6); // history exists for the 6 days before today

  return SEEDS.map((seed, i) => {
    const history: Record<string, boolean> = {};
    let streak = 0;
    for (const key of past) {
      const done = seeded(seed.name + key) < seed.density;
      history[key] = done;
      streak = done ? streak + 1 : 0;
    }
    return {
      id: i + 1,
      name: seed.name,
      icon: seed.icon,
      targetDays: seed.targetDays,
      streak,
      bestStreak: Math.max(streak, Math.round(seed.density * 10) + 4),
      history,
    };
  });
}
