"use client";

/**
 * facet / state — one context for the whole desktop dashboard.
 *
 * Desktop state is not phone state. Here the board is *editable*: tiles can
 * be re-spanned, hidden and restored, the selected day is shared between the
 * agenda tile and the month grid, a capture typed into a 1×1 tile really
 * lands in the inbox, and a ⌘K palette floats over all of it. All of that
 * lives in one provider so any component can read or drive it.
 *
 * Determinism: nothing here reads a clock. "Today" is TODAY (2026-09-28) and
 * every stamp is a pinned string built from a counter, never from the date.
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
  CAPTURES,
  EVENTS,
  HABITS,
  NOTES,
  SPAN_CYCLE,
  TILES,
  TODAY,
  type AgendaEvent,
  type Capture,
  type Habit,
  type Note,
  type SpanId,
} from "../data";

export type ViewId = "board" | "calendar" | "notes" | "settings";
export type Density = "compact" | "cosy" | "roomy";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "board", label: "Board", hint: "The bento grid — every tile, one job" },
  { id: "calendar", label: "Calendar", hint: "Month grid with the day detail beside it" },
  { id: "notes", label: "Notes", hint: "Searchable list and a real editor" },
  { id: "settings", label: "Settings", hint: "Theme, tile density, hidden tiles, shortcuts" },
];

export const PREFS_KEY = "facet-prefs-v1";

export interface Prefs {
  density: Density;
  /** tile ids removed from the board by the #settings hide control */
  hidden: string[];
}

export const DEFAULT_PREFS: Prefs = { density: "cosy", hidden: [] };

/** The default spans come from the tile definitions themselves. */
const DEFAULT_SPANS: Record<string, SpanId> = Object.fromEntries(
  TILES.map((t) => [t.id, t.span])
) as Record<string, SpanId>;

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** A day's events, time-ordered. Pure read — the calendar and the agenda
 *  tile both go through it, so they can never disagree. */
export function eventsForDay(dayIso: string): AgendaEvent[] {
  return EVENTS.filter((e) => e.day === dayIso).sort((a, b) => a.start - b.start);
}

interface FacetState {
  view: ViewId;
  go: (v: ViewId) => void;

  /* ---- the bento board ---- */
  spans: Record<string, SpanId>;
  /** 1×1 → 2×1 → 2×2 → 1×2 → 1×1 (dir -1 walks it backwards) */
  cycleSpan: (id: string, dir?: 1 | -1) => void;
  resetSpans: () => void;
  /** the tile the keyboard span shortcuts act on */
  activeTile: string | null;
  setActiveTile: (id: string | null) => void;

  /* ---- preferences (persisted) ---- */
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  resetPrefs: () => void;
  hideTile: (id: string) => void;
  showTile: (id: string) => void;
  showAllTiles: () => void;
  visibleTiles: typeof TILES;

  /* ---- quick capture (really appends) ---- */
  captures: Capture[];
  captureDraft: string;
  setCaptureDraft: (s: string) => void;
  addCapture: () => void;
  toggleCapture: (id: string) => void;
  clearCaptures: () => void;
  captureFocus: number;
  focusCapture: () => void;

  /* ---- habits ---- */
  habits: Habit[];
  toggleHabit: (id: string) => void;
  habitsDone: number;

  /* ---- calendar ---- */
  selectedDay: string;
  selectDay: (dayIso: string) => void;
  monthOffset: number;
  shiftMonth: (delta: number) => void;
  eventsFor: (dayIso: string) => AgendaEvent[];

  /* ---- notes ---- */
  notes: Note[];
  noteId: string;
  selectNote: (id: string) => void;
  search: string;
  setSearch: (s: string) => void;
  visibleNotes: Note[];
  editNote: (id: string, body: string) => void;
  addNote: () => void;
  deleteNote: (id: string) => void;

  /* ---- chrome ---- */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<FacetState | null>(null);

export function FacetProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("board");
  const [spans, setSpans] = useState<Record<string, SpanId>>(DEFAULT_SPANS);
  const [activeTile, setActiveTile] = useState<string | null>(null);

  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [captures, setCaptures] = useState<Capture[]>(CAPTURES);
  const [captureDraft, setCaptureDraft] = useState("");
  const [captureSeq, setCaptureSeq] = useState(0);
  const [captureFocus, setCaptureFocus] = useState(0);

  const [habits, setHabits] = useState<Habit[]>(HABITS);
  const [selectedDay, setSelectedDay] = useState<string>(TODAY);
  const [monthOffset, setMonthOffset] = useState(0);

  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [noteId, setNoteId] = useState<string>(NOTES[0].id);
  const [search, setSearch] = useState("");

