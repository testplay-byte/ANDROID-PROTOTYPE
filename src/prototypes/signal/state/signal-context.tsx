"use client";

/**
 * signal / state — one context for the whole console.
 *
 * Signal is a desktop app, so its state is desktop-shaped: a hash-routed
 * view, a global range + segment filter that every chart re-derives from, a
 * multi-selected event table with a detail inspector open BESIDE it, a
 * command palette over everything, and two app-wide display preferences
 * (row density and "reduce motion") that really do change how the charts
 * draw.
 *
 * Every value here is derived from `../data` — no clocks, no randomness.
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
  CATEGORIES,
  EVENTS,
  PLATFORMS,
  PLANS,
  RANGES,
  cohortsFor,
  eventById,
  funnelFor,
  metricOf,
  revenueMix,
  stackedSessions,
  windowFor,
  type EventCategory,
  type EventRow,
  type PlanId,
  type PlatformId,
  type RangeId,
  type SortDir as SortDirAlias,
  type SortKey as SortKeyAlias,
} from "../data";

export type { SortDir, SortKey } from "../data";

export type ViewId = "overview" | "insights" | "funnel" | "retention" | "explore" | "settings";
export type Density = "comfortable" | "compact";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "overview", label: "Overview", hint: "KPI row, time series, mix and live feed" },
  { id: "funnel", label: "Funnel", hint: "Activation funnel with step conversion" },
  { id: "retention", label: "Retention", hint: "Weekly cohort grid + curve" },
  { id: "explore", label: "Explore", hint: "Event table with a row inspector" },
  { id: "settings", label: "Settings", hint: "Theme, motion, density, keyboard" },
];

/** The metric the big time-series chart is drawing. */
export type SeriesId = "activeUsers" | "sessions" | "signups";

interface SignalState {
  /* ---- navigation ---- */
  view: ViewId;
  go: (v: ViewId) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;

  /* ---- global filters (the segment bar) ---- */
  range: RangeId;
  setRange: (r: RangeId) => void;
  cycleRange: () => void;
  platform: PlatformId;
  setPlatform: (p: PlatformId) => void;
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  resetSegments: () => void;
  segmentsDirty: boolean;

  /* ---- preferences ---- */
  density: Density;
  setDensity: (d: Density) => void;
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;

  /* ---- overview ---- */
  series: SeriesId;
  setSeries: (s: SeriesId) => void;

  /* ---- explore ---- */
  search: string;
  setSearch: (s: string) => void;
  categories: EventCategory[];
  toggleCategory: (c: EventCategory) => void;
  sort: { key: SortKeyAlias; dir: SortDirAlias };
  toggleSort: (key: SortKeyAlias) => void;
  checked: string[];
  toggleChecked: (id: string) => void;
  clearChecked: () => void;
  selectedEvent: string | null;
  selectEvent: (id: string | null) => void;
  filteredEvents: EventRow[];

  /* ---- derived data, memoised per filter change ---- */
  win: ReturnType<typeof windowFor>;
  metrics: ReturnType<typeof metricOf>[];
  stacks: ReturnType<typeof stackedSessions>;
  mix: ReturnType<typeof revenueMix>;
  funnel: ReturnType<typeof funnelFor>;
  cohorts: ReturnType<typeof cohortsFor>;
  selected: EventRow | null;
}

const Ctx = createContext<SignalState | null>(null);

const STORAGE = {
  density: "signal-density",
  motion: "signal-reduce-motion",
  segment: "signal-segment",
};

