"use client";

/**
 * telemetry / state — one context for the whole desktop console.
 *
 * Desktop state is genuinely different from a phone prototype: the view is
 * hash-routed and deep-linkable, a right-hand panel opens BESIDE the data,
 * table rows can be multi-selected for a bulk action bar, a ⌘K command
 * surface floats over everything, and a density preference resizes every row
 * app-wide. All of it lives here so any screen or component can read or drive
 * it — in particular the incident ack/resolve flow has to be visible on the
 * Fleet view, which means the two screens read ONE state object.
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
  DEFAULT_ACKS,
  DEFAULT_RESOLVED,
  INCIDENTS,
  SERVICES,
  effectiveP50,
  incidentStateOf,
  pollStamp,
  serviceById,
  serviceStateOf,
  sparkline,
  uptimeBars,
  type Incident,
  type Service,
  type ServiceState,
} from "../data";

export type ViewId = "fleet" | "incidents" | "metrics" | "settings";
export type Density = "comfortable" | "compact";
export type StatusFilter = ServiceState | "all";
export type SortKey = "name" | "tier" | "state" | "p50" | "errorRate" | "uptime";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "fleet", label: "Fleet", hint: "Sortable, filterable service table" },
  { id: "incidents", label: "Incidents", hint: "Acknowledge → resolve queue" },
  { id: "metrics", label: "Metrics", hint: "CPU, memory, p95 over a range" },
  { id: "settings", label: "Settings", hint: "Theme, density, polling, alerts" },
];

export interface TelemetryPrefs {
  /** Seconds between simulated status polls. */
  pollSec: number;
  notifySev1: boolean;
  notifySev2: boolean;
  notifyWeekly: boolean;
  density: Density;
}

const DEFAULT_PREFS: TelemetryPrefs = {
  pollSec: 30,
  notifySev1: true,
  notifySev2: true,
  notifyWeekly: false,
  density: "comfortable",
};

const PREFS_KEY = "telemetry-prefs-v1";
const ACKS_KEY = "telemetry-acks-v1";
const RESOLVED_KEY = "telemetry-resolved-v1";

function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
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

/** A service with its live state, the derived numbers and its 30-day bars. */
export interface ServiceRow extends Service {
  state: ServiceState;
  /** p50 inflated by the current load state. */
  liveP50: number;
  /** 20-point request-rate sparkline. */
  load: number[];
  /** 30 daily uptime percentages, oldest first. */
  bars: number[];
}

interface Toast {
  msg: string;
  kind: "info" | "success" | "warning";
}

interface TelemetryState {
  view: ViewId;
  go: (v: ViewId) => void;
  /** Jump to Fleet and open a service in the side panel. */
  inspect: (serviceId: string) => void;

  density: Density;
  setDensity: (d: Density) => void;
  prefs: TelemetryPrefs;
  setPrefs: (p: Partial<TelemetryPrefs>) => void;

  services: ServiceRow[];
  counts: { total: number; healthy: number; degraded: number; down: number; open: number };

