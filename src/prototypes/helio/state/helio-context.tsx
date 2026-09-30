"use client";

/**
 * helio / state — one context for the whole console.
 *
 * Desktop state, per SPEC §8.6: the view, the selected site, the site
 * filter, the live/paused toggle and the density all live here so any view
 * can read or drive them. Only the density preference persists.
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

export type ViewId = "overview" | "analytics" | "insights" | "sites" | "tracker";
export type Density = "comfortable" | "compact";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "overview", label: "Overview", hint: "Portfolio at a glance — the full grid" },
  { id: "analytics", label: "Analytics", hint: "Load bands, mix and weekly output" },
  { id: "insights", label: "Insights", hint: "Heat map, tree map, radar, radial bars and gauge" },
  { id: "sites", label: "Sites", hint: "Every site, sortable, with status" },
  { id: "tracker", label: "Live", hint: "A live day: frequency, output, alerts" },
];

interface HelioState {
  view: ViewId;
  go: (v: ViewId) => void;
  density: Density;
  setDensity: (d: Density) => void;
  siteId: string | null;
  selectSite: (id: string | null) => void;
  query: string;
  setQuery: (q: string) => void;
  live: boolean;
  toggleLive: () => void;
  toast: string | null;
  notify: (m: string) => void;
}

const Ctx = createContext<HelioState | null>(null);
const ORDER: ViewId[] = ["overview", "analytics", "insights", "sites", "tracker"];

export function HelioProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("overview");
  const [density, setDensityState] = useState<Density>("comfortable");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const d = localStorage.getItem("helio-density");
      if (d === "compact" || d === "comfortable") setDensityState(d);
    } catch {}
  }, []);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem("helio-density", d);
    } catch {}
  }, []);

  /* hash routing, deep-linkable like every other prototype */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      if (ORDER.includes(h)) setView(h);
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#overview");
      } catch {
        /* sandbox */
      }
    }
    read();
    // popstate covers back/forward; hashchange covers editing the hash or a
    // same-document link to another view (the two are different events).
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const value = useMemo<HelioState>(
    () => ({
      view,
      go,
      density,
      setDensity,
      siteId,
      selectSite: setSiteId,
      query,
      setQuery,
      live,
      toggleLive: () => setLive((l) => !l),
      toast,
      notify,
    }),
    [view, go, density, setDensity, siteId, query, live, toast, notify]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHelio(): HelioState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHelio must be used within <HelioProvider>");
  return ctx;
}
