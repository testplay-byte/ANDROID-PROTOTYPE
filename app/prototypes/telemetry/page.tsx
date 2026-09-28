"use client";

/**
 * telemetry / page — "Telemetry" infrastructure & operations console.
 *
 * The Carbon DESKTOP build, and the desktop sibling of the Carbon phone
 * prototype (pulse). Its shell follows app/prototypes/meridian — the repo's
 * reference desktop prototype — exactly:
 *
 *   DeviceThemeProvider (scoped to the SURFACE, not just .device)
 *     → TelemetryProvider
 *       → Stage (left/right info panels)
 *         → SurfaceFrame (surface="desktop", style="carbon", window chrome
 *                          + a menu bar) with:
 *              · DesktopSidebar  — sectioned navigation
 *              · DesktopTopBar   — title + ⌘K command field + actions
 *              · SurfaceScreen   — the active view
 *              · CommandPalette  (⌘K) and a toast
 *
 * The desktop patterns this screen exists to demonstrate, none of which a
 * phone has:
 *   - sidebar navigation with section headings, not a bottom bar
 *   - a dense multi-column sortable table with checkbox multi-select and a
 *     bulk action bar
 *   - a right-hand detail panel that opens BESIDE the data, never over it
 *   - a ⌘K / Ctrl+K command overlay
 *   - keyboard shortcuts (⌘K, Esc, /, 1–4)
 *   - a density preference that resizes every row app-wide
 *
 * There is deliberately NO status bar and NO bottom nav here: those are
 * phone-only chrome, and their absence is the point.
 */

import type { ReactNode } from "react";
import {
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Stage,
  SurfaceFrame,
  SurfaceScreen,
  DesktopSidebar,
  DesktopTopBar,
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { TelemetryProvider, VIEWS, useTelemetry } from "../../../src/prototypes/telemetry/state/telemetry-context";
import { CommandPalette } from "../../../src/prototypes/telemetry/components/command-palette";
import {
  AlertIcon,
  BellIcon,
  FleetIcon,
  RefreshIcon,
  SearchIcon,
  SlidersIcon,
  TrendIcon,
} from "../../../src/prototypes/telemetry/components/icons";
import { StatusSquare } from "../../../src/prototypes/telemetry/components/controls";
import { FleetScreen } from "../../../src/prototypes/telemetry/screens/fleet";
import { IncidentsScreen } from "../../../src/prototypes/telemetry/screens/incidents";
import { MetricsScreen } from "../../../src/prototypes/telemetry/screens/metrics";
import { SettingsScreen } from "../../../src/prototypes/telemetry/screens/settings";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "fleet", label: "Fleet", icon: <FleetIcon /> },
  { id: "incidents", label: "Incidents", icon: <AlertIcon /> },
  { id: "metrics", label: "Metrics", icon: <TrendIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  fleet: {
    name: "Fleet",
    desc: "The desktop data table: a five-cell status summary strip, square status tiles with 30-day uptime bars, a search + state-chip filter toolbar, sortable multi-column headers, checkbox multi-select with a bulk action bar, and a right-hand detail panel that opens beside the table.",
  },
  incidents: {
    name: "Incidents",
    desc: "The incident queue beside a pinned on-call rota. Rows carry bordered SEV and state tags, expand in place to show the event timeline, and run acknowledge → resolve; resolving repaints the affected service tile on the Fleet view in the same click.",
  },
  metrics: {
    name: "Metrics",
    desc: "CPU line, memory bars and p95 latency over a 1H / 6H / 12H / 24H segmented range that re-scales a deterministic 288-point master series. The peak of each window is drawn in IBM blue, with the SLO in the stat strip below every chart.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop preferences: theme scoped to the window, a real density toggle that resizes rows app-wide, a poll-interval stepper, notification switches whose OFF state is explicit in both themes, the keyboard reference and the demo-data actions.",
  },
};

