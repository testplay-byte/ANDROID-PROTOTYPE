"use client";

/**
 * pulse / page — "Pulse" system-status dashboard (IBM Carbon).
 *
 * Shell:
 *   DeviceThemeProvider (pulse-theme, dark default, scoped to .device) →
 *   PulseProvider → Stage (side panels) → DeviceFrame (style="carbon")
 *     .plu — custom product header (brand · status pill · avatar),
 *            Carbon tab strip at the bottom (2px blue indicator),
 *            hash-routed views (#overview #incidents #metrics #settings),
 *            toast. Swipe left/right navigates the tabs.
 *
 * Chrome is deliberately NOT the standard large-title + floating pill:
 * a 48px flat header with a live status pill and an indicator tab strip,
 * in Carbon's outlined, productive language.
 */

import { useEffect, useState, type ReactNode } from "react";
import {
  DeviceFrame,
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Screen,
  Stage,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { PulseProvider, usePulse } from "../../../src/prototypes/pulse/state/pulse-context";
import { AppHeader } from "../../../src/prototypes/pulse/components/app-header";
import { Toast } from "../../../src/prototypes/pulse/components/toast";
import { AlertIcon, GridIcon, PulseIcon, SlidersIcon } from "../../../src/prototypes/pulse/components/icons";
import { OverviewScreen } from "../../../src/prototypes/pulse/screens/overview-screen";
import { IncidentsScreen } from "../../../src/prototypes/pulse/screens/incidents-screen";
import { MetricsScreen } from "../../../src/prototypes/pulse/screens/metrics-screen";
import { SettingsScreen } from "../../../src/prototypes/pulse/screens/settings-screen";

type ViewId = "overview" | "incidents" | "metrics" | "settings";
const ORDER: ViewId[] = ["overview", "incidents", "metrics", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "overview";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  overview: {
    name: "Overview",
    desc: "Active-incident banner, fleet health ring with counters, a dense 2-column status grid of 12 services (square green/amber/red tiles + 30-day uptime) and a sortable Carbon data table of the top services with response-time sparklines.",
  },
  incidents: {
    name: "Incidents",
    desc: "Severity filter chips over the incident queue: bordered uppercase SEV tags and state tags, tap to expand the event timeline, acknowledge / resolve / reopen flow — resolving turns the affected service squares green on Overview.",
  },
  metrics: {
    name: "Metrics",
    desc: "CPU line, memory bar and p95-latency charts over a 1H/6H/12H/24H segmented range that re-scales deterministic seeded data — peak highlighted in IBM blue, current/peak/avg/SLO stat triple per chart.",
  },
  settings: {
    name: "Settings",
    desc: "Dark/Light theme (persisted pulse-theme), refresh-interval stepper (5–120s), notification switches, and a real Carbon density toggle (Comfortable/Compact) that resizes rows app-wide. Incident-state reset included.",
  },
};

const TABS: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <GridIcon size={18} /> },
  { id: "incidents", label: "Incidents", icon: <AlertIcon size={18} /> },
  { id: "metrics", label: "Metrics", icon: <PulseIcon size={18} /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon size={18} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("overview");
  const { counts, services, prefs } = usePulse();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#overview");
      } catch {
        /* sandbox may block hash writes */
      }
    } else {
      setView(readHashView());
    }
    const onPop = () => setView(readHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(v: ViewId) {
    if (v === view) return;
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
    setView(v);
  }

  /* swipe navigation (proto-kit) */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = ORDER.indexOf(view);
      if (idx >= 0 && idx < ORDER.length - 1) go(ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = ORDER.indexOf(view);
      if (idx > 0) go(ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];
  const okCount = services.length - counts.down - counts.degraded;

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Pulse</PanelTitle>
          <PanelDesc>
            An IBM Carbon system-status dashboard — the style&apos;s native
            enterprise habitat. Flat layer grays, 1px borders, 0px radius,
            live status pill in a custom product header, tabular-nums
            everywhere, incident ack/resolve flow that recovers service
            squares, deterministic seeded charts and a real Carbon density
            toggle.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Carbon</span>
            <span className="tag">Monitoring</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Incident flow</span>
          </div>
        </>
      }
      rightPanel={
        <>
          <PanelHead>Screen info</PanelHead>
          <div className="screeninfo">
            <span className="screeninfo__name">{info.name}</span>
            <span className="screeninfo__desc">{info.desc}</span>
          </div>

          <PanelHead>Fleet</PanelHead>
          <div className="mini-bars">
            <MiniBar label="Healthy" num={String(okCount)} width={`${Math.round((okCount / services.length) * 100)}%`} color="var(--color-tertiary)" />
            <MiniBar label="Degraded" num={String(counts.degraded)} width={`${Math.min(counts.degraded * 30, 100)}%`} color="#f1c21b" />
            <MiniBar label="Down" num={String(counts.down)} width={`${Math.min(counts.down * 34, 100)}%`} color="#fa4d56" />
            <MiniBar label="Incidents" num={String(counts.open)} width={`${Math.min(counts.open * 26, 100)}%`} color="#0f62fe" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>IBM Carbon</b>
            </div>
            <div className="kvlist__row">
              <span>Probe cadence</span>
              <b>{prefs.refreshSec}s</b>
            </div>
            <div className="kvlist__row">
              <span>Density</span>
              <b>{prefs.density}</b>
            </div>
            <div className="kvlist__row">
              <span>Shadows</span>
              <b>none</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="carbon">
        <Screen>
          <div className={`plu ${prefs.density === "compact" ? "plu-compact" : ""}`}>
            <AppHeader />
            <div className="plu-body" key={view}>
              {view === "overview" && <OverviewScreen onGoIncidents={() => go("incidents")} />}
              {view === "incidents" && <IncidentsScreen />}
              {view === "metrics" && <MetricsScreen />}
              {view === "settings" && <SettingsScreen />}
            </div>

            <nav className="plu-tabs" aria-label="Primary">
              {TABS.map((t) => {
                const active = t.id === view;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`plu-tabs__item ${active ? "plu-tabs__item--active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => go(t.id)}
                  >
                    {t.icon}
                    <span className="plu-tabs__label">{t.label}</span>
                    {t.id === "incidents" && counts.open > 0 ? (
                      <span className="plu-tabs__dot" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <Toast />
          </div>
        </Screen>
      </DeviceFrame>
    </Stage>
  );
}

/** Small helper — one metric row for the right panel. */
function MiniBar({ label, num, width, color }: { label: string; num: string; width: string; color: string }) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">{num}</span>
    </div>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="pulse-theme" initialTheme="dark">
      <PulseProvider>
        <Shell />
      </PulseProvider>
    </DeviceThemeProvider>
  );
}
