"use client";

/**
 * linie / page — "Linie" metro planner (Bauhaus).
 *
 * Shell: DeviceThemeProvider (linie-theme) → LinieProvider → Stage →
 * DeviceFrame (style="bauhaus") → .ln root, hash-routed
 * (#map #route #depart #me) + toast + swipe.
 */

import { useEffect, useState } from "react";
import {
  BottomNav,
  DeviceFrame,
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Screen,
  Stage,
  useSwipeSimulation,
  type NavItem,
} from "../../../src/proto-kit";
import { LinieProvider, useLinie } from "../../../src/prototypes/linie/state/linie-context";
import { LINES, STATIONS } from "../../../src/prototypes/linie/lib/data";
import { MapScreen } from "../../../src/prototypes/linie/screens/map-screen";
import { RouteScreen } from "../../../src/prototypes/linie/screens/route-screen";
import { DepartsScreen } from "../../../src/prototypes/linie/screens/departs-screen";
import { MeScreen } from "../../../src/prototypes/linie/screens/me-screen";
import { ClockIcon, RouteIcon, TrainIcon, TicketIcon } from "../../../src/prototypes/linie/components/icons";

type ViewId = "map" | "route" | "depart" | "me";
const ORDER: ViewId[] = ["map", "route", "depart", "me"];

const NAV: NavItem[] = [
  { id: "map", label: "Netz", icon: <TrainIcon size={22} /> },
  { id: "route", label: "Route", icon: <RouteIcon size={22} /> },
  { id: "depart", label: "Abfahrt", icon: <ClockIcon size={22} /> },
  { id: "me", label: "Ich", icon: <TicketIcon size={22} /> },
];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "map";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "map";
}

const INFO: Record<ViewId, { name: string; desc: string }> = {
  map: { name: "Netz", desc: "The network as geometric SVG — three lines, circle stations, interchanges. Tap a line to isolate it, a station to select it." },
  route: { name: "Route", desc: "Journey planner — pick from/to, find the route, get the vertical diagram with stops, minutes and fare; save it." },
  depart: { name: "Abfahrt", desc: "Live departures per station with ticking countdowns, a next-three hero block and the service-status strip." },
  me: { name: "Ich", desc: "Saved routes, ticket passes (buy to own), theme and switches — all persisted." },
};

function Toast() {
  const { toast } = useLinie();
  return <div className={`ln-toast${toast ? " is-in" : ""}`} role="status">{toast}</div>;
}

function Shell() {
  const [view, setView] = useState<ViewId>("map");
  const [goDeparts, setGoDeparts] = useState(0);
  const { routes, passes } = useLinie();

  useEffect(() => {
    if (window.location.hash === "") {
      try { history.replaceState(null, "", "#map"); } catch { /* sandbox */ }
    } else {
      setView(readHashView());
    }
    const onPop = () => setView(readHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(v: ViewId) {
    if (v === view) return;
    try { history.pushState(null, "", `#${v}`); } catch { /* ignore */ }
    setView(v);
  }
  function openDeparts() {
    go("depart");
    setGoDeparts((n) => n + 1);
  }

  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => { const i = ORDER.indexOf(view); if (i < ORDER.length - 1) go(ORDER[i + 1]); },
    onSwipeRight: () => { const i = ORDER.indexOf(view); if (i > 0) go(ORDER[i - 1]); },
  });

  const info = INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Linie</PanelTitle>
          <PanelDesc>
            A metro planner in Bauhaus — red is the primary, blue and yellow are
            accents, every box carries a 2px ink border and nothing casts a
            shadow. The network is drawn as geometry: three lines, circle
            stations, interchange rings.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Bauhaus</span>
            <span className="tag">3 Linien</span>
            <span className="tag">{STATIONS.length} Stationen</span>
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
          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row"><span>Style</span><b>Bauhaus</b></div>
            <div className="kvlist__row"><span>Primary</span><b>Rot</b></div>
            <div className="kvlist__row"><span>Shadows</span><b>none</b></div>
            <div className="kvlist__row"><span>Borders</span><b>2px ink</b></div>
            <div className="kvlist__row"><span>Lines</span><b>{LINES.length}</b></div>
          </div>
          <PanelHead>State</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row"><span>Routes</span><b>{routes.length}</b></div>
            <div className="kvlist__row"><span>Passes</span><b>{passes.length}</b></div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="light" style="bauhaus">
        <Screen>
          <div className="ln">
            <div key={view}>
              {view === "map" && <MapScreen onOpenDeparts={openDeparts} />}
              {view === "route" && <RouteScreen />}
              {view === "depart" && <DepartsScreen key={goDeparts} />}
              {view === "me" && <MeScreen />}
            </div>
            <Toast />
            <BottomNav variant="hard" items={NAV} activeId={view} onSelect={(id) => go(id as ViewId)} />
          </div>
        </Screen>
      </DeviceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="linie-theme" initialTheme="light">
      <LinieProvider>
        <Shell />
      </LinieProvider>
    </DeviceThemeProvider>
  );
}
