"use client";

/* atlas-context — central client state for Atlas, the bento trip planner:
   - tripIdx: which destination is "next" (hero art, countdown, budget...)
   - saved: the Places collection (destination ids), persisted
   - packed: per-trip checklist state (tripId -> "group:index" ids), persisted
   - prefs: notification toggles + planner trip length, persisted
   - expanded tile id (the signature grid->fullscreen morph lives here so
     Trip and Places can both drive it)
   - toast (message + icon slot)

   Prefs keys all start with `atlas-` per the app contract. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  DEFAULT_PREFS,
  PACK_SEED,
  TRIPS,
  type AtlasPrefs,
  type Destination,
} from "../lib/data";

export type ToastIcon = "plane" | "pin" | "bag" | "info" | "check";

export type ExpandedTile =
  | "destination"
  | "weather"
  | "flights"
  | "stay"
  | "budget"
  | "activities"
  | null;

const SAVED_KEY = "atlas-saved-v1";
const PACK_KEY = "atlas-pack-v1";
const PREFS_KEY = "atlas-prefs-v1";
const TRIP_KEY = "atlas-trip-v1";

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

interface Toast {
  msg: string;
  icon: ToastIcon;
}

interface AtlasContextValue {
  trips: Destination[];
  tripIdx: number;
  trip: Destination;
  setTripIdx: (i: number) => void;

  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;

  packed: Record<string, string[]>;
  isPacked: (tripId: string, itemId: string) => boolean;
  togglePacked: (tripId: string, itemId: string) => void;
  packedCount: (tripId: string) => number;

  prefs: AtlasPrefs;
  setPrefs: (p: Partial<AtlasPrefs>) => void;

  expanded: ExpandedTile;
  setExpanded: (t: ExpandedTile) => void;

  toast: Toast | null;
  showToast: (msg: string, icon?: ToastIcon) => void;
}

const AtlasContext = createContext<AtlasContextValue | null>(null);

/* Seed a trip's checklist from the fictional default if nothing stored. */
function seedPack(tripId: string): string[] {
  if (PACK_SEED[tripId]) return [...PACK_SEED[tripId]];
  if (tripId === TRIPS[0].id) return [...(PACK_SEED[TRIPS[0].id] ?? [])];
  return [];
}

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [tripIdx, setTripIdxState] = useState(0);
  const [saved, setSaved] = useState<string[]>(["kyoto", "lisbon", "reykjavik"]);
  const [packed, setPacked] = useState<Record<string, string[]>>(() => {
    const out: Record<string, string[]> = {};
    for (const t of TRIPS) out[t.id] = seedPack(t.id);
    return out;
  });
  const [prefs, setPrefsState] = useState<AtlasPrefs>(DEFAULT_PREFS);
  const [expanded, setExpanded] = useState<ExpandedTile>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const s = loadJson<string[]>(SAVED_KEY);
    if (Array.isArray(s)) setSaved(s);
    const p = loadJson<Record<string, string[]>>(PACK_KEY);
    if (p && typeof p === "object") {
      setPacked((prev) => {
        const next = { ...prev };
        for (const t of TRIPS) {
          if (Array.isArray(p[t.id])) next[t.id] = p[t.id];
        }
        return next;
      });
    }
    const pr = loadJson<Partial<AtlasPrefs>>(PREFS_KEY);
    if (pr) setPrefsState((prev) => ({ ...prev, ...pr }));
    const ti = loadJson<number>(TRIP_KEY);
    if (typeof ti === "number" && ti >= 0 && ti < TRIPS.length) setTripIdxState(ti);
  }, []);

  /* persist on change */
  useEffect(() => saveJson(SAVED_KEY, saved), [saved]);
  useEffect(() => saveJson(PACK_KEY, packed), [packed]);
  useEffect(() => saveJson(PREFS_KEY, prefs), [prefs]);
  useEffect(() => saveJson(TRIP_KEY, tripIdx), [tripIdx]);

  const showToast = useCallback((msg: string, icon: ToastIcon = "info") => {
    setToast({ msg, icon });
  }, []);

  /* auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const setTripIdx = useCallback((i: number) => {
    setTripIdxState(Math.max(0, Math.min(TRIPS.length - 1, i)));
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      setSaved((prev) => {
        const has = prev.includes(id);
        const dest = TRIPS.find((t) => t.id === id);
        showToast(
          has ? `${dest?.city ?? "Trip"} removed from saved` : `${dest?.city ?? "Trip"} saved to collection`,
          "pin"
        );
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [showToast]
  );

  const togglePacked = useCallback((tripId: string, itemId: string) => {
    setPacked((prev) => {
      const list = prev[tripId] ?? [];
      const has = list.includes(itemId);
      return {
        ...prev,
        [tripId]: has ? list.filter((x) => x !== itemId) : [...list, itemId],
      };
    });
  }, []);

  const value = useMemo<AtlasContextValue>(() => {
    const trip = TRIPS[tripIdx] ?? TRIPS[0];
    return {
      trips: TRIPS,
      tripIdx,
      trip,
      setTripIdx,

      saved,
      isSaved: (id) => saved.includes(id),
      toggleSaved,

      packed,
      isPacked: (tripId, itemId) => (packed[tripId] ?? []).includes(itemId),
      togglePacked,
      packedCount: (tripId) => (packed[tripId] ?? []).length,

      prefs,
      setPrefs: (p) => setPrefsState((prev) => ({ ...prev, ...p })),

      expanded,
      setExpanded,

      toast,
      showToast,
    };
  }, [tripIdx, setTripIdx, saved, toggleSaved, packed, togglePacked, prefs, expanded, toast, showToast]);

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas(): AtlasContextValue {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error("useAtlas must be used within <AtlasProvider>");
  return ctx;
}
