"use client";

/**
 * fitness-tracker / page — the prototype entry point (HIG / iOS design
 * language).
 *
 * Shell:
 *   DeviceThemeProvider (light default, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (theme="light" style="hig") → Screen → view switch +
 *   BottomNav (variant="tabbar").
 *
 * Hash router: #activity / #workouts / #profile / #settings.
 * Swipe left/right navigates the tabs in NAV_ITEMS order.
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
import { ActivityScreen } from "../../../src/prototypes/fitness-tracker/screens/activity-screen";
import { WorkoutsScreen } from "../../../src/prototypes/fitness-tracker/screens/workouts-screen";
import { ProfileScreen } from "../../../src/prototypes/fitness-tracker/screens/profile-screen";
import { SettingsScreen } from "../../../src/prototypes/fitness-tracker/screens/settings-screen";

type ViewId = "activity" | "workouts" | "profile" | "settings";

const VIEW_ORDER: ViewId[] = ["activity", "workouts", "profile", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "activity";
  const h = window.location.hash.replace(/^#/, "");
  return (VIEW_ORDER as string[]).includes(h) ? (h as ViewId) : "activity";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("activity");

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#activity");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
    } else {
      setView(readHashView());
    }
  }, []);

  useEffect(() => {
    function onPop() {
      setView(readHashView());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
  }

  // ── Swipe gestures (proto-kit) ───────────────────────────────────────
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx >= 0 && idx < VIEW_ORDER.length - 1) handleNav(VIEW_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx > 0) handleNav(VIEW_ORDER[idx - 1]);
    },
  });

  const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
    activity: {
      name: "Activity",
      desc: "Three activity rings (move blue, exercise green, stand yellow) drawn with SVG stroke-dasharray, a weekly M-S day selector that switches the data, and iOS grouped stat cards for steps, heart rate and distance.",
    },
    workouts: {
      name: "Workouts",
      desc: "iOS rows for Run, Cycle, Swim, Yoga and HIIT with tinted icon discs and chevrons. Tapping one starts an inline session: big circular progress ring, live elapsed timer (setInterval), start/pause/reset controls.",
    },
    profile: {
      name: "Profile",
      desc: "Profile header with an initials avatar disc, a stats grid (day streak / total workouts / minutes) and a row of achievement badges in iOS grouped style.",
    },
    settings: {
      name: "Settings",
      desc: "iOS inset grouped settings: Light/Dark appearance segmented control wired to the device theme, km/mi distance units, a weekly goal stepper and an About section.",
    },
  };

  const info = SCREEN_INFO[view];

  const NAV_ITEMS = [
    {
      id: "activity",
      label: "Activity",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.2" />
        </svg>
      ),
    },
    {
      id: "workouts",
      label: "Workouts",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5v11M17.5 6.5v11" />
          <path d="M3 9v6M21 9v6" />
          <path d="M6.5 12h11" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <DeviceThemeProvider storageKey="fitness-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Fitness Tracker</PanelTitle>
            <PanelDesc>
              An Apple HIG fitness app. Grouped light-gray background with
              pure-white cards, 16px continuous radii, hairline separators,
              iOS system-blue accent on interactive elements only, and a
              translucent blurred tab bar. Activity rings, workout sessions
              with a live ring timer, profile and settings.
            </PanelDesc>
            <div className="tags">
              <span className="tag">HIG</span>
              <span className="tag">iOS</span>
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
              <MiniBar label="Rings" width="100%" color="var(--color-primary)" />
              <MiniBar label="Day pick" width="85%" color="var(--color-success)" />
              <MiniBar label="Timer" width="70%" color="var(--color-warn)" />
              <MiniBar label="Stepper" width="55%" color="var(--color-tertiary)" />
              <MiniBar label="Theme" width="40%" color="var(--color-error)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Apple HIG</b>
              </div>
              <div className="kvlist__row">
                <span>Separation</span>
                <b>Hairlines + tonal steps</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b>#007aff</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="hig">
          <Screen>
            {view === "activity" && <ActivityScreen />}
            {view === "workouts" && <WorkoutsScreen />}
            {view === "profile" && <ProfileScreen />}
            {view === "settings" && <SettingsScreen />}
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="tabbar"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}

/** A single mini-bar row in the right info panel. */
function MiniBar({
  label,
  width,
  color,
}: {
  label: string;
  width: string;
  color: string;
}) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">•</span>
    </div>
  );
}
