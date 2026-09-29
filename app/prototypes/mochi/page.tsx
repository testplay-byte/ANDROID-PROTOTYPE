"use client";

/**
 * mochi / page — "Mochi", a claymorphism desktop personal planner
 * (money · habits · calendar).
 *
 * Built on the Meridian desktop shell:
 *   DeviceThemeProvider (mochi-theme, scoped to the SURFACE) → MochiProvider
 *   → Stage (side panels, surface switcher, fullscreen) → SurfaceFrame
 *   (surface="desktop", style="clay", windowChrome) with:
 *     · DesktopSidebar — sectioned navigation
 *     · DesktopTopBar  — title + the ⌘K command trigger + actions
 *     · the active view (Today / Budget / Habits / Settings)
 *     · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, Budget and Habits are multi-card grids with a
 *   detail region that opens BESIDE the data, the command palette exists,
 *   keyboard shortcuts jump between views, and the clay-depth preference
 *   changes the shadow recipe on every surface at once.
 *
 * The whole app body is a single `.mch-app` element carrying
 * `data-clay-depth`, which is the only hook the style sheet needs.
 */

import type { ReactNode } from "react";
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
import {
  DEPTH_LABEL,
  MochiProvider,
  VIEWS,
  useMochi,
  type Depth,
  type ViewId,
} from "../../../src/prototypes/mochi/state/mochi-context";
import { CommandPalette } from "../../../src/prototypes/mochi/components/command-palette";
import {
  HomeIcon,
  LayersIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
  SunIcon,
  TargetIcon,
  WalletIcon,
} from "../../../src/prototypes/mochi/components/icons";
import { TodayScreen } from "../../../src/prototypes/mochi/screens/today";
import { BudgetScreen } from "../../../src/prototypes/mochi/screens/budget";
import { HabitsScreen } from "../../../src/prototypes/mochi/screens/habits";
import { SettingsScreen } from "../../../src/prototypes/mochi/screens/settings";

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  today: {
    name: "Today",
    desc: "The soft dashboard: a real spend/budget ring, a habit checklist whose pucks re-derive the day progress, the day's agenda, and a 30-day spending sparkline. Two independent columns — money left, the day right — which collapse to one column on tablet.",
  },
  budget: {
    name: "Budget",
    desc: "Envelope grid with editable monthly limits, a working add-envelope form, per-category spend bars, and a detail region that opens beside the grid (ring, limit stepper, week bars, remove). On tablet it becomes a list + preview.",
  },
  habits: {
    name: "Habits",
    desc: "Habit grid with live streaks, four weekly completion bars, a working add/remove flow, and a detail region with the 28-day strip, the per-weekday tally and a four-week trend. On tablet it becomes a list + preview.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop settings: theme scoped to the window, the clay-depth control that rewrites the shadow recipe live, week-start day, the keyboard reference, and demo-data actions.",
  },
};

const DEPTH_ORDER: Depth[] = ["soft", "medium", "deep"];

const NAV: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: "today", label: "Today", icon: <HomeIcon size={18} /> },
  { id: "budget", label: "Budget", icon: <WalletIcon size={18} /> },
  { id: "habits", label: "Habits", icon: <TargetIcon size={18} /> },
];

function Shell() {
  const currentSurface = useCanonicalSurface("mochi");
  const { view, go, depth, setDepth, setPaletteOpen, toast, notify, habitProgress, budget, isWide, today } =
    useMochi();
  const { theme, setTheme } = useDeviceTheme();

  const current = SCREEN_INFO[view];

  const navItems: DesktopNavItem[] = [
    { id: "section-plan", label: "Plan", icon: <></>, kind: "section" },
    ...NAV,
    { id: "envelopes", label: "Envelope budget", icon: <WalletIcon size={18} />, badge: budget.left >= 0 ? `${Math.round(budget.ratio * 100)}%` : "over" },
    { id: "done-today", label: "Done today", icon: <TargetIcon size={18} />, badge: `${habitProgress.done}/${habitProgress.total}` },
    { id: "section-system", label: "System", icon: <></>, kind: "section" },
    { id: "settings", label: "Settings", icon: <SlidersIcon size={18} /> },
  ];

  /* the sidebar carries two read-only status rows; they open their view */
  const NAV_TARGET: Record<string, ViewId> = {
    envelopes: "budget",
    "done-today": "habits",
  };

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface={currentSurface}
      slug="mochi"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Mochi</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">Claymorphism</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              Soft dough surfaces, a live depth control, and a detail region that opens beside
              the data instead of over it.
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
        style="clay"
        windowChrome
        windowTitle="Mochi — Planner"
        menu={["Mochi", "File", "Edit", "View", "Help"]}
        storageKey="mochi"
        draggable
      >
        <div className="mch-app" data-clay-depth={depth}>
          <DesktopSidebar
            items={navItems}
            activeId={view}
            onSelect={(id) => go(NAV_TARGET[id] ?? (id as ViewId))}
          />
          <div className="mch-main">
            <DesktopTopBar
              title={current.name}
              subtitle={`Mochi · ${today.weekday} ${today.day} ${today.month} · clay ${DEPTH_LABEL[depth].toLowerCase()}`}
              tools={
                isWide ? (
                  <button className="mch-searchbtn" type="button" onClick={() => setPaletteOpen(true)}>
                    <SearchIcon size={15} />
                    <span>Search or jump to…</span>
                    <kbd>⌘K</kbd>
                  </button>
                ) : null
              }
              actions={
                <>
                  <button
                    className="mch-btn mch-btn--filled"
                    type="button"
                    onClick={() => notify("Quick add lives on the Budget and Habits views")}
                  >
                    <PlusIcon size={15} /> Quick add
                  </button>
                  <button
                    className="mch-depthchip"
                    type="button"
                    onClick={() => {
                      const next = DEPTH_ORDER[(DEPTH_ORDER.indexOf(depth) + 1) % DEPTH_ORDER.length];
                      setDepth(next);
                      notify(`Clay depth · ${DEPTH_LABEL[next]}`);
                    }}
                    aria-label="Cycle clay depth"
                    title="Cycle clay depth"
                  >
                    <LayersIcon size={15} />
                    <span>{DEPTH_LABEL[depth]}</span>
                  </button>
                  <button
                    className="mch-iconbtn"
                    type="button"
                    aria-label="Toggle theme"
                    title="Toggle theme"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
                  </button>
                  <span className="mch-avatar" aria-hidden="true">
                    KK
                  </span>
                </>
              }
            />
            <SurfaceScreen>
              {view === "today" && <TodayScreen />}
              {view === "budget" && <BudgetScreen />}
              {view === "habits" && <HabitsScreen />}
              {view === "settings" && <SettingsScreen />}
            </SurfaceScreen>
            <CommandPalette />
            {toast && (
              <div className="mch-toast" role="status">
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
    <DeviceThemeProvider storageKey="mochi-theme" initialTheme="dark">
      <MochiProvider>
        <Shell />
      </MochiProvider>
    </DeviceThemeProvider>
  );
}
