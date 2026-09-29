"use client";

/**
 * atelier / state — one context for the whole desktop app.
 *
 * Desktop state is genuinely different from a phone prototype: a work can be
 * open ALONGSIDE the grid, a board column can be pinned by number, a command
 * palette can sit over everything, and two preferences (density and contrast)
 * change the whole window at once. All of it lives here so any component can
 * read or drive it.
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
  CARDS,
  MAKERS,
  NEXT_STAGE,
  STAGES,
  WORKS,
  loadPct,
  stageLabel,
  type Card,
  type Discipline,
  type Stage,
  type Work,
} from "../data";

export type ViewId = "work" | "board" | "studio" | "settings";
export type Density = "regular" | "dense";
export type Contrast = "full" | "reduced";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "work", label: "Work", hint: "The plate wall — portfolio by discipline" },
  { id: "board", label: "Board", hint: "Studio production board" },
  { id: "studio", label: "Studio", hint: "Makers, disciplines and capacity" },
  { id: "settings", label: "Settings", hint: "Theme, contrast, density, shortcuts" },
];

const PREFS_KEY = "atelier-prefs-v1";

interface Prefs {
  density: Density;
  contrast: Contrast;
}

const DEFAULT_PREFS: Prefs = { density: "regular", contrast: "full" };

interface AtelierState {
  view: ViewId;
  go: (v: ViewId) => void;
  /* prefs */
  density: Density;
  setDensity: (d: Density) => void;
  contrast: Contrast;
  setContrast: (c: Contrast) => void;
  resetPrefs: () => void;
  /* work */
  discipline: Discipline | "all";
  setDiscipline: (d: Discipline | "all") => void;
  selectedWork: string | null;
  selectWork: (id: string | null) => void;
  filteredWorks: Work[];
  /* board */
  cards: Card[];
  advanceCard: (id: string) => void;
  boardColumn: number;
  setBoardColumn: (n: number) => void;
  stageCounts: Record<Stage, number>;
  /* studio */
  makers: typeof MAKERS;
  loadPct: (m: (typeof MAKERS)[number]) => number;
  /* overlays */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<AtelierState | null>(null);

export function AtelierProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("work");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [discipline, setDiscipline] = useState<Discipline | "all">("all");
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const [boardColumn, setBoardColumn] = useState(0);
  const [cards, setCards] = useState<Card[]>(CARDS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- preferences persist app-wide, like every other desktop pref --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const v = JSON.parse(raw) as Partial<Prefs>;
        setPrefs((p) => ({
          density: v.density === "dense" ? "dense" : p.density,
          contrast: v.contrast === "reduced" ? "reduced" : p.contrast,
        }));
      }
    } catch {
      /* best-effort */
    }
  }, []);
  const save = useCallback((next: Prefs) => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* best-effort */
    }
  }, []);
  const setDensity = useCallback(
    (density: Density) => {
      setPrefs((p) => {
        const next = { ...p, density };
        save(next);
        return next;
      });
    },
    [save]
  );
  const setContrast = useCallback(
    (contrast: Contrast) => {
      setPrefs((p) => {
        const next = { ...p, contrast };
        save(next);
        return next;
      });
    },
    [save]
  );
  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    save(DEFAULT_PREFS);
  }, [save]);

  /* --- hash routing (#work #board #studio #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "work");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#work");
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
    setSelectedWork(null);
    setDiscipline("all");
    setBoardColumn(0);
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K command overlay, Esc closes --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedWork(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const filteredWorks = useMemo(
    () => (discipline === "all" ? WORKS : WORKS.filter((w) => w.discipline === discipline)),
    [discipline]
  );

  const advanceCard = useCallback(
    (id: string) => {
      const card = cards.find((c) => c.id === id);
      if (!card) return;
      const to = NEXT_STAGE[card.stage];
      setCards((list) => list.map((c) => (c.id === id ? { ...c, stage: to } : c)));
      notify(`“${card.title}” → ${stageLabel(to)}`);
    },
    [cards, notify]
  );

  const stageCounts = useMemo(() => {
    const out = { commission: 0, sketch: 0, construction: 0, installed: 0 } as Record<Stage, number>;
    for (const c of cards) out[c.stage] += 1;
    return out;
  }, [cards]);

  const value: AtelierState = {
    view,
    go,
    density: prefs.density,
    setDensity,
    contrast: prefs.contrast,
    setContrast,
    resetPrefs,
    discipline,
    setDiscipline,
    selectedWork,
    selectWork: setSelectedWork,
    filteredWorks,
    cards,
    advanceCard,
    boardColumn,
    setBoardColumn,
    stageCounts,
    makers: MAKERS,
    loadPct,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAtelier(): AtelierState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAtelier must be used within <AtelierProvider>");
  return ctx;
}
