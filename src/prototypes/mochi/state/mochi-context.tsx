"use client";

/**
 * mochi / state — one context for the whole clay planner.
 *
 * Desktop state is not phone state: several views can be legible at once
 * (a master list AND a detail pane), a command palette can float over
 * everything, and app-wide preferences — clay depth, week start — reshape
 * the surface rather than just a row. All of it lives here.
 *
 * Everything user-editable (budget limits, added categories, added habits,
 * ticked days) is derived from the fixed seed in ../data and persisted, so
 * the demo is deterministic but still feels like a real planner.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AGENDA,
  CATEGORIES,
  HABITS,
  TODAY,
  streakOf,
  sum,
  weekBlocks,
  weekCounts,
  weekSlots,
  type AgendaItem,
  type Category,
  type Habit,
  type Tone,
  type WeekStart,
  type WeekSlot,
} from "../data";

export type ViewId = "today" | "budget" | "habits" | "settings";
/** How puffy the clay is — written to the DOM as data-clay-depth. */
export type Depth = "soft" | "medium" | "deep";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "today", label: "Today", hint: "Balance ring, habits, agenda, 30-day spend" },
  { id: "budget", label: "Budget", hint: "Category limits you can edit, per-category spend" },
  { id: "habits", label: "Habits", hint: "Streaks, weekly completion, add and remove" },
  { id: "settings", label: "Settings", hint: "Theme, clay depth, week start, shortcuts" },
];

export const DEPTH_LABEL: Record<Depth, string> = {
  soft: "Soft",
  medium: "Medium",
  deep: "Deep",
};

export const DEPTH_HINT: Record<Depth, string> = {
  soft: "Barely-there lift. Cards float a few pixels off the window.",
  medium: "The clay default — a real puffy lift with an inner highlight.",
  deep: "Heavy dough: the window looks carved out of one soft block.",
};

interface Prefs {
  depth: Depth;
  weekStart: WeekStart;
}

interface Plan {
  categories: Category[];
  habits: Habit[];
  agenda: AgendaItem[];
}

export interface MochiState {
  view: ViewId;
  go: (v: ViewId) => void;
  today: typeof TODAY;

  /* preferences */
  depth: Depth;
  setDepth: (d: Depth) => void;
  weekStart: WeekStart;
  setWeekStart: (w: WeekStart) => void;
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;

  /* budget */
  categories: Category[];
  budget: { limit: number; spent: number; left: number; ratio: number };
  selectedCategory: string | null;
  selectCategory: (id: string | null) => void;
  setCategoryLimit: (id: string, limit: number) => void;
  addCategory: (name: string, limit: number) => void;
  removeCategory: (id: string) => void;
  categoryById: (id: string | null) => Category | undefined;
  categorySearch: string;
  setCategorySearch: (s: string) => void;

  /* habits */
  habits: Habit[];
  habitProgress: { done: number; total: number; ratio: number };
  selectedHabit: string | null;
  selectHabit: (id: string | null) => void;
  toggleHabit: (id: string) => void;
  addHabit: (name: string, cue: string, target: number) => void;
  removeHabit: (id: string) => void;
  habitById: (id: string | null) => Habit | undefined;
  slots: WeekSlot[];
  streak: (h: Habit) => number;
  counts: (h: Habit) => number[];
  blocks: (h: Habit) => { done: number; of: number }[];

  /* agenda */
  agenda: AgendaItem[];
  toggleAgenda: (id: string) => void;

  /* desktop chrome */
  isWide: boolean;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;

  resetAll: () => void;
}

const Ctx = createContext<MochiState | null>(null);

const PREFS_KEY = "mochi-prefs-v1";
const PLAN_KEY = "mochi-plan-v1";

const TONE_CYCLE: Tone[] = ["primary", "secondary", "tertiary", "warn", "error"];

/* Ids are minted from a counter, never Math.random, so a session that adds
   three categories always calls them the same three names. */
function seedPlan(): Plan {
  return {
    categories: CATEGORIES.map((c) => ({ ...c, byDay: [...c.byDay] })),
    habits: HABITS.map((h) => ({ ...h, history: [...h.history] })),
    agenda: AGENDA.map((a) => ({ ...a })),
  };
}

