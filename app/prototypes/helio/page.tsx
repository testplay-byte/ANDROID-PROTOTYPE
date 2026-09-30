"use client";

/**
 * helio / page — "Helio", a grid-operations analytics console (Console
 * language).
 *
 * THE reference build for data-heavy desktop UI. Study this one when you
 * want a dense, chart-first screen: the composition rules, the chart
 * vocabulary (src/prototypes/helio/components/charts.tsx) and the
 * "one saturated moment" discipline all come from here.
 *
 * Shell:
 *   DeviceThemeProvider (helio-theme) → HelioProvider → Stage → SurfaceFrame
 *   (surface="desktop", style="console", window chrome + menu bar) with the
 *   app's own top bar, four hash-routed views and a toast.
 */

import { useEffect } from "react";
import {
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelTitle,
  Stage,
  SurfaceFrame,
  SurfaceScreen,
  useCanonicalSurface,
  useDeviceTheme,
} from "../../../src/proto-kit";
import { HelioProvider, VIEWS, useHelio } from "../../../src/prototypes/helio/state/helio-context";
import { TopBar } from "../../../src/prototypes/helio/components/chrome";
import { OverviewScreen } from "../../../src/prototypes/helio/screens/overview";
import { InsightsScreen } from "../../../src/prototypes/helio/screens/insights";
import { AnalyticsScreen, SitesScreen, TrackerScreen } from "../../../src/prototypes/helio/screens/views";

const SCREEN_INFO: Record<string, string> = {
  overview:
    "The portfolio screen: five saturated stat tiles, then a wide feature card (production by hour with yesterday's comparison), a quarterly-goal donut, grid health, a storage gauge, eight weeks of output, the energy mix, ranked contributors, alerts and the load shape.",
  analytics:
    "Range 7D/30D/90D that genuinely rescales the chart, the 96-step load-band timeline with a crosshair readout, mix by day, and the storage trajectory.",
  sites:
    "A real desktop table: search, status filters, a sort toggle, and a detail card that opens BESIDE the table — click a row to inspect the site.",
  tracker:
    "The live view: grid frequency as a sharp-peak sparkline, a token-drawn network map, output by hour and the recent event log.",
};

function Shell() {
  const currentSurface = useCanonicalSurface("helio");
  const { view, toast } = useHelio();
  const { theme } = useDeviceTheme();
  const info = SCREEN_INFO[view];

  useEffect(() => {
    document.title = `Helio — ${VIEWS.find((v) => v.id === view)?.label ?? "Grid"}`;
  }, [view]);

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="helio"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Helio</PanelTitle>
          <PanelDesc>
            A grid-operations analytics console in the <b>Console</b> language — the system built
            for instruments. Hand-built SVG charts, hairline grid, no chart borders, tabular
            figures everywhere, and exactly one moment of full saturation so the charcoal never
            reads as monotonous.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Console</span>
            <span className="tag">Desktop</span>
            <span className="tag">4 views</span>
            <span className="tag">11 chart marks</span>
          </div>
        </>
      }
      rightPanel={
        <>
          <PanelBadge>screen</PanelBadge>
          <PanelTitle>{VIEWS.find((v) => v.id === view)?.label}</PanelTitle>
          <PanelDesc>{info}</PanelDesc>
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
        style="console"
        theme={theme}
        windowChrome
        windowTitle="Helio — Grid operations"
        menu={["Helio", "File", "Edit", "View", "Sites", "Help"]}
        storageKey="helio"
        draggable
      >
        <div className="helio">
            <TopBar />
            <SurfaceScreen>
              {view === "overview" && <OverviewScreen />}
              {view === "analytics" && <AnalyticsScreen />}
              {view === "insights" && <InsightsScreen />}
              {view === "sites" && <SitesScreen />}
              {view === "tracker" && <TrackerScreen />}
            </SurfaceScreen>
          {toast && <div className="hl-toast" role="status">{toast}</div>}
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="helio-theme" initialTheme="dark">
      <HelioProvider>
        <Shell />
      </HelioProvider>
    </DeviceThemeProvider>
  );
}
