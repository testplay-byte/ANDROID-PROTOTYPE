"use client";

/**
 * atelier / page — "Atelier" studio portfolio + project planner (Bauhaus).
 *
 * The shell is meridian's, the reference desktop build, unchanged:
 *   DeviceThemeProvider (atelier-theme, scoped to the SURFACE) →
 *   AtelierProvider → Stage (side panels) → SurfaceFrame
 *   (surface="desktop", style="bauhaus", windowChrome, menu) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — masthead + command button + actions
 *     · the active view (a detail REGION opens beside the plate wall)
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a Bauhaus desktop app rather than a wide phone:
 *   navigation is a sidebar, work is a multi-column grid of geometric
 *   plates, a selected plate opens BESIDE the grid, the board has four
 *   solid-primary columns, the command palette exists, and density +
 *   contrast change the whole window at once.
 *
 * The imagery is geometry only — circles, squares, triangles, halves,
 * quarters and bars drawn in components/geometry.tsx from the triad tokens.
 * There is not one bitmap in the prototype.
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
import {
  AtelierProvider,
  VIEWS,
  useAtelier,
} from "../../../src/prototypes/atelier/state/atelier-context";
import { CommandPalette } from "../../../src/prototypes/atelier/components/command-palette";
import {
  BoardIcon,
  CloseIcon,
  PlateIcon,
  PlusIcon,
  SearchIcon,
  StopsIcon,
  StudioIcon,
} from "../../../src/prototypes/atelier/components/icons";
import { WorkScreen } from "../../../src/prototypes/atelier/screens/work";
import { BoardScreen } from "../../../src/prototypes/atelier/screens/board";
import { StudioScreen } from "../../../src/prototypes/atelier/screens/studio";
import { SettingsScreen } from "../../../src/prototypes/atelier/screens/settings";
import { WORKS } from "../../../src/prototypes/atelier/data";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "work", label: "Work", icon: <PlateIcon /> },
  { id: "board", label: "Board", icon: <BoardIcon /> },
  { id: "studio", label: "Studio", icon: <StudioIcon /> },
  { id: "settings", label: "Settings", icon: <StopsIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  work: {
    name: "Work",
    desc: "The plate wall: a multi-column grid of geometric plates, a discipline filter that re-filters in place, and a detail region that opens BESIDE the grid instead of over it.",
  },
  board: {
    name: "Board",
    desc: "Studio production board: four columns across the window under solid red, blue, yellow and ink headers, each with a WIP count. Cards advance to the next stage on click; an over-limit column says so.",
  },
  studio: {
    name: "Studio",
    desc: "Makers, disciplines and a capacity chart — a maker directory beside flat two-tone booked/free rules, with a printed scale instead of axis furniture.",
  },
  settings: {
    name: "Settings",
    desc: "Three desktop panels: theme (scoped to the window), a contrast control that mutes the whole triad, app-wide density, the keyboard reference, and the demo-data actions.",
  },
};

function Shell() {
  const currentSurface = useCanonicalSurface("atelier");
  const { view, go, density, selectedWork, selectWork, setPaletteOpen, contrast, setContrast, toast, notify } =
    useAtelier();

  /* number keys jump between views — a desktop shortcut, not a mobile gesture */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (/^[1-4]$/.test(e.key)) go(VIEWS[Number(e.key) - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Studio", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ ...n })),
    { id: "section-2", label: "Index", icon: <></>, kind: "section" },
    { id: "plates", label: "All plates", icon: <PlateIcon />, badge: WORKS.length },
    { id: "settings", label: "Settings", icon: <StopsIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="atelier"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Atelier</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">Bauhaus</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              The Bauhaus desktop build — the phone sibling is <b>Linie</b>. Same token
              family, separate app: sidebar, plate grid, detail region, command overlay.
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
          <PanelHead>
            <span className="sidepanel__note">
              Geometry only — every plate is drawn in SVG from --color-primary,
              --color-secondary and --color-tertiary. No images anywhere.
            </span>
          </PanelHead>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="bauhaus"
        windowChrome
        windowTitle="Atelier — Studio Workspace"
        menu={["Atelier", "File", "Edit", "View", "Studio", "Help"]}
        storageKey="atelier"
        draggable
      >
        <div className="atl" data-density={density} data-contrast={contrast}>
          <DesktopSidebar
            items={navItems}
            activeId={view}
            onSelect={(id) => go(id === "plates" ? "work" : (id as never))}
          />
          <div className="atl__main">
            <DesktopTopBar
              title={current.name}
              subtitle={`Atelier · ${WORKS.length} plates on the wall`}
              tools={
                <button
                  className="atl-searchbtn"
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  aria-label="Open the command palette"
                >
                  <SearchIcon size={14} />
                  <span>Search plates, columns, makers…</span>
                  <kbd>⌘K</kbd>
                </button>
              }
              actions={
                <>
                  <button
                    className="atl-btn atl-btn--ink"
                    type="button"
                    onClick={() => notify("New plate drafted — plate 09 is unassigned")}
                  >
                    <PlusIcon size={14} /> New plate
                  </button>
                  <button
                    className="atl-segbtn"
                    type="button"
                    aria-pressed={contrast === "reduced"}
                    onClick={() => setContrast(contrast === "full" ? "reduced" : "full")}
                    title="Toggle triad contrast"
                  >
                    {contrast === "full" ? "Full triad" : "Muted triad"}
                  </button>
                  {selectedWork && (
                    <button
                      className="atl-iconbtn"
                      type="button"
                      aria-label="Close the detail region"
                      onClick={() => selectWork(null)}
                    >
                      <CloseIcon size={14} />
                    </button>
                  )}
                  <span className="atl-markid" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </>
              }
            />
            <SurfaceScreen>
              {view === "work" && <WorkScreen />}
              {view === "board" && <BoardScreen />}
              {view === "studio" && <StudioScreen />}
              {view === "settings" && <SettingsScreen />}
            </SurfaceScreen>
            <CommandPalette />
            {toast && <div className="atl-toast" role="status">{toast}</div>}
          </div>
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="atelier-theme" initialTheme="light">
      <AtelierProvider>
        <Shell />
      </AtelierProvider>
    </DeviceThemeProvider>
  );
}