  /* --- preferences hydrate (SSR-safe: read only after mount) --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Prefs>;
        setPrefsState({
          density:
            p.density === "compact" || p.density === "roomy" ? p.density : DEFAULT_PREFS.density,
          hidden: Array.isArray(p.hidden)
            ? p.hidden.filter((id) => TILES.some((t) => t.id === id && t.hideable))
            : [],
        });
      }
    } catch {
      /* best effort */
    }
  }, []);

  /* One write path, so persistence can never be forgotten: every change goes
     through `updatePrefs`, whether it arrives as a patch or an updater. */
  const updatePrefs = useCallback((fn: (p: Prefs) => Prefs) => {
    setPrefsState((p) => {
      const next = fn(p);
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        /* best effort */
      }
      return next;
    });
  }, []);

  const setPrefs = useCallback(
    (patch: Partial<Prefs>) => {
      updatePrefs((p) => ({ ...p, ...patch }));
    },
    [updatePrefs]
  );

  const resetPrefs = useCallback(() => {
    setPrefsState(DEFAULT_PREFS);
    setSpans(DEFAULT_SPANS);
    try {
      localStorage.removeItem(PREFS_KEY);
    } catch {
      /* best effort */
    }
  }, []);

  const hideTile = useCallback(
    (id: string) => {
      updatePrefs((p) => (p.hidden.includes(id) ? p : { ...p, hidden: [...p.hidden, id] }));
    },
    [updatePrefs]
  );

  const showTile = useCallback(
    (id: string) => {
      updatePrefs((p) => ({ ...p, hidden: p.hidden.filter((x) => x !== id) }));
    },
    [updatePrefs]
  );

  const showAllTiles = useCallback(() => {
    updatePrefs((p) => ({ ...p, hidden: [] }));
  }, [updatePrefs]);

  const visibleTiles = useMemo(
    () => TILES.filter((t) => !prefs.hidden.includes(t.id)),
    [prefs.hidden]
  );

  /* --- hash routing (#board #calendar #notes #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "board");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#board");
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

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setSearch("");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K, Esc --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setActiveTile(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --- the tile span cycle: 1×1 → 2×1 → 2×2 → 1×2 → 1×1 --- */
  const cycleSpan = useCallback((id: string, dir: 1 | -1 = 1) => {
    setSpans((s) => {
      const cur = s[id] ?? "1x1";
      const i = SPAN_CYCLE.indexOf(cur);
      if (i < 0) return s;
      const next = SPAN_CYCLE[(i + dir + SPAN_CYCLE.length) % SPAN_CYCLE.length];
      return { ...s, [id]: next };
    });
    setActiveTile(id);
  }, []);

  const resetSpans = useCallback(() => {
    setSpans(DEFAULT_SPANS);
    setActiveTile(null);
  }, []);

  /* --- quick capture: a real append, never a mock --- */
  const addCapture = useCallback(() => {
    const text = captureDraft.trim();
    if (!text) {
      notify("Type something first — the tile is not a decoration");
      return;
    }
    /* the stamp is a pinned, counter-derived label, never a clock read */
    const at = `${pad(8 + Math.floor(captureSeq / 12))}:${pad(5 + ((captureSeq * 7) % 55))}`;
    setCaptureSeq((n) => n + 1);
    setCaptures((list) => [{ id: `cap-new-${captureSeq + 1}`, text, at, done: false }, ...list]);
    setCaptureDraft("");
    notify(`Captured “${text.length > 28 ? `${text.slice(0, 28)}…` : text}”`);
  }, [captureDraft, captureSeq, notify]);

  const toggleCapture = useCallback((id: string) => {
    setCaptures((list) => list.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }, []);

  const clearCaptures = useCallback(() => {
    setCaptures((list) => list.filter((x) => !x.done));
    notify("Cleared the finished captures");
  }, [notify]);

  const focusCapture = useCallback(() => {
    setView("board");
    setCaptureFocus((n) => n + 1);
    try {
      history.pushState(null, "", "#board");
    } catch {
      /* ignore */
    }
  }, []);

  /* --- habits toggle the ring live --- */
  const toggleHabit = useCallback((id: string) => {
    setHabits((list) => list.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  }, []);

  const habitsDone = useMemo(() => habits.filter((h) => h.done).length, [habits]);

  /* --- calendar --- */
  const selectDay = useCallback((dayIso: string) => setSelectedDay(dayIso), []);
  const shiftMonth = useCallback((delta: number) => setMonthOffset((n) => n + delta), []);

  /* --- notes --- */
  const selectNote = useCallback((id: string) => setNoteId(id), []);

  const visibleNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const editNote = useCallback((id: string, body: string) => {
    setNotes((list) => list.map((n) => (n.id === id ? { ...n, body } : n)));
  }, []);

  const addNote = useCallback(() => {
    const id = `n-new-${notes.length + 1}`;
    setNotes((list) => [
      { id, title: "Untitled note", body: "", stamp: "Just now", tag: "New" },
      ...list,
    ]);
    setNoteId(id);
    setSearch("");
    go("notes");
    notify("New note created");
  }, [go, notes.length, notify]);

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((list) => {
        const next = list.filter((n) => n.id !== id);
        if (id === noteId) setNoteId(next[0]?.id ?? "");
        return next;
      });
      notify("Note deleted");
    },
    [noteId, notify]
  );

  const value: FacetState = {
    view,
    go,
    spans,
    cycleSpan,
    resetSpans,
    activeTile,
    setActiveTile,
    prefs,
    setPrefs,
    resetPrefs,
    hideTile,
    showTile,
    showAllTiles,
    visibleTiles,
    captures,
    captureDraft,
    setCaptureDraft,
    addCapture,
    toggleCapture,
    clearCaptures,
    captureFocus,
    focusCapture,
    habits,
    toggleHabit,
    habitsDone,
    selectedDay,
    selectDay,
    monthOffset,
    shiftMonth,
    eventsFor: eventsForDay,
    notes,
    noteId,
    selectNote,
    search,
    setSearch,
    visibleNotes,
    editNote,
    addNote,
    deleteNote,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFacet(): FacetState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFacet must be used within <FacetProvider>");
  return ctx;
}
