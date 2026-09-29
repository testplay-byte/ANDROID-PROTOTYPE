"use client";

/**
 * aurora / state — one context for the whole desktop window.
 *
 * Desktop state is not phone state: there are hash-routed VIEWS, a command
 * palette that can be open over everything, an app-wide unit preference that
 * re-renders every temperature on screen, a glass-intensity preference that
 * re-skins the whole window through a data attribute, and a saved-city list
 * you can add to and remove from. All of it lives here so any screen can
 * read or drive it.
 *
 * Persistence: unit, glass intensity, the saved city list, the active city
 * and the ambience scene are all remembered (SSR-safe — every read happens in
 * an effect, never during render).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AMBIENCES,
  CITIES,
  DEFAULT_SAVED,
  ambienceById,
  cityById,
  type AmbienceId,
  type City,
  type Unit,
} from "../data";

export type ViewId = "now" | "cities" | "details" | "settings";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "now", label: "Now", hint: "Current conditions for the active city" },
  { id: "cities", label: "Cities", hint: "Saved locations — add, remove, switch" },
  { id: "details", label: "Details", hint: "Radar field, sun track, wind and humidity" },
  { id: "settings", label: "Settings", hint: "Theme, units, glass intensity, shortcuts" },
];

/** Glass is three steps, not a free slider — each one is a real blur change. */
export type GlassLevel = "soft" | "standard" | "dense";
export const GLASS_LEVELS: { id: GlassLevel; label: string; hint: string }[] = [
  { id: "soft", label: "Soft", hint: "Barely-there frost, most of the scene shows through" },
  { id: "standard", label: "Standard", hint: "The shipped recipe — 20px blur, layered tokens" },
  { id: "dense", label: "Dense", hint: "Heavy frost, the panels dominate the ambient" },
];

const KEYS = {
  unit: "aurora-unit",
  glass: "aurora-glass",
  cities: "aurora-cities",
  active: "aurora-active",
  ambience: "aurora-ambience",
};

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode — the prototype still works, it just forgets */
  }
};

interface AuroraState {
  /* routing */
  view: ViewId;
  go: (v: ViewId) => void;
  /* preferences */
  unit: Unit;
  setUnit: (u: Unit) => void;
  toggleUnit: () => void;
  glass: GlassLevel;
  setGlass: (g: GlassLevel) => void;
  cycleGlass: () => void;
  /* cities */
  savedIds: string[];
  catalogue: City[];
  savedCities: City[];
  addCity: (id: string) => void;
  removeCity: (id: string) => void;
  activeId: string;
  active: City;
  setActive: (id: string) => void;
  /* ambience */
  ambience: AmbienceId;
  setAmbience: (id: AmbienceId) => void;
  /* overlays */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  addPanelOpen: boolean;
  setAddPanelOpen: (open: boolean) => void;
  cityQuery: string;
  setCityQuery: (q: string) => void;
  /* feedback */
  toast: string | null;
  notify: (msg: string) => void;
  /* demo-data actions */
  resetPreferences: () => void;
}

const Ctx = createContext<AuroraState | null>(null);

