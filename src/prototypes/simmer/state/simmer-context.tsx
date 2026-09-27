"use client";

/* simmer-context — central client state for Simmer:
   - favorites (persisted `simmer-favorites-v1`)
   - the week's meal plan (persisted `simmer-plan-v1`)
   - checked shopping-list lines (persisted, keyed by aisle::name)
   - done method steps per recipe (persisted)
   - pantry toggles (persisted `simmer-pantry-v1`)
   - cook timer: seconds left / running / which recipe (session-only —
     a timer that resumes mid-countdown from localStorage is a lie)
   - pushed recipe detail (openRecipe/closeRecipe) + picker sheet target
   - toast channel */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { DEFAULT_PLAN, PANTRY_ITEMS, type WeekPlan } from "../lib/data";

const FAV_KEY = "simmer-favorites-v1";
const PLAN_KEY = "simmer-plan-v1";
const LIST_KEY = "simmer-list-v1";
const STEPS_KEY = "simmer-steps-v1";
const PANTRY_KEY = "simmer-pantry-v1";

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

export type ToastIcon = "check" | "pot" | "heart" | "info";

interface Toast {
  msg: string;
  icon: ToastIcon;
}

export interface TimerState {
  recipeId: string | null;
  total: number; // seconds the dial started at
  left: number; // seconds remaining
  running: boolean;
}

interface SimmerContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  plan: WeekPlan;
  setPlanSlot: (day: keyof WeekPlan, slot: "midday" | "evening", recipeId: string | null) => void;

  checkedLines: string[];
  toggleLine: (key: string) => void;
  clearCheckedLines: () => void;

  doneSteps: Record<string, number[]>; // recipeId -> step indexes
  toggleStep: (recipeId: string, idx: number) => void;

  pantry: string[];
  togglePantry: (item: string) => void;

  timer: TimerState;
  startTimer: (recipeId: string, seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;

  openRecipeId: string | null;
  openRecipe: (id: string | null) => void;

  pickerSlot: { day: keyof WeekPlan; slot: "midday" | "evening" } | null;
  openPicker: (slot: { day: keyof WeekPlan; slot: "midday" | "evening" } | null) => void;

  toast: Toast | null;
  showToast: (msg: string, icon?: ToastIcon) => void;
}

const SimmerContext = createContext<SimmerContextValue | null>(null);

