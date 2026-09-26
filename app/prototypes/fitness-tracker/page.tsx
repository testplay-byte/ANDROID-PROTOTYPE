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
      desc: "iOS large title that collapses to an inline nav bar past 40px of scroll. Three activity rings (move blue, exercise green, stand yellow) with rounded caps and subtle per-ring tracks, a weekly M-S pill selector, and inset grouped stat rows with hairline separators that start at the text.",
    },
    workouts: {
      name: "Workouts",
      desc: "Inset grouped rows for Run, Cycle, Swim, Yoga and HIIT with tinted rounded-square icon discs and tertiary-gray chevrons. Tapping one pushes an inline session: big circular progress ring, live elapsed timer (setInterval), start/pause/reset controls.",
    },
    profile: {
      name: "Profile",
      desc: "Profile header with an initials avatar disc, a stats grid (day streak / total workouts / minutes) at the iOS Title 2 size and a row of achievement badges in inset grouped style.",
    },
    settings: {
      name: "Settings",
      desc: "True iOS Settings anatomy: inset groups inset 16px with 10px gaps, uppercase 13px section headers and footers, Light/Dark segmented control wired to the device theme, green iOS switches and a rounded-rect '- | +' stepper.",
    },
  };

  const info = SCREEN_INFO[view];

  // Tab icons re-render on view change, so each glyph can swap between
  // outline (inactive) and filled (active) — the iOS tab bar convention.
  const NAV_ITEMS = [
    {
      id: "activity",
      label: "Activity",
      icon: <ActivityTabIcon filled={view === "activity"} />,
    },
    {
      id: "workouts",
      label: "Workouts",
      icon: <WorkoutsTabIcon filled={view === "workouts"} />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <ProfileTabIcon filled={view === "profile"} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsTabIcon filled={view === "settings"} />,
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
              pure-white cards, 34px large titles that collapse into the nav
              bar on scroll, the iOS type scale (17px body, 13px footnotes),
              inset grouped lists with hairline separators and section
              footers, iOS system-blue accent on interactive elements only,
              and a translucent blurred tab bar with outline/filled tab icons.
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

/* =========================================================================
   Tab bar glyphs — iOS convention: OUTLINE when inactive, FILLED when
   active. 22x22, currentColor (proto-kit tabbar tints active = primary).
   ========================================================================= */

const TAB_SIZE = { width: 22, height: 22, viewBox: "0 0 24 24" } as const;

function ActivityTabIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg {...TAB_SIZE} fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z"
        />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  }
  return (
    <svg {...TAB_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </svg>
  );
}

function WorkoutsTabIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg {...TAB_SIZE} fill="currentColor" aria-hidden="true">
        <rect x="6.3" y="5.5" width="3.2" height="13" rx="1.3" />
        <rect x="14.5" y="5.5" width="3.2" height="13" rx="1.3" />
        <rect x="2.4" y="8.7" width="2.6" height="6.6" rx="1" />
        <rect x="19" y="8.7" width="2.6" height="6.6" rx="1" />
        <rect x="8.6" y="10.9" width="6.8" height="2.2" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...TAB_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5v11M17.5 6.5v11" />
      <path d="M3 9v6M21 9v6" />
      <path d="M6.5 12h11" />
    </svg>
  );
}

function ProfileTabIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg {...TAB_SIZE} fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="7.4" r="3.9" />
        <path d="M4.5 20c.9-3.8 3.9-6.2 7.5-6.2s6.6 2.4 7.5 6.2c.2.7-.4 1.4-1.1 1.4H5.6c-.7 0-1.3-.7-1.1-1.4z" />
      </svg>
    );
  }
  return (
    <svg {...TAB_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsTabIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg {...TAB_SIZE} fill="currentColor" aria-hidden="true">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    );
  }
  return (
    <svg {...TAB_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
