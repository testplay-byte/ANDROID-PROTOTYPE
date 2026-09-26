"use client";

/**
 * smart-home / page — the prototype entry point (bento design language).
 *
 * Shell:
 *   DeviceThemeProvider (light default, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (theme="light" style="bento") → Screen → view switch +
 *   BottomNav (variant="floating").
 *
 * Hash router: #home / #rooms / #energy / #settings.
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
import { useDevices } from "../../../src/prototypes/smart-home/lib/use-devices";
import { HomeScreen } from "../../../src/prototypes/smart-home/screens/home-screen";
import { RoomsScreen } from "../../../src/prototypes/smart-home/screens/rooms-screen";
import { EnergyScreen } from "../../../src/prototypes/smart-home/screens/energy-screen";
import { SettingsScreen } from "../../../src/prototypes/smart-home/screens/settings-screen";

type ViewId = "home" | "rooms" | "energy" | "settings";

const VIEW_ORDER: ViewId[] = ["home", "rooms", "energy", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "");
  return (VIEW_ORDER as string[]).includes(h) ? (h as ViewId) : "home";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("home");
  const api = useDevices();

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
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
    home: {
      name: "Home",
      desc: "The signature bento grid — thermostat dial with steppers, lights with a brightness slider, a dark LIVE camera tile, mini energy chart, speaker with play/pause, and a wide door-lock tile. The subtitle counts devices on.",
    },
    rooms: {
      name: "Rooms",
      desc: "Room filter chips (All / Living / Kitchen / Bedroom) and grouped device rows per room with switches, per-device status and the room's current temperature.",
    },
    energy: {
      name: "Energy",
      desc: "Today/week segmented control, a usage bar chart with the peak bar in orange, the big usage-this-week number and per-device usage rows.",
    },
    settings: {
      name: "Settings",
      desc: "Light/dark theme toggle (persisted per prototype), eco mode and guest access switches, and the home name input.",
    },
  };

  const info = SCREEN_INFO[view];

  const NAV_ITEMS = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      ),
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      id: "energy",
      label: "Energy",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
    <DeviceThemeProvider storageKey="smart-home-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Smart Home</PanelTitle>
            <PanelDesc>
              A bento-grid smart home dashboard. Mixed-height rounded tiles on
              an iOS-gray felt background, one vivid orange accent, big
              tabular numbers and mini charts. Thermostat dial, lights,
              security camera, energy, speaker and door lock — plus rooms,
              energy stats and settings.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Bento</span>
              <span className="tag">Grid</span>
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

            <PanelHead>Devices</PanelHead>
            <div className="mini-bars">
              <MiniBar label="On now" num={String(api.devicesOn)} width={`${api.devicesOn * 12}%`} color="var(--color-primary)" />
              <MiniBar label="Lights" num="3" width="38%" color="var(--color-secondary)" />
              <MiniBar label="Climate" num="21.5°" width="70%" color="var(--color-tertiary)" />
              <MiniBar label="Security" num="2" width="25%" color="var(--color-warn)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Bento grid</b>
              </div>
              <div className="kvlist__row">
                <span>Surfaces</span>
                <b>White tiles on felt</b>
              </div>
              <div className="kvlist__row">
                <span>Accent</span>
                <b>#ff5c33</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="bento">
          <Screen>
            {view === "home" && <HomeScreen api={api} />}
            {view === "rooms" && <RoomsScreen api={api} />}
            {view === "energy" && <EnergyScreen />}
            {view === "settings" && <SettingsScreen />}
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="floating"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}

/** A single mini-bar row in the right info panel. */
function MiniBar({
  label,
  num,
  width,
  color,
}: {
  label: string;
  num: string;
  width: string;
  color: string;
}) {
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