export function AuroraProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("now");
  const [unit, setUnitState] = useState<Unit>("c");
  const [glass, setGlassState] = useState<GlassLevel>("standard");
  const [savedIds, setSavedIds] = useState<string[]>(DEFAULT_SAVED);
  const [activeId, setActiveIdState] = useState<string>(DEFAULT_SAVED[0]);
  const [ambience, setAmbienceState] = useState<AmbienceId>("ocean-swell");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  /* --- restore preferences once, after mount (never during render) --- */
  useEffect(() => {
    const u = read(KEYS.unit);
    if (u === "c" || u === "f") setUnitState(u);
    const g = read(KEYS.glass);
    if (g === "soft" || g === "standard" || g === "dense") setGlassState(g);
    const c = read(KEYS.cities);
    if (c) {
      try {
        const list = JSON.parse(c) as string[];
        const valid = list.filter((id) => CITIES.some((x) => x.id === id));
        if (valid.length) setSavedIds(valid);
      } catch {
        /* keep the defaults */
      }
    }
    const a = read(KEYS.active);
    if (a) setActiveIdState(a);
    const m = read(KEYS.ambience);
    if (m && AMBIENCES.some((x) => x.id === m)) setAmbienceState(m as AmbienceId);
  }, []);

  /* --- preferences write-through --- */
  const setUnit = useCallback((u: Unit) => {
    setUnitState(u);
    write(KEYS.unit, u);
  }, []);
  const toggleUnit = useCallback(() => {
    setUnitState((u) => {
      write(KEYS.unit, u === "c" ? "f" : "c");
      return u === "c" ? "f" : "c";
    });
  }, []);
  const setGlass = useCallback((g: GlassLevel) => {
    setGlassState(g);
    write(KEYS.glass, g);
  }, []);
  const cycleGlass = useCallback(() => {
    setGlassState((g) => {
      const order: GlassLevel[] = ["soft", "standard", "dense"];
      const next = order[(order.indexOf(g) + 1) % order.length];
      write(KEYS.glass, next);
      return next;
    });
  }, []);

  /* --- hash routing (#now #cities #details #settings) --- */
  useEffect(() => {
    const readHash = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "now");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#now");
      } catch {
        /* sandbox may block history writes */
      }
    }
    readHash();
    window.addEventListener("popstate", readHash);
    window.addEventListener("hashchange", readHash);
    return () => {
      window.removeEventListener("popstate", readHash);
      window.removeEventListener("hashchange", readHash);
    };
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setPaletteOpen(false);
    setAddPanelOpen(false);
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- cities --- */
  const savedCities = useMemo(
    () => savedIds.map((id) => cityById(id)),
    [savedIds]
  );
  const catalogue = useMemo(
    () => CITIES.filter((c) => !savedIds.includes(c.id)),
    [savedIds]
  );

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveIdState(id);
    write(KEYS.active, id);
    setAmbienceState(cityById(id).ambience);
    write(KEYS.ambience, cityById(id).ambience);
  }, []);

  const addCity = useCallback(
    (id: string) => {
      const city = cityById(id);
      setSavedIds((list) => {
        if (list.includes(id)) return list;
        const next = [...list, id];
        write(KEYS.cities, JSON.stringify(next));
        return next;
      });
      setActive(id);
      notify(`${city.name} added to your locations`);
    },
    [notify]
  );

  const removeCity = useCallback(
    (id: string) => {
      const city = cityById(id);
      setSavedIds((list) => {
        if (list.length <= 1) return list;
        const next = list.filter((x) => x !== id);
        write(KEYS.cities, JSON.stringify(next));
        return next;
      });
      setActiveIdState((current) => {
        if (current !== id) return current;
        const fallback = savedIds.find((x) => x !== id) ?? DEFAULT_SAVED[0];
        write(KEYS.active, fallback);
        return fallback;
      });
      notify(`${city.name} removed`);
    },
    [savedIds]
  );

  const setAmbience = useCallback((id: AmbienceId) => {
    setAmbienceState(id);
    write(KEYS.ambience, id);
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K palette, Esc closes --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setAddPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetPreferences = useCallback(() => {
    setUnitState("c");
    setGlassState("standard");
    setSavedIds(DEFAULT_SAVED);
    setActiveIdState(DEFAULT_SAVED[0]);
    setAmbienceState(cityById(DEFAULT_SAVED[0]).ambience);
    write(KEYS.unit, "c");
    write(KEYS.glass, "standard");
    write(KEYS.cities, JSON.stringify(DEFAULT_SAVED));
    write(KEYS.active, DEFAULT_SAVED[0]);
    write(KEYS.ambience, cityById(DEFAULT_SAVED[0]).ambience);
    notify("Preferences reset to defaults");
  }, [notify]);

  const value: AuroraState = {
    view,
    go,
    unit,
    setUnit,
    toggleUnit,
    glass,
    setGlass,
    cycleGlass,
    savedIds,
    catalogue,
    savedCities,
    addCity,
    removeCity,
    activeId,
    active: cityById(activeId),
    setActive,
    ambience,
    setAmbience,
    paletteOpen,
    setPaletteOpen,
    addPanelOpen,
    setAddPanelOpen,
    cityQuery,
    setCityQuery,
    toast,
    notify,
    resetPreferences,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAurora(): AuroraState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAurora must be used within <AuroraProvider>");
  return ctx;
}