function Shell() {
  const {
    view,
    go,
    density,
    setDensity,
    setPaletteOpen,
    toast,
    notify,
    counts,
    pollStamp,
    triggerPoll,
  } = useTelemetry();

  const navItems: DesktopNavItem[] = [
    { id: "sec-observe", label: "Observe", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ ...n })),
    { id: "sec-configure", label: "Configure", icon: <></>, kind: "section" },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];
  const health = counts.down > 0 ? "down" : counts.degraded > 0 ? "degraded" : "healthy";

  /* Section headings render as labels, never buttons, so this only ever sees
     a real view id — the guard is just belt and braces. */
  const onNavSelect = (id: string) => {
    const hit = VIEWS.find((v) => v.id === id);
    if (hit) go(hit.id);
  };

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Telemetry</PanelTitle>
          <PanelDesc>
            An IBM Carbon infrastructure and operations console — the style&apos;s native desktop
            habitat, and the desktop sibling of the Carbon phone prototype (Pulse). Flat layer
            grays, 1px borders, 0px radius, IBM blue on the primary actions only, tabular
            numerals on every figure that changes, and uppercase micro-labels throughout.
          </PanelDesc>
          <div className="tags">
            <span className="tag">IBM Carbon</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Built on the meridian desktop shell: sidebar + top bar + a detail panel that opens
              beside the data, never over it.
            </span>
          </PanelHead>
        </>
      }
      rightPanel={
        <>
          <PanelBadge>screen</PanelBadge>
          <PanelTitle>{current.name}</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            {VIEWS.map((v) => (
              <span className="tag" key={v.id}>
                {v.label}
              </span>
            ))}
          </div>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="carbon"
        theme="dark"
        windowChrome
        windowTitle="Telemetry — Operations Console"
        menu={["File", "Edit", "View", "Incident", "Window", "Help"]}
      >
        <DesktopSidebar items={navItems} activeId={view} onSelect={onNavSelect} />
        <div className="tel" data-density={density}>
          <DesktopTopBar
            title={current.name}
            subtitle="Telemetry · fleet operations"
            tools={
              <>
                <span className="tel-readout">
                  <span className="tel-readout__item">
                    <StatusSquare state={health} small />
                    <b className="tnum">{counts.total}</b> services
                  </span>
                  <span className="tel-readout__item">
                    <b className="tnum">{counts.open}</b> open
                  </span>
                </span>
                <button
                  type="button"
                  className="tel-cmd tel-cmd--wide"
                  onClick={() => setPaletteOpen(true)}
                >
                  <SearchIcon size={15} />
                  <span>Search or run a command…</span>
                  <span className="tel-kbd">⌘K</span>
                </button>
              </>
            }
            actions={
              <>
                <button
                  type="button"
                  className="tel-iconbtn"
                  aria-label="Poll the fleet now"
                  title={`Last poll ${pollStamp}`}
                  onClick={triggerPoll}
                >
                  <RefreshIcon size={16} />
                </button>
                <button
                  type="button"
                  className="tel-iconbtn"
                  aria-label={`${counts.open} open incidents`}
                  onClick={() => go("incidents")}
                >
                  <BellIcon />
                  {counts.open > 0 && <i className="tel-dot" />}
                </button>
                <button
                  type="button"
                  className="tel-density"
                  aria-label="Toggle row density"
                  title="Toggle row density — resizes every row in the app"
                  onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
                >
                  {density === "comfortable" ? "Comfortable" : "Compact"}
                </button>
                <span className="tel-avatar" aria-hidden="true">
                  AO
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "fleet" && <FleetScreen />}
            {view === "incidents" && <IncidentsScreen />}
            {view === "metrics" && <MetricsScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="tel-toast" data-kind={toast.kind} role="status">
              {toast.msg}
            </div>
          )}
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="telemetry-theme" initialTheme="dark">
      <TelemetryProvider>
        <Shell />
      </TelemetryProvider>
    </DeviceThemeProvider>
  );
}
