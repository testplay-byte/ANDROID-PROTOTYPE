"use client";

/**
 * meridian / state — one context for the whole desktop app.
 *
 * Desktop state is genuinely different from a phone prototype: a view can be
 * open ALONGSIDE an inspector, rows can be multi-selected, a command palette
 * can be open over everything, and a density preference changes row heights
 * app-wide. All of it lives here so any component can read or drive it.
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
  PROJECTS,
  TASKS,
  type Project,
  type ProjectStatus,
  type Task,
  type TaskStatus,
} from "../data";

export type ViewId = "overview" | "projects" | "board" | "settings";
export type Density = "comfortable" | "compact";
export type SortKey = "name" | "owner" | "progress" | "budget";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "overview", label: "Overview", hint: "Portfolio health at a glance" },
  { id: "projects", label: "Projects", hint: "Sortable, filterable project table" },
  { id: "board", label: "Board", hint: "Task board by status" },
  { id: "settings", label: "Settings", hint: "Theme, density, shortcuts" },
];

interface MeridianState {
  view: ViewId;
  go: (v: ViewId) => void;
  density: Density;
  setDensity: (d: Density) => void;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: ProjectStatus | "all";
  setStatusFilter: (s: ProjectStatus | "all") => void;
  sort: { key: SortKey; dir: "asc" | "desc" };
  toggleSort: (key: SortKey) => void;
  selectedProject: string | null;
  selectProject: (id: string | null) => void;
  selectedTasks: string[];
  toggleTask: (id: string) => void;
  clearTasks: () => void;
  tasks: Task[];
  moveTask: (id: string, to: TaskStatus) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
  filteredProjects: Project[];
  counts: { total: number; atRisk: number; blocked: number; done: number };
}

const Ctx = createContext<MeridianState | null>(null);

const STATUS_ORDER: ProjectStatus[] = ["blocked", "at-risk", "on-track", "done"];

export function MeridianProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("overview");
  const [density, setDensityState] = useState<Density>("comfortable");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "progress",
    dir: "desc",
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(TASKS);

  /* --- persistence: density is app-wide, like every other preference --- */
  useEffect(() => {
    try {
      const d = localStorage.getItem("meridian-density");
      if (d === "compact" || d === "comfortable") setDensityState(d);
    } catch {}
  }, []);
  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem("meridian-density", d);
    } catch {}
  }, []);

  /* --- hash routing (#overview #projects #board #settings) --- */
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
    return () => window.removeEventListener("popstate", read);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setSelectedProject(null);
    setSearch("");
    setStatusFilter("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K command palette, Esc closes --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedProject(null);
        setSelectedTasks([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "progress" || key === "budget" ? "desc" : "asc" }
    );
  }, []);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = PROJECTS.filter(
      (p) =>
        (statusFilter === "all" || p.status === statusFilter) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.owner.toLowerCase().includes(q))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "owner":
          return a.owner.localeCompare(b.owner) * dir;
        case "progress":
          return (a.progress - b.progress) * dir;
        case "budget":
          return (a.budget - b.budget) * dir;
      }
    });
  }, [search, statusFilter, sort]);

  const counts = useMemo(
    () => ({
      total: PROJECTS.length,
      atRisk: PROJECTS.filter((p) => p.status === "at-risk").length,
      blocked: PROJECTS.filter((p) => p.status === "blocked").length,
      done: PROJECTS.filter((p) => p.status === "done").length,
    }),
    []
  );

  const value: MeridianState = {
    view,
    go,
    density,
    setDensity,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sort,
    toggleSort,
    selectedProject,
    selectProject: setSelectedProject,
    selectedTasks,
    toggleTask: (id) =>
      setSelectedTasks((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    clearTasks: () => setSelectedTasks([]),
    tasks,
    moveTask: (id, to) => {
      setTasks((list) => list.map((t) => (t.id === id ? { ...t, status: to } : t)));
      notify(`Task moved to ${to.replace("-", " ")}`);
    },
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    filteredProjects,
    counts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMeridian(): MeridianState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMeridian must be used within <MeridianProvider>");
  return ctx;
}
