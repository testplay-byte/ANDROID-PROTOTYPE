"use client";

/**
 * thin / page — "Thin", a minimal desktop tasks + writing app.
 *
 * Built on the meridian desktop shell (DeviceThemeProvider → Provider →
 * Stage → SurfaceFrame → DesktopSidebar + DesktopTopBar → SurfaceScreen +
 * per-view screens + ⌘K palette + toast), re-skinned for Minimalism.
 *
 * Shell:
 *   DeviceThemeProvider (thin-theme, scoped to the SURFACE) →
 *   ThinProvider → Stage (side panels) → SurfaceFrame
 *   (surface="desktop", style="minimal", windowChrome, menu bar) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — title + ⌘K command slot + the capture action
 *     · the active view, and for Projects a master–detail pair
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, Projects is a real master–detail, tasks are
 *   multi-selected and acted on in bulk, a ⌘K palette exists, the window is
 *   drag-resizable, and every view is a hash route you can link to.
 *
 * What makes it MINIMAL:
 *   `style="minimal"` swaps the whole token layer for near-monochrome ink.
 *   thin.css adds no colour of its own: hairlines and whitespace do all the
 *   structural work, there is not one box-shadow, and exactly one accent
 *   (--tn-accent) appears in three places. If a border or a card was not
 *   load-bearing, it was removed rather than restyled.
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
import { ThinProvider, VIEWS, useThin, type ViewId } from "../../../src/prototypes/thin/state/thin-context";
import { CommandPalette } from "../../../src/prototypes/thin/components/command-palette";
import {
  DayIcon,
  InboxIcon,
  PlusIcon,
  ProjectsIcon,
  SearchIcon,
  SlidersIcon,
} from "../../../src/prototypes/thin/components/icons";
import { TodayScreen } from "../../../src/prototypes/thin/screens/today-screen";
import { ProjectsScreen } from "../../../src/prototypes/thin/screens/projects-screen";
import { InboxScreen } from "../../../src/prototypes/thin/screens/inbox-screen";
import { SettingsScreen } from "../../../src/prototypes/thin/screens/settings-screen";
import { TODAY, longDate } from "../../../src/prototypes/thin/data";

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  today: {
    name: "Today",
    desc: "One quiet list: the day's tasks with working completion, a project filter, and a plain-text note that saves as you type. Overdue work is folded into the same list.",
  },
  projects: {
    name: "Projects",
    desc: "The master–detail pattern: projects on the left stay put while the selected project's tasks open on the right, with add, complete and archive all working on the same array.",
  },
  inbox: {
    name: "Inbox",
    desc: "Capture without deciding — Enter really prepends a task to the list below — then triage each one into a project, into today, or into the archive.",
  },
  settings: {
    name: "Settings",
    desc: "Three things only: the window theme, a type scale that re-declares --fs-* on the app root so the WHOLE app resizes, and a reduce-motion switch. Plus the keyboard reference.",
  },
};

function Shell() {
  useCanonicalSurface("thin", "desktop");
  const {
    view,
    go,
    prefs,
    focusCapture,
    todayTasks,
    inbox,
    setPaletteOpen,
    toggleDone,
    checked,
    toast,
  } = useThin();
  const { theme, setTheme } = useDeviceTheme();

  /* Desktop shortcuts, not mobile gestures: 1–4 jump between views, N jumps
     straight to the capture field, / focuses Today's project filter and X
     ticks the selection. ⌘K and Esc are handled in the context. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[1-4]$/.test(e.key)) {
        e.preventDefault();
        go(VIEWS[Number(e.key) - 1].id);
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        go("today");
        window.setTimeout(
          () => document.querySelector<HTMLButtonElement>(".tn-filter__btn.is-on")?.focus(),
          60
        );
        return;
      }
      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        focusCapture();
        return;
      }
      if (k === "x") {
        e.preventDefault();
        const next = todayTasks.find((t) => !t.done);
        toggleDone(checked.length > 0 ? checked : next ? [next.id] : []);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checked, focusCapture, go, todayTasks, toggleDone]);

  const openToday = todayTasks.filter((t) => !t.done).length;
  const navItems: DesktopNavItem[] = [
    { id: "section-1", label: "Thin", icon: <></>, kind: "section" },
    { id: "today", label: "Today", icon: <DayIcon />, badge: openToday },
    { id: "projects", label: "Projects", icon: <ProjectsIcon /> },
    { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: inbox.length },
    { id: "section-2", label: "This window", icon: <></>, kind: "section" },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface="desktop"
      slug="thin"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Thin</PanelTitle>
          <PanelDesc>
            A minimal tasks + writing app — monochrome, hairlines, one type scale, no shadows and
            exactly one accent. Navigation is a sidebar, Projects is a real master–detail, and the
            tablet build swaps both panes for one with a back link.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Minimalism</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Pinned to {longDate(TODAY)} — no clock, no randomness, so the list looks identical on
              every load.
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
        style="minimal"
        windowChrome
        windowTitle="Thin — Tasks and writing"
        menu={["Thin", "File", "Edit", "View", "Help"]}
        storageKey="thin"
        draggable
      >
        <DesktopSidebar
          items={navItems}
          activeId={view}
          onSelect={(id) => go(id as ViewId)}
        />
        <div className="tn" data-scale={prefs.scale} data-motion={prefs.motion ? "full" : "calm"}>
          <DesktopTopBar
            title={current.name}
            subtitle={`Thin · tasks and writing · ${longDate(TODAY)}`}
            tools={
              <button
                className="tn-cmd"
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
                <button className="tn-btn tn-btn--solid" type="button" onClick={focusCapture}>
                  <PlusIcon size={14} /> Capture
                </button>
                <button
                  className="tn-btn"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title="Toggle the window theme"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </>
            }
          />
          <SurfaceScreen>
            {view === "today" && <TodayScreen />}
            {view === "projects" && <ProjectsScreen />}
            {view === "inbox" && <InboxScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="tn-toast" role="status">
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
    <DeviceThemeProvider storageKey="thin-theme" initialTheme="dark">
      <ThinProvider>
        <Shell />
      </ThinProvider>
    </DeviceThemeProvider>
  );
}