export function SignalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("overview");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [range, setRangeState] = useState<RangeId>("30d");
  const [platform, setPlatformState] = useState<PlatformId>("all");
  const [plan, setPlanState] = useState<PlanId>("all");
  const [series, setSeries] = useState<SeriesId>("activeUsers");

  const [density, setDensityState] = useState<Density>("comfortable");
  const [reduceMotion, setReduceMotionState] = useState(false);

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [sort, setSort] = useState<{ key: SortKeyAlias; dir: SortDirAlias }>({ key: "volume", dir: "desc" });
  const [checked, setChecked] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  /* --- hydrate persisted preferences (after mount, so SSR matches) --- */
  useEffect(() => {
    try {
      const d = localStorage.getItem(STORAGE.density);
      if (d === "compact" || d === "comfortable") setDensityState(d);
      if (localStorage.getItem(STORAGE.motion) === "1") setReduceMotionState(true);
      const seg = JSON.parse(localStorage.getItem(STORAGE.segment) ?? "null") as
        | { platform?: PlatformId; plan?: PlanId }
        | null;
      if (seg?.platform && PLATFORMS.some((p) => p.id === seg.platform)) setPlatformState(seg.platform);
      if (seg?.plan && PLANS.some((p) => p.id === seg.plan)) setPlanState(seg.plan);
    } catch {
      /* best effort */
    }
  }, []);

  const persistSegment = useCallback((p: PlatformId, pl: PlanId) => {
    try {
      localStorage.setItem(STORAGE.segment, JSON.stringify({ platform: p, plan: pl }));
    } catch {
      /* best effort */
    }
  }, []);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(STORAGE.density, d);
    } catch {}
  }, []);

  const setReduceMotion = useCallback((v: boolean) => {
    setReduceMotionState(v);
    try {
      localStorage.setItem(STORAGE.motion, v ? "1" : "0");
    } catch {}
  }, []);

  const setRange = useCallback((r: RangeId) => setRangeState(r), []);
  const cycleRange = useCallback(() => {
    setRangeState((r) => {
      const i = RANGES.findIndex((x) => x.id === r);
      return RANGES[(i + 1) % RANGES.length].id;
    });
  }, []);
  const setPlatform = useCallback(
    (p: PlatformId) => {
      setPlatformState(p);
      persistSegment(p, plan);
    },
    [plan, persistSegment]
  );
  const setPlan = useCallback(
    (p: PlanId) => {
      setPlanState(p);
      persistSegment(platform, p);
    },
    [platform, persistSegment]
  );
  const resetSegments = useCallback(() => {
    setPlatformState("all");
    setPlanState("all");
    persistSegment("all", "all");
  }, [persistSegment]);

  /* --- hash routing: /prototypes/signal/desktop/#funnel is deep-linkable --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "overview");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#overview");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setSelectedEvent(null);
    setSearch("");
    setCategories([]);
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K, Esc, 1–5 --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = !!(e.target as HTMLElement)?.closest("input, textarea");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedEvent(null);
        setChecked([]);
        return;
      }
      if (typing) return;
      if (/^[1-5]$/.test(e.key)) {
        setView(VIEWS[Number(e.key) - 1].id);
        try {
          history.pushState(null, "", `#${VIEWS[Number(e.key) - 1].id}`);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const toggleSort = useCallback((key: SortKeyAlias) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "event" || key === "category" ? "asc" : "desc" }
    );
  }, []);

  const toggleCategory = useCallback((c: EventCategory) => {
    setCategories((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));
  }, []);

  /* --- derived data: one window, sliced by the global range --- */
  const win = useMemo(() => windowFor(range), [range]);
  const metrics = useMemo(
    () => (["activeUsers", "sessions", "signups", "activation", "latency"] as const).map(metricOf),
    []
  );
  const stacks = useMemo(() => stackedSessions(win), [win]);
  const mix = useMemo(() => revenueMix(win, plan), [win, plan]);
  const funnel = useMemo(() => funnelFor(win, platform, plan), [win, platform, plan]);
  const cohorts = useMemo(() => cohortsFor(plan), [plan]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = EVENTS.filter(
      (e) =>
        (categories.length === 0 || categories.includes(e.category)) &&
        (!q || e.event.toLowerCase().includes(q) || e.owner.toLowerCase().includes(q))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "event":
          return a.event.localeCompare(b.event) * dir;
        case "category":
          return a.category.localeCompare(b.category) * dir;
        case "users":
          return (a.users - b.users) * dir;
        case "volume":
          return (a.volume - b.volume) * dir;
        case "delta":
          return (a.delta - b.delta) * dir;
        case "trend":
          return (a.trend[13] - a.trend[0] - (b.trend[13] - b.trend[0])) * dir;
      }
    });
  }, [search, categories, sort]);

  const selected = useMemo(() => eventById(selectedEvent) ?? null, [selectedEvent]);

  const value: SignalState = {
    view,
    go,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    range,
    setRange,
    cycleRange,
    platform,
    setPlatform,
    plan,
    setPlan,
    resetSegments,
    segmentsDirty: platform !== "all" || plan !== "all",
    density,
    setDensity,
    reduceMotion,
    setReduceMotion,
    series,
    setSeries,
    search,
    setSearch,
    categories,
    toggleCategory,
    sort,
    toggleSort,
    checked,
    toggleChecked: (id) => setChecked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    clearChecked: () => setChecked([]),
    selectedEvent,
    selectEvent: setSelectedEvent,
    filteredEvents,
    win,
    metrics,
    stacks,
    mix,
    funnel,
    cohorts,
    selected,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSignal(): SignalState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSignal must be used within <SignalProvider>");
  return ctx;
}

/** Cohort helper kept here so screens never reach into data's internals. */
export const cohortSummary = (cohorts: ReturnType<typeof cohortsFor>) => {
  const mature = cohorts.filter((c) => c.values.filter((v) => !Number.isNaN(v)).length >= 4);
  const w1 = mature.map((c) => c.values[1]).filter((v) => !Number.isNaN(v));
  const w4 = mature.map((c) => c.values[4]).filter((v) => !Number.isNaN(v));
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  return {
    w1: avg(w1),
    w4: avg(w4),
    best: mature.slice().sort((a, b) => b.values[4] - a.values[4])[0] ?? cohorts[0],
    users: cohorts.reduce((a, c) => a + c.size, 0),
  };
};

export { CATEGORIES };
