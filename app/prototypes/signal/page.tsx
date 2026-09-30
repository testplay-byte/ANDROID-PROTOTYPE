"use client";

/**
 * signal / page — "Signal" product analytics console.
 *
 * THE FLAGSHIP DESKTOP BUILD OF MATERIAL 3 — the data-dense app in the
 * repo's default language.
 *
 * Shell (identical in structure to meridian, the reference desktop shell):
 *   DeviceThemeProvider (signal-theme, scoped to the SURFACE) → SignalProvider
 *   → Stage (preview panels, surface switcher, fullscreen — all OUTSIDE the
 *   app) → SurfaceFrame (surface="desktop", style="m3", windowChrome,
 *   menu bar, draggable, storageKey="signal") with:
 *     · DesktopSidebar — sectioned navigation
 *     · DesktopTopBar  — title + ⌘K search slot + actions
 *     · a global SEGMENT BAR (platform / plan / range) below the top bar
 *     · the active view, hash-routed and deep-linkable
 *     · CommandPalette (⌘K) and a toast
 *
 * The difference from a phone prototype is structural, not cosmetic: a
 * sidebar, a 12-column panel grid, charts that size to their container via
 * viewBox, a detail inspector that opens BESIDE the table, and a palette.
 *
 * Nothing in here names a colour — `style="m3"` supplies the inks, and
 * the charts only ever reference `--chart-series-1…5`, `--chart-grid` and
 * `--chart-axis`.
 */

import { useEffect, type ReactNode } from "react";
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
  useCanonicalSurface,
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { SignalProvider, VIEWS, useSignal, type ViewId } from "../../../src/prototypes/signal/state/signal-context";
import { CommandPalette } from "../../../src/prototypes/signal/components/command-palette";
import {
  BellIcon,
  DownloadIcon,
  FilterIcon,
  FunnelIcon,
  GaugeIcon,
  GridIcon,
  SearchIcon,
  SlidersIcon,
  TableIcon,
  RadarIcon,
} from "../../../src/prototypes/signal/components/icons";
import { OverviewScreen } from "../../../src/prototypes/signal/screens/overview";
import { FunnelScreen } from "../../../src/prototypes/signal/screens/funnel";
import { InsightsScreen } from "../../../src/prototypes/signal/screens/insights";
import { RetentionScreen } from "../../../src/prototypes/signal/screens/retention";
import { ExploreScreen } from "../../../src/prototypes/signal/screens/explore";
import { SettingsScreen } from "../../../src/prototypes/signal/screens/settings";
import { PLATFORMS, PLANS, RANGES } from "../../../src/prototypes/signal/data";

const NAV: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <GaugeIcon /> },
  { id: "insights", label: "Insights", icon: <RadarIcon /> },
  { id: "funnel", label: "Funnel", icon: <FunnelIcon /> },
  { id: "retention", label: "Retention", icon: <GridIcon /> },
  { id: "explore", label: "Explore", icon: <TableIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  overview: {
    name: "Overview",
    desc: "The flagship screen: a five-card KPI row with deltas and sparklines, a large time series with a dashed comparison series and a drag-to-brush window, a stacked column chart, a revenue ring and a live activity feed. The range selector genuinely re-scales every number.",
  },
  insights: {
    name: "Insights",
    desc: "The visual vocabulary: an engagement heat map (when people are active), a revenue tree map (where it comes from), a balance radar, radial lifecycle bars and an activation gauge, plus sparklines — all drawn from the shared chart library in proto-kit.",
  },
  funnel: {
    name: "Funnel",
    desc: "A real activation funnel: step-to-step conversion, the drop called out between every step, and a segment breakdown recomputed per platform beside it. Under 900px the CSS swaps in a genuinely horizontal chart.",
  },
  retention: {
    name: "Retention",
    desc: "Weekly cohorts down, weeks across, one hoverable SVG cell each, tinted on a six-step ramp built from --chart-series-1. The retention curve beside it is the same data as lines.",
  },
  explore: {
    name: "Explore",
    desc: "The desktop data table: search, category chips, six sortable columns, checkbox multi-select with a bulk bar, an in-row sparkline column, and a row inspector that opens BESIDE the table.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop settings: theme, row density, a reduce-motion switch that really stops the chart animations, the keyboard reference and the chart-ink legend.",
  },
};

