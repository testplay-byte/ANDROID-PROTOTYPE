"use client";

/**
 * still / page — "Still" meditation & breathing companion (Neumorphism).
 *
 * A soft-UI antithesis to the repo's music-player demo: same design
 * language (single-tone sheet, dual-shadow extrusion, carved presses),
 * slower tempo and sculptural calm. Four tabs: Today (streak disc,
 * intention, pillow recommendations), Breathe (the showcase — a full-bleed
 * extruded orb that IS the start/pause control, scaling with box /
 * 4-7-8 / ocean patterns), Sessions (program library with extruded play
 * discs and persisted completion), Profile (stats, reminder stepper,
 * soundscape toggles, theme).
 *
 * Shell:
 *   DeviceThemeProvider (still-theme, persisted, initial dark) →
 *   StillProvider → Stage (side panels) → DeviceFrame (theme="dark",
 *   style="neumorph") → BottomNav variant="soft".
 *   .st — app root: hash-routed screens (#today #breathe #sessions
 *         #profile), toast. Views remount with key={view} to replay the
 *         staggered rise. Swipe left/right navigates the tabs.
 *   Chrome variety: no TopBar anywhere — Today/Sessions/Profile carry a
 *   quiet centered label; Breathe has no header at all (full-bleed orb).
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
import { StillProvider, useStill } from "../../../src/prototypes/still/state/still-context";
import { TodayScreen } from "../../../src/prototypes/still/screens/today-screen";
import { BreatheScreen } from "../../../src/prototypes/still/screens/breathe-screen";
import { SessionsScreen } from "../../../src/prototypes/still/screens/sessions-screen";
import { ProfileScreen } from "../../../src/prototypes/still/screens/profile-screen";
import { Toast } from "../../../src/prototypes/still/components/toast";
import {
  BreathIcon,
  LibraryIcon,
  SunIcon,
  UserIcon,
} from "../../../src/prototypes/still/components/icons";
import { SESSIONS } from "../../../src/prototypes/still/lib/data";

type ViewId = "today" | "breathe" | "sessions" | "profile";
const ORDER: ViewId[] = ["today", "breathe", "sessions", "profile"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "today";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "today";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  today: {
    name: "Today",
    desc: "Quiet centered label header, time-aware greeting, extruded streak disc (ring + carved well), today's intention slab and three pillow-soft recommendation cards that sink into the sheet on press.",
  },
  breathe: {
    name: "Breathe",
    desc: "The showcase: no header, a large extruded orb that is the start/pause control — its scale tracks the chosen pattern (box 4-4-4-4 / calm 4-7-8 / ocean) with slow ease-in-out travel, phase ring pulses mark each change, cycles + elapsed read out above a carved cycle track.",
  },
  sessions: {
    name: "Sessions",
    desc: "Library grouped by program with a segmented length filter in a carved trough — rows carry extruded play discs; completing one sinks the disc, pops a check, credits quiet-minutes, and persists.",
  },
  profile: {
    name: "Profile",
    desc: "Stats pills (minutes / streak / sessions), daily-reminder stepper (extruded ±, carved time well), soundscape toggles (rain / bowl / noise, carved = on), Dark/Light segmented theme — all prefs persisted.",
  },
};

const NAV_ITEMS = [
  { id: "today", label: "Today", icon: <SunIcon size={22} /> },
  { id: "breathe", label: "Breathe", icon: <BreathIcon size={22} /> },
  { id: "sessions", label: "Sessions", icon: <LibraryIcon size={22} /> },
  { id: "profile", label: "Profile", icon: <UserIcon size={22} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("today");
  const { streak, totalMinutes, completeCount, pattern } = useStill();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#today");
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

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Still</PanelTitle>
          <PanelDesc>
            A meditation &amp; breathing companion in neumorphism — the soft
            UI taken somewhere quiet. One molded slab of a surface, an
            extruded breathing orb that scales with the pattern, carved
            presses everywhere, and copper used almost silently.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Neumorphism</span>
            <span className="tag">Meditation</span>
            <span className="tag">Breathwork</span>
            <span className="tag">4 tabs</span>
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
            <MiniBar label="Patterns" num={pattern.name} width="78%" color="var(--color-primary)" />
            <MiniBar label="Sessions" num={`${completeCount}/${SESSIONS.length}`} width={`${Math.min((completeCount / SESSIONS.length) * 100, 100)}%`} color="#8fb8a8" />
            <MiniBar label="Minutes" num={String(totalMinutes)} width={`${Math.min(totalMinutes / 6, 100)}%`} color="#e0a458" />
            <MiniBar label="Streak" num={`${streak}d`} width={`${Math.min(streak * 6, 100)}%`} color="#9aa0aa" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Neumorphism</b>
            </div>
            <div className="kvlist__row">
              <span>Depth</span>
              <b>dual-shadow extrude</b>
            </div>
            <div className="kvlist__row">
              <span>Chrome</span>
              <b>soft nav · no top bar</b>
            </div>
            <div className="kvlist__row">
              <span>Signature</span>
              <b>the breathing orb</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="neumorph">
        <Screen>
          <div className="st">
            <div className="st-screens" key={view}>
              {view === "today" && <TodayScreen onNavigate={go} />}
              {view === "breathe" && <BreatheScreen />}
              {view === "sessions" && <SessionsScreen />}
              {view === "profile" && <ProfileScreen />}
            </div>

            <Toast />

            <BottomNav
              variant="soft"
              items={NAV_ITEMS}
              activeId={view}
              onSelect={(id) => go(id as ViewId)}
            />
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
    <DeviceThemeProvider storageKey="still-theme" initialTheme="dark">
      <StillProvider>
        <Shell />
      </StillProvider>
    </DeviceThemeProvider>
  );
}
