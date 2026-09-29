"use client";

/**
 * thin / state — one context for the whole minimal desktop app.
 *
 * Desktop state is not phone state: tasks are multi-selected while a bulk
 * action runs, a master–detail column pair is open, a ⌘K palette floats over
 * everything, and preferences (type scale, motion) restyle the entire window
 * at once. All of it lives here so any component can read or drive it.
 *
 * Determinism: nothing in here reads the clock or a random number. "Today" is
 * TODAY from data.ts, and generated ids come from a counter, so two loads of
 * the same URL produce the same screen.
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
import { PROJECTS, SEED_NOTES, TASKS, TODAY, onTodayList, type Project, type Task } from "../data";

export type ViewId = "today" | "projects" | "inbox" | "settings";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "today", label: "Today", hint: "One quiet list for the day, plus the note" },
  { id: "projects", label: "Projects", hint: "Master–detail: projects left, their work right" },
  { id: "inbox", label: "Inbox", hint: "Capture without deciding, then triage" },
  { id: "settings", label: "Settings", hint: "Theme, type scale, motion, shortcuts" },
];

/** The type-scale steps. Each one multiplies the whole app's type ramp. */
export const SCALES = [
  { id: "s", label: "Small", note: "fits the most on screen" },
  { id: "m", label: "Medium", note: "the default" },
  { id: "l", label: "Large", note: "easier to read at a desk" },
  { id: "xl", label: "Extra large", note: "the accessibility end" },
] as const;

export type ScaleId = (typeof SCALES)[number]["id"];

export interface Prefs {
  scale: ScaleId;
  /** false = the app never animates; every transition drops to 0ms */
  motion: boolean;
  /** the "show what is finished" switch on Today */
  showDone: boolean;
}

export const PREFS_KEY = "thin-prefs-v1";
export const NOTES_KEY = "thin-notes-v1";

export const DEFAULT_PREFS: Prefs = { scale: "m", motion: true, showDone: true };

/** "all" + one entry per project + the unfiled bucket. */
export type ProjectFilter = string;

interface ThinState {
  /* ---- navigation ---- */
  view: ViewId;
  go: (v: ViewId) => void;

  /* ---- data ---- */
  tasks: Task[];
  projects: Project[];

  /* ---- selection + bulk ---- */
  checked: string[];
  toggleChecked: (id: string) => void;
  setChecked: (ids: string[]) => void;
  clearChecked: () => void;
  toggleDone: (ids: string[]) => void;
  archive: (ids: string[]) => void;
  /** is any of the checked tasks currently open? drives the bulk bar */
  checkedHas: (field: "done" | "archived") => boolean;

  /* ---- Today ---- */
  filter: ProjectFilter;
  setFilter: (f: ProjectFilter) => void;
  todayTasks: Task[];
  todayTotal: number;
  note: string;
  setNote: (text: string) => void;
  noteSaved: boolean;

  /* ---- Projects (master–detail) ---- */
  projectId: string;
  selectProject: (id: string) => void;
  projectTasks: Task[];
  projectOpen: number;
  projectDone: number;
  addTask: (input: { title: string; projectId: string; day: string | null }) => void;
  /** captured by the shell's ⌘K / N shortcut so it can focus the field */
  captureTick: number;
  focusCapture: () => void;

  /* ---- Inbox triage ---- */
  inbox: Task[];
  triage: (id: string, to: { projectId?: string; day?: string | null; archive?: boolean }) => void;

  /* ---- preferences ---- */
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  resetAll: () => void;

  /* ---- chrome ---- */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<ThinState | null>(null);

const byOrder = (a: Task, b: Task) => a.order - b.order;

export function ThinProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("today");
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [checked, setChecked] = useState<string[]>([]);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [projectId, setProjectId] = useState<string>(PROJECTS[0].id);
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [notes, setNotes] = useState<Record<string, string>>(SEED_NOTES);
  const [noteSaved, setNoteSaved] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [captureTick, setCaptureTick] = useState(0);

  /* Ids come from a counter, never from the clock, so a capture made in one
     session cannot collide with a seeded id. */
  const seq = useRef(1);

