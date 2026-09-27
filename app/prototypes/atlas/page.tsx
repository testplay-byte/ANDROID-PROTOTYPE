"use client";

/**
 * atlas / page — "Atlas" bento trip planner.
 *
 * The tile hierarchy IS the information architecture: every screen is a
 * genuine 2-column bento grid of mixed-height tiles on the felt gutter,
 * the header is a tile grown from the grid (no large-title + floating
 * pill), and the nav is a row of four equal rounded cells. The signature
 * motion is the tile expand: any owned tile morphs into a full-screen
 * view (~300ms emphasized scale) and back.
 *
 * Shell:
 *   DeviceThemeProvider (atlas-theme, persisted, initial dark) →
 *   AtlasProvider → Stage (side panels) → DeviceFrame (theme="dark",
 *   style="bento")
 *     .at — app root: hash-routed screens (#trip #places #pack #me),
 *           bento nav row, expand overlay, toast. Views remount with
 *           key={view} to replay the staggered tile entrance. Swipe
 *           left/right navigates tabs; while a tile is expanded, any
 *           horizontal swipe collapses it first.
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
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
import { AtlasProvider, useAtlas } from "../../../src/prototypes/atlas/state/atlas-context";
import { TripScreen } from "../../../src/prototypes/atlas/screens/trip-screen";
import { PlacesScreen } from "../../../src/prototypes/atlas/screens/places-screen";
import { PackScreen } from "../../../src/prototypes/atlas/screens/pack-screen";
import { MeScreen } from "../../../src/prototypes/atlas/screens/me-screen";
import { ExpandOverlay } from "../../../src/prototypes/atlas/components/expand";
import { Toast } from "../../../src/prototypes/atlas/components/toast";
import { BagIcon, CompassIcon, PinIcon, UserIcon } from "../../../src/prototypes/atlas/components/icons";
import { packTotal } from "../../../src/prototypes/atlas/lib/data";

type ViewId = "trip" | "places" | "pack" | "me";
const ORDER: ViewId[] = ["trip", "places", "pack", "me"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "trip";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "trip";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  trip: {
    name: "Trip",
    desc: "The showcase bento: a destination hero painted from generative landscape CSS, a 2x1 weather tile with mini forecast bars, a tall countdown tile with the big orange numeral, plus flights / stay / budget-ring / activities 1x1 tiles. Tap any tile — it morphs full-screen (~300ms) and collapses back. Header dots switch trips.",
  },
  places: {
    name: "Places",
    desc: "Collection hero counts saved places, then destination cards as media tiles: city loud, country muted, days chip, generative skyline per city. The bookmark flips the saved state (persisted); tapping a city makes it your next trip and opens the expanded destination.",
  },
  pack: {
    name: "Pack",
    desc: "Checklist as spatial grouping: Essentials spans the full width, Tech and Docs sit as equal half tiles. Every item is a cell that fills with the accent when checked; progress is per-trip and persisted, with an arm-then-confirm reset.",
  },
  me: {
    name: "Me",
    desc: "Stats bento (countries / trips / miles as big numerals), Dark↔Light segmented switch (persisted as atlas-theme, scoped to the device), planner trip-length stepper and notification switches — all in tiles, persisted.",
  },
};

const NAV_ITEMS: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: "trip", label: "Trip", icon: <CompassIcon size={20} /> },
  { id: "places", label: "Places", icon: <PinIcon size={20} /> },
  { id: "pack", label: "Pack", icon: <BagIcon size={20} /> },
  { id: "me", label: "Me", icon: <UserIcon size={20} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("trip");
  const { trip, trips, saved, packedCount, expanded, setExpanded } = useAtlas();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#trip");
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
    setExpanded(null);
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
    setView(v);
  }

  /* swipe navigation (proto-kit) — while expanded, a swipe closes first */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (expanded) {
        setExpanded(null);
        return;
      }
      const idx = ORDER.indexOf(view);
      if (idx >= 0 && idx < ORDER.length - 1) go(ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      if (expanded) {
        setExpanded(null);
        return;
      }
      const idx = ORDER.indexOf(view);
      if (idx > 0) go(ORDER[idx - 1]);
    },
  });

  const packed = packedCount(trip.id);
  const total = packTotal();
  const info = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Atlas</PanelTitle>
          <PanelDesc>
            A travel trip planner where the bento grid IS the information
            architecture: tile sizes encode frequency of use, the header is a
            tile grown from the grid, and tapping any tile morphs it
            full-screen. Generative CSS destination art, per-trip packing
            lists and a saved collection — across Trip, Places, Pack and Me.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Bento</span>
            <span className="tag">Travel</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Tile morph</span>
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

          <PanelHead>Trip data</PanelHead>
          <div className="mini-bars">
            <MiniBar label="Next" num={trip.city} width="100%" color="var(--color-primary)" />
            <MiniBar label="Saved" num={String(saved.length)} width={`${Math.min(saved.length * 20, 100)}%`} color="#38bdf8" />
            <MiniBar label="Packed" num={`${packed}/${total}`} width={`${Math.min((packed / total) * 100, 100)}%`} color="#a3e635" />
            <MiniBar label="Planned" num={String(trips.length)} width={`${Math.min(trips.length * 20, 100)}%`} color="#facc15" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Bento grid</b>
            </div>
            <div className="kvlist__row">
              <span>Palette</span>
              <b>Felt + orange accent</b>
            </div>
            <div className="kvlist__row">
              <span>Tile art</span>
              <b>Generative CSS landscapes</b>
            </div>
            <div className="kvlist__row">
              <span>Motion</span>
              <b>tile morph · stagger</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="bento">
        <Screen>
          <div className="at">
            <div className="at-screens" key={view}>
              {view === "trip" && <TripScreen onGoPack={() => go("pack")} />}
              {view === "places" && <PlacesScreen onGoTrip={() => go("trip")} />}
              {view === "pack" && <PackScreen />}
              {view === "me" && <MeScreen />}
            </div>

            <ExpandOverlay />
            <Toast />

            {/* nav: a row of four equal rounded tiles (chrome mandate) */}
            <nav className="at-nav" aria-label="Primary">
              {NAV_ITEMS.map((item) => {
                const on = item.id === view;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={"at-nav-cell" + (on ? " on" : "")}
                    aria-current={on ? "page" : undefined}
                    onClick={() => go(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
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
    <DeviceThemeProvider storageKey="atlas-theme" initialTheme="dark">
      <AtlasProvider>
        <Shell />
      </AtlasProvider>
    </DeviceThemeProvider>
  );
}