  search: string;
  setSearch: (s: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (s: StatusFilter) => void;
  sort: { key: SortKey; dir: "asc" | "desc" };
  toggleSort: (key: SortKey) => void;
  filtered: ServiceRow[];

  /** Multi-select for the bulk action bar. */
  checked: string[];
  toggleChecked: (id: string) => void;
  clearChecked: () => void;
  allVisibleChecked: boolean;

  /** Right-hand panel, beside the data — never over it. */
  selectedService: string | null;
  selectService: (id: string | null) => void;

  incidents: Incident[];
  acks: string[];
  resolved: string[];
  acknowledge: (id: string) => void;
  resolve: (id: string) => void;
  reopen: (id: string) => void;
  resetIncidents: () => void;
  stateOf: (id: string) => ServiceState;

  pollTick: number;
  pollStamp: string;
  triggerPoll: () => void;

  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: Toast | null;
  notify: (msg: string, kind?: Toast["kind"]) => void;
}

const Ctx = createContext<TelemetryState | null>(null);

const STATE_RANK: Record<ServiceState, number> = { down: 0, degraded: 1, healthy: 2 };

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("fleet");
  const [prefs, setPrefsState] = useState<TelemetryPrefs>(DEFAULT_PREFS);
  const [acks, setAcks] = useState<string[]>(DEFAULT_ACKS);
  const [resolved, setResolved] = useState<string[]>(DEFAULT_RESOLVED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "state",
    dir: "asc",
  });
  const [checked, setChecked] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pollTick, setPollTick] = useState(0);

  /* --- persistence (hydrated after mount, SSR-safe) --- */
  useEffect(() => {
    const p = loadJson<TelemetryPrefs>(PREFS_KEY);
    if (p) setPrefsState((prev) => ({ ...prev, ...p }));
    const a = loadJson<string[]>(ACKS_KEY);
    if (Array.isArray(a)) setAcks(a);
    const r = loadJson<string[]>(RESOLVED_KEY);
    if (Array.isArray(r)) setResolved(r);
  }, []);

  const notify = useCallback((msg: string, kind: Toast["kind"] = "info") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  const setPrefs = useCallback((p: Partial<TelemetryPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  const setDensity = useCallback(
    (d: Density) => setPrefs({ density: d }),
    [setPrefs]
  );

  /* --- hash routing: #fleet #incidents #metrics #settings --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "fleet");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#fleet");
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
    setSearch("");
    setStatusFilter("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  const inspect = useCallback((serviceId: string) => {
    setView("fleet");
    setSelectedService(serviceId);
    try {
      history.pushState(null, "", "#fleet");
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K palette, Esc unwinds one level --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (selectedService) setSelectedService(null);
        else if (checked.length) setChecked([]);
        return;
      }
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) return;
      if (e.key === "/") {
        e.preventDefault();
        setView("fleet");
        window.setTimeout(() => document.querySelector<HTMLInputElement>(".tel-search input")?.focus(), 60);
      }
      if (/^[1-4]$/.test(e.key)) {
        setView(VIEWS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, selectedService, checked.length]);

  /* --- derived service rows --- */
  const services = useMemo<ServiceRow[]>(
    () =>
      SERVICES.map((s, i) => {
        const state = serviceStateOf(s, INCIDENTS, acks, resolved);
        return {
          ...s,
          state,
          liveP50: effectiveP50(s, state),
          load: sparkline(i, state),
          bars: uptimeBars(i, state),
        };
      }),
    [acks, resolved]
  );

  const counts = useMemo(() => {
    let healthy = 0;
    let degraded = 0;
    let down = 0;
    for (const s of services) {
      if (s.state === "down") down++;
      else if (s.state === "degraded") degraded++;
      else healthy++;
    }
    const open = INCIDENTS.filter((i) => incidentStateOf(i, acks, resolved) !== "resolved").length;
    return { total: services.length, healthy, degraded, down, open };
  }, [services, acks, resolved]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = services.filter(
      (s) =>
        (statusFilter === "all" || s.state === statusFilter) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.tier.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q) ||
          s.team.toLowerCase().includes(q))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "tier":
          return (a.tier.localeCompare(b.tier) || a.name.localeCompare(b.name)) * dir;
        case "state":
          return (STATE_RANK[a.state] - STATE_RANK[b.state] || a.name.localeCompare(b.name)) * dir;
        case "p50":
          return (a.liveP50 - b.liveP50) * dir;
        case "errorRate":
          return (a.errorRate - b.errorRate) * dir;
        case "uptime":
          return (a.uptime - b.uptime) * dir;
      }
    });
  }, [services, search, statusFilter, sort]);

  const toggleSort = useCallback((key: SortKey) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : // worst-first is the useful default for every numeric ops column
          { key, dir: key === "name" || key === "tier" ? "asc" : "desc" }
    );
  }, []);

  const allVisibleChecked = filtered.length > 0 && filtered.every((s) => checked.includes(s.id));

  const stateOf = useCallback(
    (id: string) => {
      const svc = serviceById(id);
      return svc ? serviceStateOf(svc, INCIDENTS, acks, resolved) : "healthy";
    },
    [acks, resolved]
  );

  /* --- incident flow; resolving one repaints the Fleet tiles --- */
  const acknowledge = useCallback(
    (id: string) => {
      setAcks((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveJson(ACKS_KEY, next);
        return next;
      });
      notify(`${id} acknowledged — commander assigned`, "info");
    },
    [notify]
  );

  const resolve = useCallback(
    (id: string) => {
      setAcks((prev) => {
        const next = prev.filter((a) => a !== id);
        saveJson(ACKS_KEY, next);
        return next;
      });
      setResolved((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveJson(RESOLVED_KEY, next);
        return next;
      });
      const inc = INCIDENTS.find((i) => i.id === id);
      const svc = inc ? serviceById(inc.serviceId) : undefined;
      notify(`${id} resolved — ${svc ? `${svc.name} back to healthy` : "service recovered"}`, "success");
    },
    [notify]
  );

  const reopen = useCallback(
    (id: string) => {
      setResolved((prev) => {
        const next = prev.filter((r) => r !== id);
        saveJson(RESOLVED_KEY, next);
        return next;
      });
      notify(`${id} reopened`, "warning");
    },
    [notify]
  );

  const resetIncidents = useCallback(() => {
    setAcks(DEFAULT_ACKS);
    setResolved(DEFAULT_RESOLVED);
    saveJson(ACKS_KEY, DEFAULT_ACKS);
    saveJson(RESOLVED_KEY, DEFAULT_RESOLVED);
    notify("Incident state reset to the seeded demo", "info");
  }, [notify]);

  /* --- simulated poll ticker; the stamp is derived, never Date.now() --- */
  const triggerPoll = useCallback(() => {
    setPollTick((t) => t + 1);
    notify("Fleet polled — 12 services reporting", "info");
  }, [notify]);

  useEffect(() => {
    const id = window.setInterval(() => setPollTick((t) => t + 1), prefs.pollSec * 1000);
    return () => window.clearInterval(id);
  }, [prefs.pollSec]);

  const value: TelemetryState = {
    view,
    go,
    inspect,
    density: prefs.density,
    setDensity,
    prefs,
    setPrefs,
    services,
    counts,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sort,
    toggleSort,
    filtered,
    checked,
    toggleChecked: (id) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])),
    clearChecked: () => setChecked([]),
    allVisibleChecked,
    selectedService,
    selectService: setSelectedService,
    incidents: INCIDENTS,
    acks,
    resolved,
    acknowledge,
    resolve,
    reopen,
    resetIncidents,
    stateOf,
    pollTick,
    pollStamp: pollStamp(pollTick, prefs.pollSec),
    triggerPoll,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTelemetry(): TelemetryState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTelemetry must be used within <TelemetryProvider>");
  return ctx;
}
