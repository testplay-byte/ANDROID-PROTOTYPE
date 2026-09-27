"use client";

/* still-context — central client state for the Still prototype:
   - completed: session ids finished (persisted `still-completed-v1`)
   - stats: day streak + total quiet-minutes, credited when a breathing
     run or a library session finishes (persisted `still-stats-v1`)
   - pattern: the now-breathing pattern selection (persisted)
   - prefs: soundscape toggles + daily-reminder time (persisted `still-prefs-v1`)
   - toast: one message channel for all screens
   Hydrates after mount (SSR-safe); every mutation writes through to
   localStorage so nothing is screen-local truth. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { BreathPattern } from "../lib/data";
import { PATTERNS } from "../lib/data";

export type ToastIcon = "check" | "breath" | "bell" | "info";

export interface StillPrefs {
  /** Soundscape toggles — visual only, stateful (rain / singing bowl / noise). */
  soundRain: boolean;
  soundBowl: boolean;
  soundNoise: boolean;
  notifyDaily: boolean;
  reminderHour: number; // 0-23
  reminderMin: number; // 0 or 30
}

const DEFAULT_PREFS: StillPrefs = {
  soundRain: true,
  soundBowl: false,
  soundNoise: false,
  notifyDaily: true,
  reminderHour: 7,
  reminderMin: 30,
};

const COMPLETED_KEY = "still-completed-v1";
const STATS_KEY = "still-stats-v1";
const PREFS_KEY = "still-prefs-v1";
const PATTERN_KEY = "still-pattern-v1";

function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — session-only state is fine */
  }
}

interface StillToast {
  msg: string;
  icon: ToastIcon;
}

interface StillContextValue {
  completed: string[];
  isCompleted: (id: string) => boolean;
  /** Toggle a library session's completion (checkmark + counts). */
  toggleComplete: (id: string) => void;
  /** Credit finished quiet-time (breathing runs, played sessions). */
  addQuietMinutes: (min: number) => void;

  streak: number;
  totalMinutes: number;
  completeCount: number;

  pattern: BreathPattern;
  setPattern: (id: BreathPattern["id"]) => void;

  prefs: StillPrefs;
  setPrefs: (p: Partial<StillPrefs>) => void;

  toast: StillToast | null;
  showToast: (msg: string, icon?: ToastIcon) => void;
}

const StillContext = createContext<StillContextValue | null>(null);

export function StillProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [stats, setStats] = useState({ streak: 12, minutes: 340 });
  const [pattern, setPatternState] = useState<BreathPattern>(PATTERNS[0]);
  const [prefs, setPrefsState] = useState<StillPrefs>(DEFAULT_PREFS);
  const [toast, setToast] = useState<StillToast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const c = loadJson<string[]>(COMPLETED_KEY);
    if (c && Array.isArray(c)) setCompleted(c);
    const s = loadJson<{ streak?: number; minutes?: number }>(STATS_KEY);
    if (s) {
      setStats((prev) => ({
        streak: typeof s.streak === "number" ? s.streak : prev.streak,
        minutes: typeof s.minutes === "number" ? s.minutes : prev.minutes,
      }));
    }
    const p = loadJson<StillPrefs>(PREFS_KEY);
    if (p) setPrefsState((prev) => ({ ...prev, ...p }));
    const pid = loadJson<BreathPattern["id"]>(PATTERN_KEY);
    const found = PATTERNS.find((pp) => pp.id === pid);
    if (found) setPatternState(found);
  }, []);

  const showToast = useCallback((msg: string, icon: ToastIcon = "info") => {
    setToast({ msg, icon });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  const isCompleted = useCallback(
    (id: string) => completed.includes(id),
    [completed],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
        saveJson(COMPLETED_KEY, next);
        return next;
      });
    },
    [],
  );

  const addQuietMinutes = useCallback((min: number) => {
    if (min <= 0) return;
    setStats((prev) => {
      const next = { ...prev, minutes: prev.minutes + Math.round(min) };
      saveJson(STATS_KEY, next);
      return next;
    });
  }, []);

  const setPattern = useCallback((id: BreathPattern["id"]) => {
    const found = PATTERNS.find((p) => p.id === id) ?? PATTERNS[0];
    setPatternState(found);
    saveJson(PATTERN_KEY, found.id);
  }, []);

  const setPrefs = useCallback((p: Partial<StillPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<StillContextValue>(
    () => ({
      completed,
      isCompleted,
      toggleComplete,
      addQuietMinutes,
      streak: stats.streak,
      totalMinutes: stats.minutes,
      completeCount: completed.length,
      pattern,
      setPattern,
      prefs,
      setPrefs,
      toast,
      showToast,
    }),
    [
      completed,
      isCompleted,
      toggleComplete,
      addQuietMinutes,
      stats,
      pattern,
      setPattern,
      prefs,
      setPrefs,
      toast,
      showToast,
    ],
  );

  return <StillContext.Provider value={value}>{children}</StillContext.Provider>;
}

export function useStill(): StillContextValue {
  const ctx = useContext(StillContext);
  if (!ctx) throw new Error("useStill must be used within <StillProvider>");
  return ctx;
}
