"use client";

/* linie / state / line-context — LinieProvider:
   picked station, selected line, saved routes, owned passes, prefs
   and the live departure ticker. All persisted under `linie-*`. */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEPARTURES, DEFAULT_ROUTES, type LineId, type SavedRoute } from "../lib/data";

const ROUTES_KEY = "linie-routes-v1";
const PASSES_KEY = "linie-passes-v1";
const PREFS_KEY = "linie-prefs-v1";

export interface LiniePrefs {
  alerts: boolean;
  announceStops: boolean;
}

const DEFAULT_PREFS: LiniePrefs = { alerts: true, announceStops: false };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

interface LinieContextValue {
  station: string | null;
  pickStation: (id: string | null) => void;
  line: LineId | null;
  selectLine: (id: LineId | null) => void;
  routes: SavedRoute[];
  saveRoute: (r: Omit<SavedRoute, "id">) => void;
  removeRoute: (id: string) => void;
  passes: string[];
  buyPass: (id: string) => void;
  prefs: LiniePrefs;
  setPrefs: (p: Partial<LiniePrefs>) => void;
  /** live minutes-to-departure per departure index */
  tick: number;
  due: (i: number) => number;
  toast: string | null;
  showToast: (m: string) => void;
}

const LinieContext = createContext<LinieContextValue | null>(null);

export function LinieProvider({ children }: { children: ReactNode }) {
  const [station, setStation] = useState<string | null>(null);
  const [line, setLine] = useState<LineId | null>(null);
  const [routes, setRoutes] = useState<SavedRoute[]>(DEFAULT_ROUTES);
  const [passes, setPasses] = useState<string[]>([]);
  const [prefs, setPrefsState] = useState<LiniePrefs>(DEFAULT_PREFS);
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRoutes(load(ROUTES_KEY, DEFAULT_ROUTES));
    setPasses(load(PASSES_KEY, [] as string[]));
    setPrefsState(load(PREFS_KEY, DEFAULT_PREFS));
  }, []);

  /* one live tick per minute drives every countdown */
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const value: LinieContextValue = {
    station,
    pickStation: (id) => {
      setStation(id);
      save("linie-station-v1", id ?? "");
    },
    line,
    selectLine: (id) => setLine(id),
    routes,
    saveRoute: (r) => {
      const next = [...routes, { ...r, id: `r${Date.now()}` }];
      setRoutes(next);
      save(ROUTES_KEY, next);
    },
    removeRoute: (id) => {
      const next = routes.filter((r) => r.id !== id);
      setRoutes(next);
      save(ROUTES_KEY, next);
    },
    passes,
    buyPass: (id) => {
      if (passes.includes(id)) return;
      const next = [...passes, id];
      setPasses(next);
      save(PASSES_KEY, next);
    },
    prefs,
    setPrefs: (p) => {
      const next = { ...prefs, ...p };
      setPrefsState(next);
      save(PREFS_KEY, next);
    },
    tick,
    due: (i) => Math.max(0, DEPARTURES[i].mins - tick),
    toast,
    showToast: (m) => {
      setToast(m);
      window.setTimeout(() => setToast((cur) => (cur === m ? null : cur)), 2300);
    },
  };

  return <LinieContext.Provider value={value}>{children}</LinieContext.Provider>;
}

export function useLinie(): LinieContextValue {
  const c = useContext(LinieContext);
  if (!c) throw new Error("useLinie must be used within LinieProvider");
  return c;
}
