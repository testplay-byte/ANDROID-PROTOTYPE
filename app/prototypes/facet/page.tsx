"use client";

/**
 * facet / page — "Facet", a bento desktop dashboard.
 *
 * Built on the meridian desktop shell (DeviceThemeProvider → Provider →
 * Stage → SurfaceFrame → DesktopSidebar + DesktopTopBar → SurfaceScreen +
 * per-view screens + ⌘K palette + toast), re-skinned for the Bento design
 * language. It is the desktop sibling of `atlas`, the bento PHONE prototype:
 * same token layer, same tile grammar, entirely different layout system.
 *
 * Shell:
 *   DeviceThemeProvider (facet-theme, scoped to the SURFACE) →
 *   FacetProvider → Stage (side panels) → SurfaceFrame
 *   (surface="desktop", style="bento", windowChrome, menu bar) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — title + ⌘K search slot + actions
 *     · the active view
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, the board is a real 4-column bento grid whose
 *   tiles can be re-spanned, the calendar opens a detail region BESIDE the
 *   data, notes have a list-and-editor split, a ⌘K command palette exists,
 *   and the window is drag-resizable.
 *
 * What makes it BENTO:
 *   `style="bento"` swaps the whole token layer — the enlarged radius scale
 *   (18-26px), a felt background, one orange accent, generous radii and
 *   borderless tiles separated by a 14px gutter. Tiles are borderless by
 *   design: a border reads as a table cell, and a table cell has a job of
 *   its own. Size carries meaning — a 2×2 is what you check every morning.
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
import { FacetProvider, VIEWS, useFacet } from "../../../src/prototypes/facet/state/facet-context";
import { CommandPalette } from "../../../src/prototypes/facet/components/command-palette";
import {
  BoardIcon,
  CalendarIcon,
  NoteIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
} from "../../../src/prototypes/facet/components/icons";
import { BoardScreen } from "../../../src/prototypes/facet/screens/board-screen";
import { CalendarScreen } from "../../../src/prototypes/facet/screens/calendar-screen";
import { NotesScreen } from "../../../src/prototypes/facet/screens/notes-screen";
import { SettingsScreen } from "../../../src/prototypes/facet/screens/settings-screen";
import { SPAN_LABEL, TODAY, longDate } from "../../../src/prototypes/facet/data";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "board", label: "Board", icon: <BoardIcon /> },
  { id: "calendar", label: "Calendar", icon: <CalendarIcon /> },
  { id: "notes", label: "Notes", icon: <NoteIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  board: {
    name: "Board",
    desc: "The bento grid: nine tiles on four columns, each doing one job, each with a span cycle in its head (1×1 → 2×1 → 2×2 → 1×2). The clock, the weather, the selected day's agenda, a quick capture that really lands in the inbox, and a habits ring you can tick.",
  },
  calendar: {
    name: "Calendar",
    desc: "A real month grid with the day's detail BESIDE it — events, then that day's habits. Month navigation is integer arithmetic, not date maths, and picking a day here changes the agenda tile on the board.",
  },
  notes: {
    name: "Notes",
    desc: "The desktop pattern: a searchable list on the left, the editor on the right, saved as you type. The newest note is also the board's note tile, so the two views can never disagree.",
  },
  settings: {
    name: "Settings",
    desc: "The preferences that change the whole window: theme, tile density, and a hide-tile control that really removes tiles from the board. Plus the desktop keyboard reference.",
  },
};

function Shell() {
  useCanonicalSurface("facet", "desktop");
  const {
    view,
    go,
    setPaletteOpen,
    toast,
    notify,
    prefs,
    visibleTiles,
    spans,
    captures,
    focusCapture,
    cycleSpan,
    activeTile,
    selectedDay,
    shiftMonth,
  } = useFacet();
  const { theme, setTheme } = useDeviceTheme();

  /* "/" focuses capture and "C" too; number keys jump between views; the
     bracket keys resize the selected tile. Desktop shortcuts, not gestures. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if ((e.key === "c" || e.key === "C") && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        focusCapture();
        return;
      }
      if (e.key === "[" || e.key === "]") {
        const id = activeTile ?? "agenda";
        cycleSpan(id, e.key === "]" ? 1 : -1);
        return;
      }
      if (e.key === "ArrowLeft" && !typing && view === "calendar") {
        shiftMonth(-1);
        return;
      }
      if (e.key === "ArrowRight" && !typing && view === "calendar") {
        shiftMonth(1);
        return;
      }
      if (/^[1-4]$/.test(e.key) && !typing) {
        go(VIEWS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTile, cycleSpan, focusCapture, go, shiftMonth, view]);

  const openCaptures = captures.filter((c) => !c.done).length;

  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Facet", icon: <></>, kind: "section" },
    ...NAV.map((n) => ({ ...n })),
    { id: "section-2", label: "Board", icon: <></>, kind: "section" },
    {
      id: "tile-count",
      label: "Tiles on the grid",
      icon: <BoardIcon />,
      badge: visibleTiles.length,
    },
    { id: "capture-inbox", label: "Capture inbox", icon: <PlusIcon />, badge: openCaptures },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface="desktop"
      slug="facet"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Facet</PanelTitle>
          <PanelDesc>
            A bento personal dashboard — borderless tiles on a felt background, one orange accent,
            and a grid where the size of a tile tells you how much it matters. Desktop build of the
            same design language as the phone prototype <b>atlas</b>.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Bento</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Pinned to {longDate(TODAY)} — no live clock, no randomness, so the board looks
              identical on every load.
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
            {visibleTiles.slice(0, 5).map((t) => (
              <span className="tag" key={t.id}>
                {t.job} · {SPAN_LABEL[spans[t.id] ?? t.span]}
              </span>
            ))}
          </div>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="bento"
        windowChrome
        windowTitle="Facet — Personal dashboard"
        menu={["Facet", "File", "Edit", "View", "Widgets", "Help"]}
        storageKey="facet"
        draggable
      >
        <DesktopSidebar
          items={navItems}
          activeId={view}
          onSelect={(id) => {
            if (id === "tile-count") {
              go("board");
              return;
            }
            if (id === "capture-inbox") {
              focusCapture();
              return;
            }
            go(id as never);
          }}
        />
        <div className="fc fc-main" data-density={prefs.density}>
          <DesktopTopBar
            title={current.name}
            subtitle={`Facet · bento dashboard · ${longDate(selectedDay)}`}
            tools={
              <button
                className="fc-search"
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
                <button className="fc-btn fc-btn--solid" type="button" onClick={focusCapture}>
                  <PlusIcon size={15} /> Capture
                </button>
                <button
                  className="fc-btn"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title="Toggle the window theme"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
                <button
                  className="fc-btn fc-btn--ghost"
                  type="button"
                  onClick={() => notify(`${openCaptures} captures waiting in the inbox`)}
                >
                  Inbox <span className="tnum">{openCaptures}</span>
                </button>
                <span className="fc-avatar" data-tone="a" aria-hidden="true">
                  RK
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "board" && <BoardScreen />}
            {view === "calendar" && <CalendarScreen />}
            {view === "notes" && <NotesScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="fc-toast" role="status">
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
    <DeviceThemeProvider storageKey="facet-theme" initialTheme="dark">
      <FacetProvider>
        <Shell />
      </FacetProvider>
    </DeviceThemeProvider>
  );
}
