"use client";

/**
 * aurora / page — "Aurora", a desktop weather + ambience window in the
 * Glassmorphism design language (`style="glass"`).
 *
 * Shell — the same skeleton as every desktop prototype in this repo:
 *   DeviceThemeProvider (aurora-theme, scoped to the SURFACE)
 *     → AuroraProvider
 *       → Stage (info panels + the surface switcher, which is preview
 *         chrome and deliberately lives OUTSIDE the app)
 *         → SurfaceFrame (surface="desktop", windowChrome, menu bar,
 *           draggable, storageKey="aurora")
 *           → .aur (app root: data-glass + data-scene + the ambient scene)
 *             → DesktopSidebar — sectioned navigation, not a bottom bar
 *             → .aur-main
 *               → DesktopTopBar — title + ⌘K command button + actions
 *               → SurfaceScreen — the active, hash-routed view
 *               → CommandPalette (⌘K) and the toast
 *
 * What makes it a desktop app and not a wide phone: navigation is a sidebar,
 * the Now view is a hero + metric COLUMN, Cities is a multi-column grid with
 * per-card actions, Details is a real detail region, the command palette
 * exists, and a unit preference re-renders every temperature app-wide while
 * a glass preference re-skins every panel at once.
 */

import { useEffect } from "react";
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
import { CONDITIONS, UNIT_LABEL, formatTemp } from "../../../src/prototypes/aurora/data";
import { AuroraProvider, VIEWS, useAurora } from "../../../src/prototypes/aurora/state/aurora-context";
import { CommandPalette } from "../../../src/prototypes/aurora/components/command-palette";
import {
  AmbienceIcon,
  CitiesIcon,
  ContrastIcon,
  DetailsIcon,
  NowIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "../../../src/prototypes/aurora/components/icons";
import { NowScreen } from "../../../src/prototypes/aurora/screens/now";
import { CitiesScreen } from "../../../src/prototypes/aurora/screens/cities";
import { DetailsScreen } from "../../../src/prototypes/aurora/screens/details";
import { SettingsScreen } from "../../../src/prototypes/aurora/screens/settings";

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  now: {
    name: "Now",
    desc: "Current conditions: a hero temperature panel beside a column of precipitation / air-quality / sun metric cards, a 24-slot hourly strip, and a 7-day list with a temperature-range bar.",
  },
  cities: {
    name: "Cities",
    desc: "The multi-city workspace: a 3 → 2 → 1 column grid of saved locations with live temps, per-card make-active and remove actions, plus a searchable catalogue that really adds a city.",
  },
  details: {
    name: "Details",
    desc: "The detail region: a 14×9 radar field with range rings and a sweep, a sun/moon arc with the marker at the city's pinned local time, and a metric grid (wind compass, humidity, feels-like, ambience mix).",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop settings: theme scoped to the window, a °C/°F toggle that re-renders every temperature, a glass-intensity control that changes the blur and overlay through data-glass, the ambience picker and the keyboard reference.",
  },
};

function Shell() {
  const currentSurface = useCanonicalSurface("aurora");
  const {
    view,
    go,
    unit,
    toggleUnit,
    glass,
    cycleGlass,
    ambience,
    setPaletteOpen,
    setAddPanelOpen,
    toast,
    notify,
    active,
    savedCities,
  } = useAurora();

  /* desktop shortcuts: 1–4 jump between views, U flips units, C cycles the
     glass recipe, / focuses the city search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[1-4]$/.test(e.key) && !typing) {
        go(VIEWS[Number(e.key) - 1].id);
        return;
      }
      if (typing) return;
      const k = e.key.toLowerCase();
      if (k === "u") toggleUnit();
      if (k === "c") cycleGlass();
      if (e.key === "/") {
        e.preventDefault();
        go("cities");
        setAddPanelOpen(true);
        window.setTimeout(() => document.querySelector<HTMLInputElement>('.aur-input input')?.focus(), 80);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleUnit, cycleGlass, setAddPanelOpen]);

  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Forecast", icon: <></>, kind: "section" },
    { id: "now", label: "Now", icon: <NowIcon /> },
    { id: "details", label: "Details", icon: <DetailsIcon /> },
    { id: "section-2", label: "Workspace", icon: <></>, kind: "section" },
    { id: "cities", label: "Cities", icon: <CitiesIcon />, badge: savedCities.length },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="aurora"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Aurora</PanelTitle>
          <PanelDesc>
            A glassmorphism weather + ambience window. Layered translucent panels, real backdrop
            blur and a colourful ambient scene for the frost to sample — the glass token layer
            supplies the whole recipe.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Glassmorphism</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              The same build reflows at tablet width — one column, metrics 2-up, hourly strip as a
              scrolling rail.
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
        style="glass"
        theme="dark"
        windowChrome
        windowTitle="Aurora — Weather &amp; Ambience"
        menu={["Aurora", "File", "View", "City", "Help"]}
        storageKey="aurora"
        draggable
      >
        {/*
          The app root owns `data-glass` and `data-scene`: that is how the
          Settings controls change the whole window, and how the ambient
          scene gets a palette for the glass to sample.
        */}
        <div className="aur" data-glass={glass} data-scene={ambience}>
          <div className="aur-sky" aria-hidden="true">
            <i className="aur-orb aur-orb--1" />
            <i className="aur-orb aur-orb--2" />
            <i className="aur-orb aur-orb--3" />
            <i className="aur-orb aur-orb--4" />
            <i className="aur-grain" />
          </div>
          <div className="aur-navwrap">
            <DesktopSidebar items={navItems} activeId={view} onSelect={(id) => go(id as never)} />
          </div>
          <div className="aur-main">
            <DesktopTopBar
              title={current.name}
              subtitle={`${active.name} · ${CONDITIONS[active.condition].label} · ${formatTemp(
                active.tempC,
                unit
              )} · ${active.time} local`}
              tools={
                <button className="aur-cmdbtn" type="button" onClick={() => setPaletteOpen(true)}>
                  <SearchIcon size={15} />
                  <span>Search cities &amp; commands</span>
                  <kbd>⌘K</kbd>
                </button>
              }
              actions={
                <>
                  <button
                    className="aur-btn"
                    type="button"
                    onClick={toggleUnit}
                    aria-label="Toggle temperature units"
                    title="Toggle °C / °F (U)"
                  >
                    {UNIT_LABEL[unit]}
                  </button>
                  <button
                    className="aur-btn"
                    type="button"
                    onClick={() => {
                      cycleGlass();
                      notify(`Glass intensity stepped from ${glass}`);
                    }}
                    aria-label="Cycle glass intensity"
                    title="Cycle glass intensity (C)"
                  >
                    <ContrastIcon size={15} />
                    <span>{glass}</span>
                  </button>
                  <button
                    className="aur-btn aur-btn--filled"
                    type="button"
                    onClick={() => {
                      go("cities");
                      setAddPanelOpen(true);
                    }}
                  >
                    <PlusIcon size={15} /> Add city
                  </button>
                </>
              }
            />
            <SurfaceScreen>
              {view === "now" && <NowScreen />}
              {view === "cities" && <CitiesScreen />}
              {view === "details" && <DetailsScreen />}
              {view === "settings" && <SettingsScreen />}
            </SurfaceScreen>
            <CommandPalette />
            {toast && (
              <div className="aur-toast" role="status">
                <AmbienceIcon size={14} />
                {toast}
              </div>
            )}
          </div>
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="aurora-theme" initialTheme="dark">
      <AuroraProvider>
        <Shell />
      </AuroraProvider>
    </DeviceThemeProvider>
  );
}
