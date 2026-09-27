"use client";

/**
 * gallery-app / page — prototype entry point (Bauhaus style).
 *
 * DeviceThemeProvider (theme, scoped to .device, persisted `gallery-theme`)
 * → GalleryProvider (persisted favourites + plate/detail nav + toast) →
 * Stage (left/right info panels + device) →
 * DeviceFrame (style="bauhaus") → Screen → active view + PlateView + Toast
 * + hard-slab BottomNav.
 *
 * Hash router: #exhibitions / #collection / #visit / #settings.
 * Swipe order: right-swipe first closes the plate, then the pushed
 * exhibition detail; only then does it move tabs.
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
import { PlateView } from "../../../src/prototypes/gallery-app/components/plate-view";
import { Toast } from "../../../src/prototypes/gallery-app/components/toast";
import { GalleryProvider, useGallery } from "../../../src/prototypes/gallery-app/state/gallery-context";
import { ExhibitionsScreen } from "../../../src/prototypes/gallery-app/screens/exhibitions-screen";
import { CollectionScreen } from "../../../src/prototypes/gallery-app/screens/collection-screen";
import { VisitScreen } from "../../../src/prototypes/gallery-app/screens/visit-screen";
import { SettingsScreen } from "../../../src/prototypes/gallery-app/screens/settings-screen";

type ViewId = "exhibitions" | "collection" | "visit" | "settings";

const NAV_ITEMS = [
  {
    id: "exhibitions",
    label: "Saal",
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
    label: "Sammlung",
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
    label: "Besuch",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="round">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Optionen",
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
    desc: "Hero bar + numbered list (01/02/03): mini posters, triad colour study; tap pushes a detail screen with the hung-works grid and a full-screen plate view.",
  },
  collection: {
    name: "Collection",
    desc: "Segmented index strip replaces the top bar; filter by GEMÄLDE / PLASTIK / GRAFIK, favourites-only mode; diamond toggles persist to localStorage.",
  },
  visit: {
    name: "Visit",
    desc: "Hours ledger, address with quarter-circle motif, date + time-slot chips, square steppers, hard summary slab; BOOK stamps a geometric ADMITTED ticket.",
  },
  settings: {
    name: "Settings",
    desc: "Segmented HELL/DUNKEL theme (persisted, scoped to the device), square switches with toasts, collection ledger, triad-rule about block.",
  },
};

const SWIPE_ORDER: ViewId[] = ["exhibitions", "collection", "visit", "settings"];

function parseHash(): ViewId {
  if (typeof window === "undefined") return "exhibitions";
  const hash = window.location.hash.replace(/^#/, "");
  return (SWIPE_ORDER as string[]).includes(hash) ? (hash as ViewId) : "exhibitions";
}

function Shell() {
  const [view, setView] = useState<ViewId>("exhibitions");
  const { plateId, closePlate, detailId, closeDetail } = useGallery();

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
    // leave overlays open only within their own tab logic — switching tabs
    // closes the plate; going to exhibitions keeps the detail push only if
    // the user stays; simple rule: tab change closes plate + detail.
    closePlate();
    if (next !== "exhibitions") closeDetail();
    try {
      history.pushState(null, "", `#${next}`);
    } catch {
      /* ignore */
    }
    setView(next);
  }

  // Swipe gestures: right closes plate → detail → moves tabs; left moves tabs.
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (plateId != null || detailId != null) return;
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      if (plateId != null) {
        closePlate();
        return;
      }
      if (detailId != null) {
        closeDetail();
        return;
      }
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Gallery App</PanelTitle>
          <PanelDesc>
            A Bauhaus gallery app: numbered exhibitions, pure-CSS posters and
            artwork plates, a segmented index strip, ticket booking with a
            stamped confirmation, and a persisted collection. Form follows
            colour.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Bauhaus</span>
            <span className="tag">Triad</span>
            <span className="tag">4 screens</span>
            <span className="tag">Plate view</span>
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
              <span>Shadow</span>
              <b>none</b>
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

          <PlateView />
          <Toast />
        </Screen>

        <BottomNav items={NAV_ITEMS} activeId={view} onSelect={handleNav} variant="hard" />
      </DeviceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="gallery-theme" initialTheme="light">
      <GalleryProvider>
        <Shell />
      </GalleryProvider>
    </DeviceThemeProvider>
  );
}
