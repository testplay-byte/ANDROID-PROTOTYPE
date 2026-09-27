"use client";

/* bloom-context — central client state for Bloom:
   - plants: curated collection + plants added in-session (persisted);
     waterings override daysSinceWatered and persist
   - today's schedule checks + the streak/total counters (persisted,
     keyed by calendar day)
   - prefs: notification switches + reminder time (persisted)
   - the plant detail bottom sheet (selectedPlantId)
   - toast (message + icon slot) */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { PLANTS, type Plant, type SpeciesPreset } from "../lib/data";

export type ToastIcon = "check" | "droplet" | "leaf" | "info";

export interface BloomPrefs {
  notifyWater: boolean;
  notifyRepot: boolean;
  reminderHour: number; // 0-23
  reminderMin: number; // 0 or 30
}

const DEFAULT_PREFS: BloomPrefs = {
  notifyWater: true,
  notifyRepot: false,
  reminderHour: 8,
  reminderMin: 30,
};

const PREFS_KEY = "bloom-prefs-v1";
const WATER_KEY = "bloom-waterings-v1"; // plantId -> daysSinceWatered
const CHECKS_KEY = "bloom-checks-v1"; // "YYYY-MM-DD" -> plantId[]
const STATS_KEY = "bloom-stats-v1"; // { streak, total }
const COLLECTION_KEY = "bloom-collection-v1"; // plants added in the prototype

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

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

interface Toast {
  msg: string;
  icon: ToastIcon;
}

interface BloomContextValue {
  plants: Plant[];
  waterPlant: (id: string) => void;
  addPlant: (preset: SpeciesPreset) => void;

  checks: string[]; // plant ids checked off in today's schedule
  hasDue: boolean; // at least one plant is at/past its watering interval
  toggleCheck: (id: string) => void;

  streak: number;
  totalWaterings: number;

  prefs: BloomPrefs;
  setPrefs: (p: Partial<BloomPrefs>) => void;

  selectedPlantId: string | null;
  selectPlant: (id: string | null) => void;

  toast: Toast | null;
  showToast: (msg: string, icon?: ToastIcon) => void;
}

const BloomContext = createContext<BloomContextValue | null>(null);

export function BloomProvider({ children }: { children: ReactNode }) {
  const [extraPlants, setExtraPlants] = useState<Plant[]>([]);
  const [watered, setWatered] = useState<Record<string, number>>({});
  const [checks, setChecks] = useState<string[]>([]);
  const [stats, setStats] = useState({ streak: 3, total: 128 });
  const [prefs, setPrefsState] = useState<BloomPrefs>(DEFAULT_PREFS);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const p = loadJson<BloomPrefs>(PREFS_KEY);
    if (p) setPrefsState((prev) => ({ ...prev, ...p }));
    const w = loadJson<Record<string, number>>(WATER_KEY);
    if (w) setWatered(w);
    const c = loadJson<Record<string, string[]>>(CHECKS_KEY);
    if (c && Array.isArray(c[todayKey()])) setChecks(c[todayKey()]);
    const s = loadJson<{ streak?: number; total?: number }>(STATS_KEY);
    if (s) {
      setStats((prev) => ({
        streak: typeof s.streak === "number" ? s.streak : prev.streak,
        total: typeof s.total === "number" ? s.total : prev.total,
      }));
    }
    const col = loadJson<Plant[]>(COLLECTION_KEY);
    if (col && Array.isArray(col)) setExtraPlants(col);
  }, []);

  const plants = useMemo(() => {
    const curated = PLANTS.map((pl) =>
      watered[pl.id] !== undefined ? { ...pl, daysSinceWatered: watered[pl.id] } : pl,
    );
    return [...curated, ...extraPlants];
  }, [watered, extraPlants]);

  const showToast = useCallback((msg: string, icon: ToastIcon = "info") => {
    setToast({ msg, icon });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  const waterPlant = useCallback(
    (id: string) => {
      setWatered((prev) => {
        const next = { ...prev, [id]: 0 };
        saveJson(WATER_KEY, next);
        return next;
      });
      setStats((prev) => {
        const next = { ...prev, total: prev.total + 1 };
        saveJson(STATS_KEY, next);
        return next;
      });
      const plant = plants.find((p) => p.id === id);
      if (plant) showToast(`${plant.name} watered`, "check");
    },
    [plants, showToast],
  );

  const addPlant = useCallback(
    (preset: SpeciesPreset) => {
      const plant: Plant = {
        id: `u-${Date.now()}`,
        name: preset.common,
        species: preset.species,
        shape: preset.shape,
        pot: preset.pot,
        intervalDays: preset.intervalDays,
        daysSinceWatered: 0,
        light: preset.light,
        temp: preset.temp,
        added: new Date().toISOString().slice(0, 10),
        task: "Water",
        slot: "09:00",
      };
      setExtraPlants((prev) => {
        const next = [...prev, plant];
        saveJson(COLLECTION_KEY, next);
        return next;
      });
      setSelectedPlantId(null);
      showToast(`${preset.common} joined your collection`, "leaf");
    },
    [showToast],
  );

  const toggleCheck = useCallback(
    (id: string) => {
      const on = !checks.includes(id);
      const next = on ? [...checks, id] : checks.filter((c) => c !== id);
      setChecks(next);
      const byDay = loadJson<Record<string, string[]>>(CHECKS_KEY) ?? {};
      byDay[todayKey()] = next;
      saveJson(CHECKS_KEY, byDay);
      setStats((s) => {
        const nextStats = { ...s, streak: Math.max(0, s.streak + (on ? 1 : -1)) };
        saveJson(STATS_KEY, nextStats);
        return nextStats;
      });
    },
    [checks],
  );

  const setPrefs = useCallback((p: Partial<BloomPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  /* "due" = at/past its watering interval (drives the schedule + tab nudge) */
  const hasDue = useMemo(
    () => plants.some((p) => p.daysSinceWatered >= p.intervalDays),
    [plants],
  );

  const value: BloomContextValue = {
    plants,
    waterPlant,
    addPlant,
    checks,
    hasDue,
    toggleCheck,
    streak: stats.streak,
    totalWaterings: stats.total,
    prefs,
    setPrefs,
    selectedPlantId,
    selectPlant: setSelectedPlantId,
    toast,
    showToast,
  };

  return <BloomContext.Provider value={value}>{children}</BloomContext.Provider>;
}

export function useBloom(): BloomContextValue {
  const ctx = useContext(BloomContext);
  if (!ctx) throw new Error("useBloom must be used within <BloomProvider>");
  return ctx;
}
