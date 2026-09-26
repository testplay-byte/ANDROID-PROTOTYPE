"use client";

/**
 * gallery-app / page — prototype entry point (Bauhaus style).
 *
 * DeviceThemeProvider (theme, scoped to .device) →
 * Stage (left/right info panels + device) →
 * DeviceFrame (style="bauhaus") → Screen → active view + BottomNav.
 *
 * Hash router: #exhibitions / #collection / #visit / #settings.
 */
import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { ExhibitionsScreen } from "../../../src/prototypes/gallery-app/screens/exhibitions-screen";
import { CollectionScreen } from "../../../src/prototypes/gallery-app/screens/collection-screen";
import { VisitScreen } from "../../../src/prototypes/gallery-app/screens/visit-screen";
import { SettingsScreen } from "../../../src/prototypes/gallery-app/screens/settings-screen";

type ViewId = "exhibitions" | "collection" | "visit" | "settings";

const NAV_ITEMS = [
  {
    id: "exhibitions",
    label: "Exhibitions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <circle cx="12" cy="8" r="5" />
        <path d="M3 21h18" />
        <path d="M7 21v-5M17 21v-5" />
      </svg>
    ),
  },
  {
    id: "collection",
    label: "Collection",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <circle cx="17" cy="17" r="4" />
      </svg>
    ),
  },
  {
    id: "visit",
    label: "Visit",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="round">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </svg>
    ),
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  exhibitions: {
    name: "Exhibitions",
    desc: "Two feature cards with pure CSS geometric posters, dates, prices, and TICKETS buttons.",
  },
  collection: {
    name: "Collection",
    desc: "Filter chips (ALL / PAINTING / SCULPTURE / PRINT) over a grid of geometric artworks — tap to favorite.",
  },
  visit: {
    name: "Visit",
    desc: "Opening hours, address, ticket steppers with a live total, and BOOK → confirmation with a geometric stamp.",
  },
  settings: {
    name: "Settings",
    desc: "Dark theme, guided tours, and newsletter toggles in sharp-cornered bordered groups.",
  },
};

const SWIPE_ORDER: ViewId[] = ["exhibitions", "collection", "visit", "settings"];

function parseHash(): ViewId {
  if (typeof window === "undefined") return "exhibitions";
  const hash = window.location.hash.replace(/^#/, "");
  return (SWIPE_ORDER as string[]).includes(hash) ? (hash as ViewId) : "exhibitions";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("exhibitions");

  // Read hash on mount; replaceState to #exhibitions if empty.
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#exhibitions");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
      setView("exhibitions");
    } else {
      setView(parseHash());
    }
  }, []);

  // Back/forward support.
  useEffect(() => {
    function onPop() {
      setView(parseHash());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    const next = id as ViewId;
    if (next === view) return;
    try {
      history.pushState(null, "", `#${next}`);
    } catch {
      /* ignore */
    }
    setView(next);
  }

  // Swipe gestures: horizontal drag navigates tabs in order.
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <DeviceThemeProvider storageKey="gallery-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Gallery App</PanelTitle>
            <PanelDesc>
              A bauhaus gallery app: pure CSS geometric posters, a triad-only
              collection grid, ticket booking with a stamped confirmation, and
              sharp-cornered settings. Form follows colour.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Bauhaus</span>
              <span className="tag">Triad</span>
              <span className="tag">4 screens</span>
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
              <div className="kvlist__row">
                <span>Style</span>
                <b>Bauhaus</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b>#d5321f</b>
              </div>
              <div className="kvlist__row">
                <span>Secondary</span>
                <b>#2b50c8</b>
              </div>
              <div className="kvlist__row">
                <span>Tertiary</span>
                <b>#f2b705</b>
              </div>
              <div className="kvlist__row">
                <span>Border</span>
                <b>2px ink</b>
              </div>
              <div className="kvlist__row">
                <span>Nav</span>
                <b>Hard slab</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="bauhaus">
          <Screen>
            {view === "exhibitions" && <ExhibitionsScreen />}
            {view === "collection" && <CollectionScreen />}
            {view === "visit" && <VisitScreen />}
            {view === "settings" && <SettingsScreen />}
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="hard"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}
