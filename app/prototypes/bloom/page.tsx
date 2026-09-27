"use client";

/**
 * bloom / page — "Bloom" plant-care companion (Material 3, default style).
 *
 * The repo's canonical M3 reference: default tokens.css purple palette
 * (NO style prop), floating BottomNav, tonal surfaces, emphasized motion,
 * and a fully interactive plant-care flow across four tabs.
 *
 * Shell:
 *   DeviceThemeProvider (bloom-theme, persisted, initial dark) →
 *   BloomProvider → Stage (side panels) → DeviceFrame (theme="dark", M3)
 *     .bl — app root: hash-routed screens (#home #water #guide #profile),
 *           floating BottomNav, home FAB, plant + add-plant bottom sheets,
 *           toast. Views remount with key={view} to replay the staggered
 *           entrance. Swipe left/right navigates the tabs.
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
} from "../../../src/proto-kit";
import { BloomProvider, useBloom } from "../../../src/prototypes/bloom/state/bloom-context";
import { HomeScreen } from "../../../src/prototypes/bloom/screens/home-screen";
import { WaterScreen } from "../../../src/prototypes/bloom/screens/water-screen";
import { GuideScreen } from "../../../src/prototypes/bloom/screens/guide-screen";
import { ProfileScreen } from "../../../src/prototypes/bloom/screens/profile-screen";
import { Fab } from "../../../src/prototypes/bloom/components/fab";
import { PlantSheet } from "../../../src/prototypes/bloom/components/plant-sheet";
import { AddPlantSheet } from "../../../src/prototypes/bloom/components/add-plant-sheet";
import { Toast } from "../../../src/prototypes/bloom/components/toast";
import { DropIcon, LeafIcon, BookIcon, UserIcon } from "../../../src/prototypes/bloom/components/icons";
import { thirstOf, thirstState } from "../../../src/prototypes/bloom/lib/data";

type ViewId = "home" | "water" | "guide" | "profile";
const ORDER: ViewId[] = ["home", "water", "guide", "profile"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "home";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  home: {
    name: "Home",
    desc: "Greeting, due-today chips and the collection grid — generative SVG plant art, thirst rings that fill on mount (green → amber → red), tap any card for the plant sheet with care facts and 'Water now', FAB opens the add-plant sheet.",
  },
  water: {
    name: "Water",
    desc: "Today's schedule: streak card with a springing counter, weekly progress bar, tick-rows that fire a droplet ripple + strike-through, and a 7-day upcoming strip with due-days tinted.",
  },
  guide: {
    name: "Guide",
    desc: "Category chips (All / Watering / Light / Soil / Pets) filter an accordion of short care articles — rows expand with a smooth 0fr→1fr height animation and a rotating chevron.",
  },
  profile: {
    name: "Profile",
    desc: "Avatar + stats row, M3 segmented Dark/Light switch wired to useDeviceTheme (scoped to .device, persisted), notification switches and a reminder-time stepper (persisted), About → toast.",
  },
};

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: <LeafIcon size={22} /> },
  { id: "water", label: "Water", icon: <DropIcon size={22} /> },
  { id: "guide", label: "Guide", icon: <BookIcon size={22} /> },
  { id: "profile", label: "Profile", icon: <UserIcon size={22} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("home");
  const [addOpen, setAddOpen] = useState(false);
  const { plants, checks, streak, selectPlant } = useBloom();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
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
    selectPlant(null);
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

  const due = plants.filter((p) => {
    const s = thirstState(thirstOf(p));
    return s === "due" || s === "parched";
  }).length;
  const wateredRecently = plants.filter((p) => p.daysSinceWatered === 0).length;
  const info = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Bloom</PanelTitle>
          <PanelDesc>
            A plant-care companion in plain Material 3 — the repo&apos;s
            canonical M3 reference. Tonal purple surfaces, generative SVG
            plant art, animated thirst rings, M3 bottom sheets and
            emphasized motion across Home, Water, Guide and Profile.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Material 3</span>
            <span className="tag">Plant care</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Sheets</span>
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

          <PanelHead>Interactions</PanelHead>
          <div className="mini-bars">
            <MiniBar label="Plants" num={String(plants.length)} width={`${Math.min(plants.length * 12, 100)}%`} color="var(--color-primary)" />
            <MiniBar label="Due" num={String(due)} width={`${Math.min(due * 22, 100)}%`} color="#ffa06b" />
            <MiniBar label="Done" num={String(checks.length + wateredRecently)} width={`${Math.min((checks.length + wateredRecently) * 16, 100)}%`} color="#57c98a" />
            <MiniBar label="Streak" num={`${streak}d`} width={`${Math.min(streak * 12, 100)}%`} color="#ffcb5c" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Material 3</b>
            </div>
            <div className="kvlist__row">
              <span>Palette</span>
              <b>M3 purple (tokens)</b>
            </div>
            <div className="kvlist__row">
              <span>Elevation</span>
              <b>Tonal surfaces</b>
            </div>
            <div className="kvlist__row">
              <span>Motion</span>
              <b>emphasized · tokens.css</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark">
        <Screen>
          <div className="bl">
            <div className="bl-screens" key={view}>
              {view === "home" && <HomeScreen />}
              {view === "water" && <WaterScreen />}
              {view === "guide" && <GuideScreen />}
              {view === "profile" && <ProfileScreen />}
            </div>

            {view === "home" ? <Fab label="Add a plant" onClick={() => setAddOpen(true)} /> : null}

            <PlantSheet />
            <AddPlantSheet open={addOpen} onClose={() => setAddOpen(false)} />
            <Toast />

            <BottomNav items={NAV_ITEMS} activeId={view} onSelect={(id) => go(id as ViewId)} />
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
    <DeviceThemeProvider storageKey="bloom-theme" initialTheme="dark">
      <BloomProvider>
        <Shell />
      </BloomProvider>
    </DeviceThemeProvider>
  );
}
