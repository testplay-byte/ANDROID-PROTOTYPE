"use client";

/**
 * meridian / page — "Meridian" desktop project-delivery workspace.
 *
 * THE REFERENCE DESKTOP PROTOTYPE. If you are learning how this repo builds
 * desktop UIs, read this file first: it is the smallest complete example of
 * the desktop surface (see src/proto-kit/surface/).
 *
 * Shell:
 *   DeviceThemeProvider (meridian-theme, scoped to the SURFACE now, not just
 *   .device) → MeridianProvider → Stage (side panels) → SurfaceFrame
 *   (surface="desktop", windowChrome, M3 tokens) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — title + search slot + actions
 *     · the active view, plus a right-hand Inspector on Projects
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, the table is multi-column and sortable with
 *   multi-select, detail opens BESIDE the data in an inspector, the command
 *   palette exists, a density preference changes every row app-wide, and the
 *   window auto-fits the stage instead of scrolling away.
 */

import { useEffect, useState, type ReactNode } from "react";
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
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { MeridianProvider, VIEWS, useMeridian } from "../../../src/prototypes/meridian/state/meridian-context";
import { CommandPalette } from "../../../src/prototypes/meridian/components/command-palette";
import {
  BellIcon,
  BoardIcon,
  GridIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
  TableIcon,
} from "../../../src/prototypes/meridian/components/icons";
import { OverviewScreen } from "../../../src/prototypes/meridian/screens/overview";
import { ProjectsScreen } from "../../../src/prototypes/meridian/screens/projects";
import { BoardScreen } from "../../../src/prototypes/meridian/screens/board";
import { SettingsScreen } from "../../../src/prototypes/meridian/screens/settings";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <GridIcon /> },
  { id: "projects", label: "Projects", icon: <TableIcon /> },
  { id: "board", label: "Board", icon: <BoardIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  overview: {
    name: "Overview",
    desc: "Portfolio at a glance: four KPI cards, a 12-week throughput area chart, and a three-card band (needs attention, milestones, activity). Cards reflow 4 → 3 → 2 → 1 as the window narrows.",
  },
  projects: {
    name: "Projects",
    desc: "The desktop data table: search + status filter chips, sortable multi-column headers, checkbox multi-select with a bulk action bar, and a right-hand Inspector that opens beside the data instead of over it.",
  },
  board: {
    name: "Board",
    desc: "Task board by status — four columns across the full window, each with a count and a WIP limit. Cards advance with the arrow button; over-limit columns flag themselves.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop settings: theme (scoped to the window), app-wide row density, the keyboard reference, and demo-data actions.",
  },
};

function Shell() {
  const { view, go, density, setDensity, setPaletteOpen, toast, notify, counts } = useMeridian();

  /* "/" focuses search — a desktop shortcut, not a mobile gesture */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input, textarea")) {
        e.preventDefault();
        go("projects");
        window.setTimeout(() => document.querySelector<HTMLInputElement>(".mrd-search input")?.focus(), 60);
      }
      if (/^[1-4]$/.test(e.key) && !(e.target as HTMLElement)?.closest("input, textarea")) {
        go(VIEWS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Workspace", icon: <></>, kind: "section" },
    ...NAV.slice(0, 3).map((n) => ({ ...n })),
    { id: "section-2", label: "System", icon: <></>, kind: "section" },
    { id: "projects-all", label: "All projects", icon: <TableIcon />, badge: counts.total },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Meridian</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">Material 3</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              The reference desktop build — copy this shell for new desktop prototypes.
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
        style="m3"
        theme="dark"
        windowChrome
        windowTitle="Meridian — Workspace"
        menu={["File", "Edit", "View", "Project", "Help"]}
      >
        <DesktopSidebar items={navItems} activeId={view} onSelect={(id) => go(id === "projects-all" ? "projects" : (id as never))} />
          <div className="mrd-main">
            <DesktopTopBar
              title={current.name}
              subtitle="Meridian · delivery workspace"
              tools={
                <button className="mrd-searchbtn" type="button" onClick={() => setPaletteOpen(true)}>
                  <SearchIcon size={15} />
                  <span>Search or jump to…</span>
                  <kbd>⌘K</kbd>
                </button>
              }
              actions={
                <>
                  <button
                    className="mrd-btn mrd-btn--filled"
                    type="button"
                    onClick={() => notify("New task draft created")}
                  >
                    <PlusIcon size={15} /> New task
                  </button>
                  <button className="mrd-iconbtn" type="button" aria-label="Notifications" onClick={() => notify("3 notifications — 1 needs a reply")}>
                    <BellIcon size={17} />
                    <i className="mrd-dot" />
                  </button>
                  <button
                    className="mrd-density"
                    type="button"
                    onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
                    aria-label="Toggle row density"
                    title="Toggle row density"
                  >
                    {density === "comfortable" ? "Comfortable" : "Compact"}
                  </button>
                  <span className="mrd-avatar" aria-hidden="true">
                    IK
                  </span>
                </>
              }
            />
            <SurfaceScreen>
              {view === "overview" && <OverviewScreen />}
              {view === "projects" && <ProjectsScreen />}
              {view === "board" && <BoardScreen />}
              {view === "settings" && <SettingsScreen />}
            </SurfaceScreen>
            <CommandPalette />
            {toast && <div className="mrd-toast" role="status">{toast}</div>}
          </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="meridian-theme" initialTheme="dark">
      <MeridianProvider>
        <Shell />
      </MeridianProvider>
    </DeviceThemeProvider>
  );
}