export function SimmerProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [plan, setPlan] = useState<WeekPlan>(DEFAULT_PLAN);
  const [checkedLines, setCheckedLines] = useState<string[]>([]);
  const [doneSteps, setDoneSteps] = useState<Record<string, number[]>>({});
  const [pantry, setPantry] = useState<string[]>(PANTRY_ITEMS.slice(0, 6));
  const [timer, setTimer] = useState<TimerState>({
    recipeId: null,
    total: 0,
    left: 0,
    running: false,
  });
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<SimmerContextValue["pickerSlot"]>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const f = loadJson<string[]>(FAV_KEY);
    if (f && Array.isArray(f)) setFavorites(f);
    const p = loadJson<WeekPlan>(PLAN_KEY);
    if (p && typeof p === "object") {
      // merge over defaults so a schema gap can never crash a render
      const merged = { ...DEFAULT_PLAN } as WeekPlan;
      for (const day of Object.keys(DEFAULT_PLAN) as (keyof WeekPlan)[]) {
        if (p[day]) merged[day] = { ...DEFAULT_PLAN[day], ...p[day] };
      }
      setPlan(merged);
    }
    const l = loadJson<string[]>(LIST_KEY);
    if (l && Array.isArray(l)) setCheckedLines(l);
    const s = loadJson<Record<string, number[]>>(STEPS_KEY);
    if (s && typeof s === "object") setDoneSteps(s);
    const pan = loadJson<string[]>(PANTRY_KEY);
    if (pan && Array.isArray(pan)) setPantry(pan);
  }, []);

  const showToast = useCallback((msg: string, icon: ToastIcon = "info") => {
    setToast({ msg, icon });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  /* the one clock — a single 1s interval while running */
  useEffect(() => {
    if (!timer.running) return;
    const iv = window.setInterval(() => {
      setTimer((t) => {
        if (!t.running) return t;
        if (t.left <= 1) {
          return { ...t, left: 0, running: false };
        }
        return { ...t, left: t.left - 1 };
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, [timer.running]);

  /* timer finished -> celebrate once */
  const wasRunning = useRef(false);
  useEffect(() => {
    if (timer.running) wasRunning.current = true;
    else if (wasRunning.current && timer.left === 0 && timer.recipeId) {
      wasRunning.current = false;
      showToast("Timer — that's ready!", "pot");
    }
  }, [timer.running, timer.left, timer.recipeId, showToast]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const on = !prev.includes(id);
        const next = on ? [...prev, id] : prev.filter((f) => f !== id);
        saveJson(FAV_KEY, next);
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const setPlanSlot = useCallback<SimmerContextValue["setPlanSlot"]>((day, slot, recipeId) => {
    setPlan((prev) => {
      const next = { ...prev, [day]: { ...prev[day], [slot]: recipeId } };
      saveJson(PLAN_KEY, next);
      // changing a meal invalidates checks for lines that vanish — keep it
      // simple: checks persist harmlessly by key, no wipe needed
      return next;
    });
  }, []);

  const toggleLine = useCallback((key: string) => {
    setCheckedLines((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      saveJson(LIST_KEY, next);
      return next;
    });
  }, []);

  const clearCheckedLines = useCallback(() => {
    setCheckedLines([]);
    saveJson(LIST_KEY, []);
  }, []);

  const toggleStep = useCallback((recipeId: string, idx: number) => {
    setDoneSteps((prev) => {
      const cur = prev[recipeId] ?? [];
      const next = {
        ...prev,
        [recipeId]: cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx],
      };
      saveJson(STEPS_KEY, next);
      return next;
    });
  }, []);

  const togglePantry = useCallback((item: string) => {
    setPantry((prev) => {
      const next = prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
      saveJson(PANTRY_KEY, next);
      return next;
    });
  }, []);

  const startTimer = useCallback((recipeId: string, seconds: number) => {
    wasRunning.current = false;
    setTimer({ recipeId, total: seconds, left: seconds, running: true });
  }, []);
  const pauseTimer = useCallback(() => setTimer((t) => ({ ...t, running: false })), []);
  const resumeTimer = useCallback(
    () => setTimer((t) => (t.left > 0 ? { ...t, running: true } : t)),
    [],
  );
  const resetTimer = useCallback(
    () => setTimer((t) => ({ ...t, left: t.total, running: false })),
    [],
  );
  const stopTimer = useCallback(() => {
    wasRunning.current = false;
    setTimer({ recipeId: null, total: 0, left: 0, running: false });
  }, []);

  const value = useMemo<SimmerContextValue>(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      plan,
      setPlanSlot,
      checkedLines,
      toggleLine,
      clearCheckedLines,
      doneSteps,
      toggleStep,
      pantry,
      togglePantry,
      timer,
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      stopTimer,
      openRecipeId,
      openRecipe: setOpenRecipeId,
      pickerSlot,
      openPicker: setPickerSlot,
      toast,
      showToast,
    }),
    [
      favorites,
      toggleFavorite,
      isFavorite,
      plan,
      setPlanSlot,
      checkedLines,
      toggleLine,
      clearCheckedLines,
      doneSteps,
      toggleStep,
      pantry,
      togglePantry,
      timer,
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      stopTimer,
      openRecipeId,
      pickerSlot,
      toast,
      showToast,
    ],
  );

  return <SimmerContext.Provider value={value}>{children}</SimmerContext.Provider>;
}

export function useSimmer(): SimmerContextValue {
  const ctx = useContext(SimmerContext);
  if (!ctx) throw new Error("useSimmer must be used within <SimmerProvider>");
  return ctx;
}
