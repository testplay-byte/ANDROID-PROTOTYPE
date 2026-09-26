"use client";

/**
 * habit-tracker / page — prototype entry point (Minimalism style).
 *
 * DeviceThemeProvider (theme, scoped to .device) →
 * Stage (left/right info panels + device) →
 * DeviceFrame (style="minimal") → Screen → active view + BottomNav.
 *
 * Hash router: #today / #stats / #habits / #settings.
 * The page owns all app state (habits, week start, reminders) and passes
 * it down to the screens.
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
import { TodayScreen } from "../../../src/prototypes/habit-tracker/screens/today-screen";
import { StatsScreen } from "../../../src/prototypes/habit-tracker/screens/stats-screen";
import { HabitsScreen } from "../../../src/prototypes/habit-tracker/screens/habits-screen";
import { SettingsScreen } from "../../../src/prototypes/habit-tracker/screens/settings-screen";
import { makeHabits, todayKey } from "../../../src/prototypes/habit-tracker/lib/data";
import type { Habit, HabitDraft, WeekStart } from "../../../src/prototypes/habit-tracker/lib/types";

type ViewId = "today" | "stats" | "habits" | "settings";

const NAV_ITEMS = [
  {
    id: "today",
    label: "Today",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Stats",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
      </svg>
    ),
  },
  {
    id: "habits",
    label: "Habits",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 12.5 5 5L20 6.5" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  today: {
    name: "Today",
    desc: "Day progress ring and the habit checklist. Tap the circle to check off — streak animates up.",
  },
  stats: {
    name: "Stats",
    desc: "Monochrome weekly heatmap per habit, big completion percentage and best streak.",
  },
  habits: {
    name: "Habits",
    desc: "Your habits with an inline add/edit form: name, icon, weekly target, delete.",
  },
  settings: {
    name: "Settings",
    desc: "Theme, week start, daily reminder, and reset data with confirm.",
  },
};

const SWIPE_ORDER: ViewId[] = ["today", "stats", "habits", "settings"];

function parseHash(): ViewId {
  if (typeof window === "undefined") return "today";
  const hash = window.location.hash.replace(/^#/, "");
  return (SWIPE_ORDER as string[]).includes(hash) ? (hash as ViewId) : "today";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("today");
  const [habits, setHabits] = useState<Habit[]>(() => makeHabits());
  const [weekStart, setWeekStart] = useState<WeekStart>("mon");
  const [reminders, setReminders] = useState(true);

  // Read hash on mount; replaceState to #today if empty.
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#today");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
      setView("today");
    } else {
      setView(parseHash());
    }
  }, []);

  // Back/forward support.
  useEffect(() => {
    function onPop() {
      setView(parseHash());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    const next = id as ViewId;
    if (next === view) return;
    try {
      history.pushState(null, "", `#${next}`);
    } catch {
      /* ignore */
    }
    setView(next);
  }

  // Check / uncheck a habit for today. Streak follows the check.
  function toggleHabit(id: number) {
    const key = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = !h.history[key];
        const streak = done ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          history: { ...h.history, [key]: done },
          streak,
          bestStreak: Math.max(h.bestStreak, streak),
        };
      })
    );
  }

  function addHabit(draft: HabitDraft) {
    setHabits((prev) => [
      ...prev,
      {
        id: prev.reduce((m, h) => Math.max(m, h.id), 0) + 1,
        name: draft.name,
        icon: draft.icon,
        targetDays: draft.targetDays,
        streak: 0,
        bestStreak: 0,
        history: {},
      },
    ]);
  }

  function updateHabit(id: number, patch: Partial<Habit>) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }

  function deleteHabit(id: number) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function resetData() {
    setHabits(makeHabits());
    setWeekStart("mon");
    setReminders(true);
  }

  // Swipe gestures: horizontal drag navigates tabs in order.
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <DeviceThemeProvider storageKey="habit-tracker-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Habit Tracker</PanelTitle>
            <PanelDesc>
              A minimalism habit tracker: monochrome checklist, day progress
              ring, weekly heatmap, and quiet preferences. Whitespace is the
              design.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Minimalism</span>
              <span className="tag">Monochrome</span>
              <span className="tag">4 screens</span>
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

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Minimalism</b>
              </div>
              <div className="kvlist__row">
                <span>Palette</span>
                <b>Ink on paper</b>
              </div>
              <div className="kvlist__row">
                <span>Accent</span>
                <b>--color-error only</b>
              </div>
              <div className="kvlist__row">
                <span>Nav</span>
                <b>Floating</b>
              </div>
              <div className="kvlist__row">
                <span>Top bar</span>
                <b>Large</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="minimal">
          <Screen>
            {view === "today" && (
              <TodayScreen habits={habits} onToggle={toggleHabit} />
            )}
            {view === "stats" && (
              <StatsScreen habits={habits} weekStart={weekStart} />
            )}
            {view === "habits" && (
              <HabitsScreen
                habits={habits}
                onAdd={addHabit}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
              />
            )}
            {view === "settings" && (
              <SettingsScreen
                weekStart={weekStart}
                reminders={reminders}
                onWeekStart={setWeekStart}
                onReminders={setReminders}
                onReset={resetData}
              />
            )}
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