export function MochiProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("today");
  const [prefs, setPrefsState] = useState<Prefs>({ depth: "medium", weekStart: "mon" });
  const [plan, setPlan] = useState<Plan>(seedPlan);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("c-groceries");
  const [selectedHabit, setSelectedHabit] = useState<string | null>("h-water");
  const [categorySearch, setCategorySearch] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isWide, setIsWide] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const idRef = useRef(1);

  /* --- hydrate persisted preferences + plan (SSR-safe) --- */
  useEffect(() => {
    try {
      const rawP = localStorage.getItem(PREFS_KEY);
      if (rawP) {
        const p = JSON.parse(rawP) as Partial<Prefs>;
        if (p.depth === "soft" || p.depth === "medium" || p.depth === "deep") {
          setPrefsState((s) => ({ ...s, depth: p.depth as Depth }));
        }
        if (p.weekStart === "mon" || p.weekStart === "sun") {
          setPrefsState((s) => ({ ...s, weekStart: p.weekStart as WeekStart }));
        }
      }
      const rawL = localStorage.getItem(PLAN_KEY);
      if (rawL) {
        const l = JSON.parse(rawL) as Partial<Plan>;
        setPlan((s) => ({
          categories: Array.isArray(l.categories) && l.categories.length ? l.categories : s.categories,
          habits: Array.isArray(l.habits) && l.habits.length ? l.habits : s.habits,
          agenda: Array.isArray(l.agenda) ? l.agenda : s.agenda,
        }));
      }
    } catch {
      /* best-effort */
    }
    setHydrated(true);
  }, []);

  /* --- persist once hydrated, never during the first render --- */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    } catch {
      /* best-effort */
    }
  }, [prefs, plan, hydrated]);

  /* --- desktop shortcuts only make sense in the desktop layout.
         isWide follows the SURFACE, not the browser viewport, so a 1400px
         window showing an 834px tablet surface is correctly "narrow". --- */
  useEffect(() => {
    const el = document.querySelector(".surface");
    if (!el) return;
    const check = () => setIsWide(el.getBoundingClientRect().width > 900);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* --- hash routing (#today #budget #habits #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "today");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#today");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setCategorySearch("");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K, Esc, 1–4, "/" --- */
  useEffect(() => {
    if (!isWide) return;
    const typing = (e: KeyboardEvent) =>
      !!(e.target as HTMLElement)?.closest("input, textarea, select");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedCategory(null);
        setSelectedHabit(null);
        return;
      }
      if (typing(e)) return;
      if (/^[1-4]$/.test(e.key)) {
        go(VIEWS[Number(e.key) - 1].id);
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        go("budget");
        window.setTimeout(
          () => document.querySelector<HTMLInputElement>(".mch-search input")?.focus(),
          60
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, isWide]);

  /* never leave the palette stranded over a tablet layout */
  useEffect(() => {
    if (!isWide) setPaletteOpen(false);
  }, [isWide]);

  /* --- preferences --- */
  const setPrefs = useCallback((p: Partial<Prefs>) => {
    setPrefsState((s) => ({ ...s, ...p }));
  }, []);
  const setDepth = useCallback((d: Depth) => setPrefsState((s) => ({ ...s, depth: d })), []);
  const setWeekStart = useCallback(
    (w: WeekStart) => setPrefsState((s) => ({ ...s, weekStart: w })),
    []
  );

  /* --- budget --- */
  const budget = useMemo(() => {
    const limit = sum(plan.categories.map((c) => c.limit));
    const spent = sum(plan.categories.map((c) => c.spent));
    return { limit, spent, left: limit - spent, ratio: limit > 0 ? spent / limit : 0 };
  }, [plan.categories]);

  const setCategoryLimit = useCallback(
    (id: string, limit: number) => {
      const safe = Math.max(0, Math.round(limit));
      setPlan((s) => ({
        ...s,
        categories: s.categories.map((c) => (c.id === id ? { ...c, limit: safe } : c)),
      }));
    },
    []
  );

  const addCategory = useCallback(
    (name: string, limit: number) => {
      const clean = name.trim();
      if (!clean) return;
      const id = `c-new-${idRef.current}`;
      idRef.current += 1;
      const tone = TONE_CYCLE[idRef.current % TONE_CYCLE.length];
      setPlan((s) => ({
        ...s,
        categories: [
          ...s.categories,
          { id, name: clean, limit: Math.max(0, Math.round(limit)), spent: 0, tone, note: "New envelope — nothing spent yet.", byDay: [0, 0, 0, 0, 0, 0, 0] },
        ],
      }));
      setSelectedCategory(id);
      notify(`Added “${clean}”`);
    },
    [notify]
  );

  const removeCategory = useCallback(
    (id: string) => {
      setPlan((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));
      setSelectedCategory((cur) => (cur === id ? null : cur));
      notify("Envelope removed");
    },
    [notify]
  );

  /* --- habits --- */
  const habitProgress = useMemo(() => {
    const total = plan.habits.length;
    const done = plan.habits.filter((h) => h.history[h.history.length - 1]).length;
    return { done, total, ratio: total > 0 ? done / total : 0 };
  }, [plan.habits]);

  const toggleHabit = useCallback(
    (id: string) => {
      setPlan((s) => ({
        ...s,
        habits: s.habits.map((h) => {
          if (h.id !== id) return h;
          const history = [...h.history];
          const last = history.length - 1;
          history[last] = history[last] ? 0 : 1;
          return { ...h, history };
        }),
      }));
    },
    []
  );

  const addHabit = useCallback(
    (name: string, cue: string, target: number) => {
      const clean = name.trim();
      if (!clean) return;
      const id = `h-new-${idRef.current}`;
      idRef.current += 1;
      const tone = TONE_CYCLE[idRef.current % TONE_CYCLE.length];
      setPlan((s) => ({
        ...s,
        habits: [
          ...s.habits,
          {
            id,
            name: clean,
            cue: cue.trim() || "No cue yet",
            target: Math.max(1, Math.min(7, Math.round(target))),
            tone,
            // a brand-new habit starts as a blank 28-day strip
            history: new Array(28).fill(0) as Habit["history"],
          },
        ],
      }));
      setSelectedHabit(id);
      notify(`Added “${clean}”`);
    },
    [notify]
  );

  const removeHabit = useCallback(
    (id: string) => {
      setPlan((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
      setSelectedHabit((cur) => (cur === id ? null : cur));
      notify("Habit removed");
    },
    [notify]
  );

  const toggleAgenda = useCallback((id: string) => {
    setPlan((s) => ({
      ...s,
      agenda: s.agenda.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setPrefsState({ depth: "medium", weekStart: "mon" });
    setPlan(seedPlan());
    setSelectedCategory("c-groceries");
    setSelectedHabit("h-water");
    setCategorySearch("");
    notify("Plan reset to the seeded demo");
  }, [notify]);

  /* --- selectors --- */
  const slots = useMemo(() => weekSlots(prefs.weekStart), [prefs.weekStart]);
  const categoryById = useCallback(
    (id: string | null) => plan.categories.find((c) => c.id === id),
    [plan.categories]
  );
  const habitById = useCallback((id: string | null) => plan.habits.find((h) => h.id === id), [plan.habits]);
  const streak = useCallback((h: Habit) => streakOf(h.history), []);
  const counts = useCallback(
    (h: Habit) => weekCounts(h.history, prefs.weekStart),
    [prefs.weekStart]
  );
  const blocks = useCallback((h: Habit) => weekBlocks(h.history), []);

  const value: MochiState = {
    view,
    go,
    today: TODAY,
    depth: prefs.depth,
    setDepth,
    weekStart: prefs.weekStart,
    setWeekStart,
    prefs,
    setPrefs,
    categories: plan.categories,
    budget,
    selectedCategory,
    selectCategory: setSelectedCategory,
    setCategoryLimit,
    addCategory,
    removeCategory,
    categoryById,
    categorySearch,
    setCategorySearch,
    habits: plan.habits,
    habitProgress,
    selectedHabit,
    selectHabit: setSelectedHabit,
    toggleHabit,
    addHabit,
    removeHabit,
    habitById,
    slots,
    streak,
    counts,
    blocks,
    agenda: plan.agenda,
    toggleAgenda,
    isWide,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    resetAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMochi(): MochiState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMochi must be used within <MochiProvider>");
  return ctx;
}
