"use client";

/**
 * counter / page — "Counter" desktop booking desk.
 *
 * Built on the meridian desktop shell (DeviceThemeProvider → Provider →
 * Stage → SurfaceFrame → DesktopSidebar + DesktopTopBar + SurfaceScreen +
 * per-view screens + ⌘K palette + toast), re-skinned for Flat Design 2.0.
 *
 * Shell:
 *   DeviceThemeProvider (counter-theme, scoped to the SURFACE) →
 *   CounterProvider → Stage (side panels) → SurfaceFrame
 *   (surface="desktop", style="flat", windowChrome, menu bar) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — title + ⌘K search slot + actions
 *     · the active view, plus a detail panel BESIDE the data
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, the schedule is a real time grid, the bookings
 *   table is multi-column, sortable and multi-select, detail opens BESIDE the
 *   data, a ⌘K command palette exists, and the window is drag-resizable.
 *
 * What makes it FLAT:
 *   `style="flat"` on the SurfaceFrame swaps the whole token layer — solid
 *   planes, no shadows, no gradients, crisp geometry. The app stylesheet
 *   never adds a box-shadow: emphasis is always a change of colour.
 *
 * Preview controls (the stage's surface switcher, the full-screen button and
 * the dashboard link) live on <Stage>, never inside the app.
 */

import { useEffect, type ReactNode } from "react";
import {
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Stage,
  SurfaceFrame,
  SurfaceScreen,
  DesktopSidebar,
  DesktopTopBar,
  useCanonicalSurface,
  useDeviceTheme,
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { CounterProvider, VIEWS, useCounter } from "../../../src/prototypes/counter/state/counter-context";
import { CommandPalette } from "../../../src/prototypes/counter/components/command-palette";
import {
  CalendarIcon,
  ListIcon,
  PlusIcon,
  RulerIcon,
  SearchIcon,
  SlidersIcon,
} from "../../../src/prototypes/counter/components/icons";
import { CalendarScreen } from "../../../src/prototypes/counter/screens/calendar-screen";
import { BookingsScreen } from "../../../src/prototypes/counter/screens/bookings-screen";
import { ServicesScreen } from "../../../src/prototypes/counter/screens/services-screen";
import { SettingsScreen } from "../../../src/prototypes/counter/screens/settings-screen";
import { TODAY, shortDate, weekdayIndex, DAY_LONG } from "../../../src/prototypes/counter/data";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "calendar", label: "Schedule", icon: <CalendarIcon /> },
  { id: "bookings", label: "Bookings", icon: <ListIcon /> },
  { id: "services", label: "Services", icon: <RulerIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  calendar: {
    name: "Schedule",
    desc: "The desktop time grid: one row per person, one column per day, blocks positioned by minutes-from-midnight and sized by service duration. Click empty space to pick a slot, click a block to inspect it, and the booking form adds a real booking — or names the one already in your way.",
  },
  bookings: {
    name: "Bookings",
    desc: "The desktop data table: search + status chips with counts + a person filter, seven sortable columns, checkbox multi-select with a bulk status bar, and a detail panel that opens beside the table instead of over it.",
  },
  services: {
    name: "Services",
    desc: "The menu, and the engine of the app: every duration and price is editable here and feeds straight back into the schedule block heights, the double-booking check and the booking quote.",
  },
  settings: {
    name: "Settings",
    desc: "Theme scoped to the window, the flat language's own 'colour blocks' preference (tinted planes on or off), the week-start order with a live preview, and the desktop keyboard reference.",
  },
};

function Shell() {
  const currentSurface = useCanonicalSurface("counter");
  const {
    view,
    go,
    setPaletteOpen,
    toast,
    notify,
    counts,
    prefs,
    focusDraft,
    setStatusFilter,
  } = useCounter();
  const { theme, setTheme } = useDeviceTheme();

  /* "/" focuses search and "N" the booking form — desktop shortcuts, not
     mobile gestures. Number keys jump straight between views. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        go("bookings");
        window.setTimeout(
          () => document.querySelector<HTMLInputElement>(".ctr-search input")?.focus(),
          60
        );
      }
      if (e.key.toLowerCase() === "n" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        focusDraft();
      }
      if (/^[1-4]$/.test(e.key) && !typing) {
        go(VIEWS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusDraft, go]);

  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Counter", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ ...n })),
    { id: "section-2", label: "Ledger", icon: <></>, kind: "section" },
    { id: "t-all", label: "All bookings", icon: <ListIcon />, badge: counts.all },
    {
      id: "t-pending",
      label: "Needs confirming",
      icon: <CalendarIcon />,
      badge: counts.pending,
    },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="counter"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Counter</PanelTitle>
          <PanelDesc>
            A booking desk in Flat Design 2.0 — solid colour planes, 1px separators, one accent
            used sparingly. Navigation is a sidebar, the schedule is a real time grid, and the
            detail panel opens beside the data.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Flat Design</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Pinned to {shortDate(TODAY)} ({DAY_LONG[weekdayIndex(TODAY)]}) — no clock, no
              randomness, so the grid looks identical on every load.
            </span>
          </PanelHead>
        </>
      }
      rightPanel={
        <>
          <PanelBadge>screen</PanelBadge>
          <PanelTitle>{current.name}</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
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
        style="flat"
        windowChrome
        windowTitle="Counter — Booking desk"
        menu={["Counter", "File", "Edit", "View", "Bookings", "Help"]}
        storageKey="counter"
        draggable
      >
        <DesktopSidebar
          items={navItems}
          activeId={view}
          onSelect={(id) => {
            if (id === "t-pending") {
              go("bookings");
              setStatusFilter("pending");
              return;
            }
            go(id === "t-all" ? "bookings" : (id as never));
          }}
        />
        <div className="ctr ctr-main" data-blocks={prefs.blocks ? "on" : "off"}>
          <DesktopTopBar
            title={current.name}
            subtitle={`Counter · booking desk · ${shortDate(TODAY)}`}
            tools={
              <button
                className="ctr-search ctr-searchbtn"
                type="button"
                onClick={() => setPaletteOpen(true)}
                aria-label="Open the command palette"
              >
                <SearchIcon size={15} />
                <span>Search or jump to…</span>
                <kbd>⌘K</kbd>
              </button>
            }
            actions={
              <>
                <button
                  className="ctr-btn ctr-btn--solid"
                  type="button"
                  onClick={focusDraft}
                >
                  <PlusIcon size={15} /> New booking
                </button>
                <button
                  className="ctr-btn"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title="Toggle the window theme"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
                <button
                  className="ctr-btn ctr-btn--ghost"
                  type="button"
                  onClick={() => notify(`${counts.pending} bookings still need confirming`)}
                >
                  Pending <span className="tnum">{counts.pending}</span>
                </button>
                <span className="ctr-avatar" data-tone="a" aria-hidden="true">
                  RK
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "calendar" && <CalendarScreen />}
            {view === "bookings" && <BookingsScreen />}
            {view === "services" && <ServicesScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="ctr-toast" role="status">
              {toast}
            </div>
          )}
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="counter-theme" initialTheme="dark">
      <CounterProvider>
        <Shell />
      </CounterProvider>
    </DeviceThemeProvider>
  );
}