function Shell() {
  const currentSurface = useCanonicalSurface("signal");
  const {
    view,
    go,
    setPaletteOpen,
    toast,
    notify,
    range,
    setRange,
    cycleRange,
    platform,
    setPlatform,
    plan,
    setPlan,
    resetSegments,
    segmentsDirty,
    density,
    setDensity,
    reduceMotion,
  } = useSignal();

  /* desktop shortcuts bound by the shell: "/" searches Explore, "R" cycles
     the range. ⌘K / 1–5 / Esc live in the context so the palette can use them
     too. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (e.key === "/") {
        e.preventDefault();
        go("explore");
        window.setTimeout(() => document.querySelector<HTMLInputElement>(".sig-search input")?.focus(), 60);
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        cycleRange();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, cycleRange]);

  const navItems: DesktopNavItem[] = [
    { id: "sec-analysis", label: "Analysis", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ id: n.id, label: n.label, icon: n.icon })),
    { id: "sec-data", label: "Data", icon: <></>, kind: "section" },
    { id: "explore", label: "Event explorer", icon: <TableIcon /> },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];
  const rangeLabel = RANGES.find((r) => r.id === range)?.label ?? "30D";
  const showFilters = view !== "settings";

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="signal"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Signal</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">Console</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              The flagship build of the console language. Every chart is hand-built inline SVG that reads
              only <code>--chart-series-*</code>, <code>--chart-grid</code> and <code>--chart-axis</code> —
              no chart in this app names a colour.
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
        style="m3"
        windowChrome
        windowTitle="Signal — Product analytics"
        menu={["Signal", "File", "View", "Dashboards", "Help"]}
        storageKey="signal"
        draggable
      >
        <DesktopSidebar items={navItems} activeId={view} onSelect={(id) => go(id as ViewId)} />
        <div className="sig-app" data-motion={reduceMotion ? "reduced" : "full"}>
          <div className="sig-main">
            <DesktopTopBar
              title={current.name}
              subtitle="Signal · product analytics console"
              tools={
                <button className="sig-searchbtn" type="button" onClick={() => setPaletteOpen(true)}>
                  <SearchIcon size={15} />
                  <span>Search views, events, actions</span>
                  <kbd className="sig-kbd">⌘K</kbd>
                </button>
              }
              actions={
                <>
                  <button
                    className="sig-btn sig-btn--solid"
                    type="button"
                    onClick={() => notify("Export queued — the demo has no backend")}
                  >
                    <DownloadIcon size={14} /> Export
                  </button>
                  <button
                    className="sig-iconbtn"
                    type="button"
                    aria-label="Alerts"
                    title="Anomaly alerts"
                    onClick={() => go("overview")}
                  >
                    <BellIcon size={17} />
                  </button>
                  <button
                    className="sig-btn"
                    type="button"
                    onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
                    aria-label="Toggle row density"
                    title="Toggle row density"
                  >
                    {density === "compact" ? "Compact" : "Comfortable"}
                  </button>
                  <span className="sig-avatar" aria-hidden="true">
                    AK
                  </span>
                </>
              }
            />

            {/* ---- the global segment bar: a desktop-only pattern ---- */}
            {showFilters && (
              <div className="sig-filterbar">
                <span className="sig-filterbar__group">
                  <span className="sig-filterbar__label">Range</span>
                  <span className="sig-seg" role="radiogroup" aria-label="Range">
                    {RANGES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        role="radio"
                        aria-checked={range === r.id}
                        className={`sig-seg__btn ${range === r.id ? "is-on" : ""}`}
                        onClick={() => setRange(r.id)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </span>
                </span>
                <span className="sig-filterbar__group">
                  <span className="sig-filterbar__label">Platform</span>
                  <span className="sig-seg" role="radiogroup" aria-label="Platform">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={platform === p.id}
                        className={`sig-seg__btn ${platform === p.id ? "is-on" : ""}`}
                        onClick={() => setPlatform(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </span>
                </span>
                <span className="sig-filterbar__group">
                  <span className="sig-filterbar__label">Plan</span>
                  <span className="sig-seg" role="radiogroup" aria-label="Plan">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={plan === p.id}
                        className={`sig-seg__btn ${plan === p.id ? "is-on" : ""}`}
                        onClick={() => setPlan(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </span>
                </span>
                <span className="sig-filterbar__spacer" />
                {segmentsDirty && (
                  <button className="sig-filterbar__chip" type="button" onClick={resetSegments}>
                    <FilterIcon size={13} />
                    {platform === "all" ? "All platforms" : platform} · {plan === "all" ? "all plans" : plan} — clear
                  </button>
                )}
                <span className="sig-filterbar__meta">
                  Window {rangeLabel} · every chart re-derives from it
                </span>
              </div>
            )}

            <SurfaceScreen>
              {view === "overview" && <OverviewScreen />}
              {view === "insights" && <InsightsScreen />}

              {view === "funnel" && <FunnelScreen />}

              {view === "retention" && <RetentionScreen />}
              {view === "explore" && <ExploreScreen />}
              {view === "settings" && <SettingsScreen />}
            </SurfaceScreen>

            <CommandPalette />
            {toast && (
              <div className="sig-toast" role="status">
                {toast}
              </div>
            )}
          </div>
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="signal-theme" initialTheme="dark">
      <SignalProvider>
        <Shell />
      </SignalProvider>
    </DeviceThemeProvider>
  );
}
