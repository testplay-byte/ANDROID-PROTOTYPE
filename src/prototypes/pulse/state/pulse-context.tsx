"use client";

/* pulse-context — central client state for Pulse:
   - incidents: acks (acknowledged ids) + resolved ids (persisted
     `pulse-acks-v1` / `pulse-resolved-v1`) — drive service status squares
   - prefs: theme mirror (`pulse-theme`, authoritative copy is
     DeviceThemeProvider), refresh interval, notification toggles, table
     density (persisted `pulse-prefs-v1`)
   - derived: per-service status + counters (down / degraded / open)
   - toast (Carbon inline notification style) */

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
  DEFAULT_ACKS,
  DEFAULT_RESOLVED,
  INCIDENTS,
  SERVICES,
  incidentStateOf,
  serviceStatusOf,
  type Incident,
  type Service,
  type ServiceState,
} from "../lib/data";

export type Density = "comfortable" | "compact";

export interface PulsePrefs {
  /** Seconds between simulated status refreshes. */
  refreshSec: number;
  notifySev1: boolean;
  notifySev2: boolean;
  notifyWeekly: boolean;
  density: Density;
}

const DEFAULT_PREFS: PulsePrefs = {
  refreshSec: 30,
  notifySev1: true,
  notifySev2: true,
  notifyWeekly: false,
  density: "comfortable",
};

const PREFS_KEY = "pulse-prefs-v1";
const ACKS_KEY = "pulse-acks-v1";
const RESOLVED_KEY = "pulse-resolved-v1";

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

export interface ServiceStatus extends Service {
  state: ServiceState;
}

interface Toast {
  msg: string;
  kind: "success" | "info" | "warning";
}

interface PulseContextValue {
  services: ServiceStatus[];
  incidents: Incident[];
  acks: string[];
  resolved: string[];
  acknowledge: (id: string) => void;
  resolve: (id: string) => void;
  reopen: (id: string) => void;
  /** Restore the seeded ack/resolve state (Settings → reset). */
  resetIncidents: () => void;
  /** Incremented on every "refresh" — drives the Last updated stamp pulse. */
  refreshTick: number;
  triggerRefresh: () => void;

  counts: { down: number; degraded: number; open: number };
  health: ServiceState;

  prefs: PulsePrefs;
  setPrefs: (p: Partial<PulsePrefs>) => void;

  toast: Toast | null;
  showToast: (msg: string, kind?: Toast["kind"]) => void;
}

const PulseContext = createContext<PulseContextValue | null>(null);

export function PulseProvider({ children }: { children: ReactNode }) {
  const [acks, setAcks] = useState<string[]>(DEFAULT_ACKS);
  const [resolved, setResolved] = useState<string[]>(DEFAULT_RESOLVED);
  const [prefs, setPrefsState] = useState<PulsePrefs>(DEFAULT_PREFS);
  const [refreshTick, setRefreshTick] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const p = loadJson<PulsePrefs>(PREFS_KEY);
    if (p) setPrefsState((prev) => ({ ...prev, ...p }));
    const a = loadJson<string[]>(ACKS_KEY);
    if (a && Array.isArray(a)) setAcks(a);
    const r = loadJson<string[]>(RESOLVED_KEY);
    if (r && Array.isArray(r)) setResolved(r);
  }, []);

  const showToast = useCallback((msg: string, kind: Toast["kind"] = "info") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2600);
  }, []);

  const acknowledge = useCallback(
    (id: string) => {
      setAcks((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveJson(ACKS_KEY, next);
        return next;
      });
      const inc = INCIDENTS.find((i) => i.id === id);
      showToast(`${id} acknowledged${inc ? ` — ${inc.title.split(" ").slice(0, 4).join(" ")}…` : ""}`, "info");
    },
    [showToast]
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
      showToast(`${id} resolved — services recovered`, "success");
    },
    [showToast]
  );

  const reopen = useCallback(
    (id: string) => {
      setResolved((prev) => {
        const next = prev.filter((r) => r !== id);
        saveJson(RESOLVED_KEY, next);
        return next;
      });
      showToast(`${id} reopened`, "warning");
    },
    [showToast]
  );

  const triggerRefresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
    showToast("Status refreshed", "info");
  }, [showToast]);

  const resetIncidents = useCallback(() => {
    setAcks(DEFAULT_ACKS);
    setResolved(DEFAULT_RESOLVED);
    saveJson(ACKS_KEY, DEFAULT_ACKS);
    saveJson(RESOLVED_KEY, DEFAULT_RESOLVED);
    showToast("Incident state reset to defaults", "info");
  }, [showToast]);

  const setPrefs = useCallback((p: Partial<PulsePrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  const services = useMemo<ServiceStatus[]>(
    () =>
      SERVICES.map((s) => ({
        ...s,
        state: serviceStatusOf(s, INCIDENTS, acks, resolved),
      })),
    [acks, resolved]
  );

  const counts = useMemo(() => {
    let down = 0;
    let degraded = 0;
    for (const s of services) {
      if (s.state === "down") down++;
      else if (s.state === "degraded") degraded++;
    }
    const open = INCIDENTS.filter((i) => incidentStateOf(i, acks, resolved) !== "resolved").length;
    return { down, degraded, open };
  }, [services, acks, resolved]);

  const health: ServiceState =
    counts.down > 0 ? "down" : counts.degraded > 0 ? "degraded" : "operational";

  /* simulated refresh ticker — cadence from prefs, re-stamps "Last updated" */
  useEffect(() => {
    const id = window.setInterval(() => setRefreshTick((t) => t + 1), prefs.refreshSec * 1000);
    return () => window.clearInterval(id);
  }, [prefs.refreshSec]);

  const value: PulseContextValue = {
    services,
    incidents: INCIDENTS,
    acks,
    resolved,
    acknowledge,
    resolve,
    reopen,
    resetIncidents,
    refreshTick,
    triggerRefresh,
    counts,
    health,
    prefs,
    setPrefs,
    toast,
    showToast,
  };

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse(): PulseContextValue {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used within <PulseProvider>");
  return ctx;
}
