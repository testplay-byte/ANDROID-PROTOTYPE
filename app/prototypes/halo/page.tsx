"use client";

/**
 * halo / page — "Halo" desktop smart-home control centre (Neumorphism).
 *
 * The Neumorph DESKTOP build, and the desktop sibling of the Neumorph phone
 * prototype (music-player). It follows app/prototypes/meridian — the repo's
 * reference desktop shell — exactly:
 *
 *   DeviceThemeProvider (halo-theme, scoped to the SURFACE, not just .device)
 *     → HaloProvider
 *       → Stage (left/right info panels + the surface switcher)
 *         → SurfaceFrame (surface="desktop", style="neumorph", window chrome
 *                          + a menu bar) with:
 *              · DesktopSidebar  — sectioned navigation
 *              · DesktopTopBar   — title + ⌘K command field + actions
 *              · SurfaceScreen   — the active view
 *              · CommandPalette  (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   - navigation is a sidebar with section headings, never a bottom bar
 *   - the home grid is a CONTROL surface (power + value in every tile)
 *   - the Rooms view opens its device drawer BESIDE the room list
 *   - the energy view compares three ways at once (hour / peak / device)
 *   - a ⌘K overlay, six keyboard shortcuts, and a "softness" preference that
 *     re-bakes the neumorphic shadow recipe app-wide
 *   - at `@container surface (max-width: 900px)` the window reflows like a
 *     tablet: the grid goes 2-up and the drawer drops below the list
 *
 * There is deliberately NO status bar and NO bottom nav: those are phone-only
 * chrome, and their absence is the point.
 *
 * The Neumorph rules held throughout halo.css: every raised surface is the
 * background colour shaped by a light top-left + dark bottom-right shadow,
 * every pressed surface is the same pair inset, radii are large, there are no
 * hard borders and no flat cards — and every text role still clears 4.5:1 in
 * both themes.
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
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { HaloProvider, VIEWS, useHalo } from "../../../src/prototypes/halo/state/halo-context";
import { CommandPalette } from "../../../src/prototypes/halo/components/command-palette";
import {
  BellIcon,
  BoltIcon,
  HomeIcon,
  MoonIcon,
  RoomsIcon,
  SearchIcon,
  SlidersIcon,
} from "../../../src/prototypes/halo/components/icons";
import { HomeScreen } from "../../../src/prototypes/halo/screens/home";
import { RoomsScreen } from "../../../src/prototypes/halo/screens/rooms";
import { EnergyScreen } from "../../../src/prototypes/halo/screens/energy";
import { SettingsScreen } from "../../../src/prototypes/halo/screens/settings";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "rooms", label: "Rooms", icon: <RoomsIcon /> },
  { id: "energy", label: "Energy", icon: <BoltIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  home: {
    name: "Home",
    desc: "The room summary: a 4-up stat strip, six room tiles that double as the grid filter, an 8-card device grid where every tile carries its own power control and value groove, then a two-column band with the 24-hour power curve and the live draw leaderboard. The grid drops 4 → 3 → 2 → 1 as the window narrows.",
  },
  rooms: {
    name: "Rooms",
    desc: "The desktop split: a filterable room list with temperature, active counts and live draw on the left, and a device drawer that opens BESIDE it on the right — every switch writes the same state the Home grid reads. Below 900px the drawer leaves its column and becomes a full-width block under the list.",
  },
  energy: {
    name: "Energy",
    desc: "Three panels, one comparison: kWh per hour today as extruded bars with yesterday dashed across them, the peak-rate strip naming the expensive window, and a by-device breakdown where every bar carries a tick for yesterday's share.",
  },
  settings: {
    name: "Settings",
    desc: "Theme scoped to the window, the softness control that re-bakes the neumorphic shadow recipe through data-softness, four automation switches, the desktop shortcut reference and the demo-data actions.",
  },
};

function Shell() {
  const currentSurface = useCanonicalSurface("halo");
  const {
    view,
    go,
    metrics,
    softness,
    setPaletteOpen,
    awayScene,
    toast,
    notify,
  } = useHalo();

  /* "/" filters the room list and 1–4 jump between views — both are desktop
     habits. ⌘K / Esc / D / A are handled inside the provider, which is the
     only place that knows the selected room. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input, textarea")) {
        e.preventDefault();
        go("rooms");
        window.setTimeout(
          () => document.querySelector<HTMLInputElement>(".halo-roomfilter input")?.focus(),
          60,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const navItems: DesktopNavItem[] = [
    { id: "sec-house", label: "The house", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ ...n })),
    { id: "sec-system", label: "System", icon: <></>, kind: "section" },
    { id: "energy-all", label: "All readings", icon: <BoltIcon />, badge: metrics.totalCount },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];
  const onNavSelect = (id: string) => {
    const hit = VIEWS.find((v) => v.id === id);
    if (hit) go(hit.id);
    else if (id === "energy-all") go("energy");
  };

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="halo"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Halo</PanelTitle>
          <PanelDesc>
            A neumorphism smart-home control centre — the desktop sibling of the Neumorph phone
            prototype (music-player). One warm accent, large radii, no hard borders, and every
            surface the same colour as the background, shaped only by a light top-left and dark
            bottom-right shadow.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Neumorph</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
            <span className="tag">Softness control</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Preview controls (fullscreen, surface switcher) live on the Stage, never inside the
              app.
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
                #{v.id}
              </span>
            ))}
          </div>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="neumorph"
        theme="dark"
        windowChrome
        windowTitle="Halo — 14 Halden Row"
        menu={["Halo", "File", "Edit", "View", "Rooms", "Help"]}
        storageKey="halo"
        draggable
      >
        <DesktopSidebar items={navItems} activeId={view} onSelect={onNavSelect} />
        <div className="halo" data-softness={softness}>
          <DesktopTopBar
            title={current.name}
            subtitle="Halo · Halden Row · 6 rooms · 23 devices"
            tools={
              <button className="halo-searchbtn" type="button" onClick={() => setPaletteOpen(true)}>
                <SearchIcon size={15} />
                <span>Search or jump to…</span>
                <kbd>⌘K</kbd>
              </button>
            }
            actions={
              <>
                <span className="halo-live">
                  <BoltIcon size={14} />
                  <b className="tnum">{Math.round(metrics.liveWatts)} W</b> now
                </span>
                <button className="halo-scene" type="button" onClick={awayScene}>
                  <MoonIcon size={14} /> Away
                </button>
                <button
                  className="halo-iconbtn halo-raised"
                  type="button"
                  aria-label="Notifications"
                  onClick={() => notify("Leak sensor in the kitchen is fine — no open alerts")}
                >
                  <BellIcon size={17} />
                </button>
                <span className="halo-avatar" aria-hidden="true">
                  KH
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "home" && <HomeScreen />}
            {view === "rooms" && <RoomsScreen />}
            {view === "energy" && <EnergyScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="halo-toast" role="status">
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
    <DeviceThemeProvider storageKey="halo-theme" initialTheme="dark">
      <HaloProvider>
        <Shell />
      </HaloProvider>
    </DeviceThemeProvider>
  );
}