  /* --- preferences hydrate (SSR-safe: read only after mount) --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Prefs>;
        setPrefsState({
          scale: SCALES.some((s) => s.id === p.scale) ? (p.scale as ScaleId) : DEFAULT_PREFS.scale,
          motion: typeof p.motion === "boolean" ? p.motion : DEFAULT_PREFS.motion,
          showDone: typeof p.showDone === "boolean" ? p.showDone : DEFAULT_PREFS.showDone,
        });
      }
    } catch {
      /* best effort */
    }
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        /* best effort */
      }
      return next;
    });
  }, []);

  /* --- hash routing (#today #projects #inbox #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "");
      setView(VIEWS.some((v) => v.id === h) ? (h as ViewId) : "today");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#today");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2400);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    /* navigation always starts clean — a stale selection from another view
       is worse than losing it, and the palette re-selects after calling go */
    setChecked([]);
    setFilter("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K and Esc --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setChecked([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --- selection + bulk ------------------------------------------------ */
  const toggleChecked = useCallback((id: string) => {
    setChecked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);

  const clearChecked = useCallback(() => setChecked([]), []);

  const patchTasks = useCallback(
    (ids: string[], patch: Partial<Task>, message: (n: number) => string) => {
      if (ids.length === 0) return;
      setTasks((list) => list.map((t) => (ids.includes(t.id) ? { ...t, ...patch } : t)));
      notify(message(ids.length));
    },
    [notify]
  );

  const toggleDone = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      /* one rule for the whole app: if everything ticked is already done,
         ticking means un-ticking. No second button, no menu. */
      setTasks((list) => {
        const allDone = list.filter((t) => ids.includes(t.id)).every((t) => t.done);
        return list.map((t) => (ids.includes(t.id) ? { ...t, done: !allDone } : t));
      });
      const allDone = tasks.filter((t) => ids.includes(t.id)).every((t) => t.done);
      notify(
        ids.length === 1
          ? allDone
            ? "Task reopened"
            : "Task done"
          : allDone
            ? `${ids.length} tasks reopened`
            : `${ids.length} tasks done`
      );
    },
    [notify, tasks]
  );

  const archive = useCallback(
    (ids: string[]) => patchTasks(ids, { archived: true }, (n) => (n === 1 ? "Archived" : `${n} archived`)),
    [patchTasks]
  );

  const checkedHas = useCallback(
    (field: "done" | "archived") =>
      tasks.some((t) => checked.includes(t.id) && t[field]),
    [checked, tasks]
  );

  /* --- capture + add ---------------------------------------------------- */
  const addTask = useCallback(
    (input: { title: string; projectId: string; day: string | null }) => {
      const title = input.title.trim();
      if (!title) return;
      const id = `t-new-${seq.current + 1}`;
      seq.current += 1;
      /* a captured task PREPENDS: the newest order is the most negative, so
         it lands at the top of the list it was captured into */
      const order = -seq.current;
      setTasks((list) => [
        ...list,
        {
          id,
          title,
          projectId: input.projectId || null,
          day: input.day,
          done: false,
          archived: false,
          est: 15,
          order,
        },
      ]);
      notify(`Added “${title}”`);
    },
    [notify]
  );

  const focusCapture = useCallback(() => {
    setView("inbox");
    setCaptureTick((n) => n + 1);
    try {
      history.pushState(null, "", "#inbox");
    } catch {
      /* ignore */
    }
  }, []);

  /* --- inbox triage ----------------------------------------------------- */
  const triage = useCallback(
    (id: string, to: { projectId?: string; day?: string | null; archive?: boolean }) => {
      setTasks((list) => list.map((t) => (t.id === id ? { ...t, ...to } : t)));
      if (to.projectId) {
        const p = PROJECTS.find((x) => x.id === to.projectId);
        notify(`Filed to ${p?.name ?? "a project"}`);
      } else if (to.archive) {
        notify("Archived");
      } else {
        notify(to.day ? "Scheduled for today" : "Moved on");
      }
    },
    [notify]
  );

  /* --- the daily note: saved on every keystroke, no save button -------- */
  const setNote = useCallback((text: string) => {
    setNotes((n) => {
      const next = { ...n, [TODAY]: text };
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      } catch {
        /* best effort */
      }
      return next;
    });
    setNoteSaved(false);
    window.setTimeout(() => setNoteSaved(true), 400);
  }, []);

  const resetAll = useCallback(() => {
    setTasks(TASKS);
    setNotes(SEED_NOTES);
    setPrefsState(DEFAULT_PREFS);
    setChecked([]);
    try {
      localStorage.removeItem(PREFS_KEY);
      localStorage.removeItem(NOTES_KEY);
    } catch {
      /* best effort */
    }
    notify("Demo data and preferences restored");
  }, [notify]);

  /* --- derived ---------------------------------------------------------- */
  const todayTasks = useMemo(() => {
    const list = tasks.filter((t) => {
      if (!onTodayList(t)) return false;
      if (filter === "all") return true;
      if (filter === "inbox") return t.projectId === null;
      return t.projectId === filter;
    });
    /* undone first, overdue first inside that, then the manual order */
    return list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return byOrder(a, b);
    });
  }, [filter, tasks]);

  const todayTotal = useMemo(() => tasks.filter((t) => !t.archived && t.day === TODAY).length, [tasks]);

  const inbox = useMemo(
    () => tasks.filter((t) => !t.archived && t.projectId === null && t.day === null).sort(byOrder),
    [tasks]
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => !t.archived && t.projectId === projectId).sort(byOrder),
    [projectId, tasks]
  );

  const projectOpen = useMemo(() => projectTasks.filter((t) => !t.done).length, [projectTasks]);
  const projectDone = useMemo(() => projectTasks.length - projectOpen, [projectTasks]);

  const value: ThinState = {
    view,
    go,
    tasks,
    projects: PROJECTS,
    checked,
    toggleChecked,
    setChecked: setChecked,
    clearChecked,
    toggleDone,
    archive,
    checkedHas,
    filter,
    setFilter,
    todayTasks,
    todayTotal,
    note: notes[TODAY] ?? "",
    setNote,
    noteSaved,
    projectId,
    selectProject: setProjectId,
    projectTasks,
    projectOpen,
    projectDone,
    addTask,
    captureTick,
    focusCapture,
    inbox,
    triage,
    prefs,
    setPrefs,
    resetAll,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useThin(): ThinState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useThin must be used within <ThinProvider>");
  return ctx;
}
