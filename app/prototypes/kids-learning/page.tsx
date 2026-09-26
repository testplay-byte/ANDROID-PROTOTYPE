"use client";

/**
 * kids-learning / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (theme, scoped to .device, clay style) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame → Screen → (all 4 views always mounted; visibility via
 *   .view--active) + BottomNav (soft variant).
 *
 * Hash router: #home / #play / #awards / #settings.
 *
 * Shared state lifted to the page:
 *   - `stars` — earned stars per subject (Home tiles + Awards badges read it).
 *   - `subject` — the subject preselected for the Play tab (Home tiles set it).
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
import { HomeScreen } from "../../../src/prototypes/kids-learning/screens/home-screen";
import { PlayScreen } from "../../../src/prototypes/kids-learning/screens/play-screen";
import { AwardsScreen } from "../../../src/prototypes/kids-learning/screens/awards-screen";
import { SettingsScreen } from "../../../src/prototypes/kids-learning/screens/settings-screen";
import { SUBJECTS } from "../../../src/prototypes/kids-learning/lib/data";
import type { SubjectId } from "../../../src/prototypes/kids-learning/lib/types";

type ViewId = "home" | "play" | "awards" | "settings";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    id: "play",
    label: "Play",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 12h4m-2-2v4" />
        <circle cx="15" cy="13" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <path d="M8.5 5.5h7a5.5 5.5 0 0 1 5.44 6.24l-.44 3.26a3.5 3.5 0 0 1-6.15 1.66L13.5 15h-3l-.85 1.66a3.5 3.5 0 0 1-6.15-1.66L3.06 11.74A5.5 5.5 0 0 1 8.5 5.5z" />
      </svg>
    ),
  },
  {
    id: "awards",
    label: "Awards",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  home: {
    name: "Home",
    desc: "Friendly greeting + four puffy subject tiles (Letters, Numbers, Colors, Shapes) with star progress.",
  },
  play: {
    name: "Play",
    desc: "The mini game: question card + 3 puffy answers. Correct = squish + flying star; wrong = press + shake. 5 questions per round.",
  },
  awards: {
    name: "Awards",
    desc: "Badge shelf: 6 circular clay badges, locked (inset) vs unlocked (puffy). Tap for name + description sheet.",
  },
  settings: {
    name: "Settings",
    desc: "Kid profile row, night mode toggle, sound effects toggle, and a two-tap reset-stars button.",
  },
};

// ---------------------------------------------------------------------------
// Hash parsing
// ---------------------------------------------------------------------------

function parseHash(): ViewId {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace(/^#/, "");
  const ids: ViewId[] = ["home", "play", "awards", "settings"];
  return (ids as string[]).includes(hash) ? (hash as ViewId) : "home";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const [view, setView] = useState<ViewId>("home");
  const [subject, setSubject] = useState<SubjectId>("letters");
  const [stars, setStars] = useState<Record<SubjectId, number>>({
    letters: 2,
    numbers: 4,
    colors: 1,
    shapes: 3,
  });

  // Read hash on mount.
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
      setView("home");
    } else {
      setView(parseHash());
    }
  }, []);

  // Listen for back/forward.
  useEffect(() => {
    function onPop() {
      setView(parseHash());
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

  // Home tile tap → open the Play tab with that subject preselected.
  function openSubject(id: SubjectId) {
    setSubject(id);
    try {
      history.pushState(null, "", "#play");
    } catch {
      /* ignore */
    }
    setView("play");
  }

  function selectSubject(id: SubjectId) {
    setSubject(id);
  }

  // A round ended → add the earned stars to that subject (capped at 5
  // for the tile row; total for badges keeps growing).
  function handleRoundEnd(id: SubjectId, earned: number) {
    setStars((prev) => ({ ...prev, [id]: prev[id] + earned }));
  }

  function resetStars() {
    setStars({ letters: 0, numbers: 0, colors: 0, shapes: 0 });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Swipe gestures (proto-kit): horizontal drag navigates between tabs.
  // ─────────────────────────────────────────────────────────────────────
  const SWIPE_ORDER: ViewId[] = ["home", "play", "awards", "settings"];

  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) {
        handleNav(SWIPE_ORDER[idx + 1]);
      }
    },
    onSwipeRight: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) {
        handleNav(SWIPE_ORDER[idx - 1]);
      }
    },
  });

  const info = SCREEN_INFO[view];
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  return (
    <DeviceThemeProvider storageKey="kids-learning-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Kids Learning</PanelTitle>
            <PanelDesc>
              A claymorphism learning game for preschoolers. Four subjects
              (Letters, Numbers, Colors, Shapes) with a 5-question mini game,
              a star reward system, a badge shelf, and kid-friendly settings.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Claymorphism</span>
              <span className="tag">Kids</span>
              <span className="tag">Game</span>
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

            <PanelHead>Subjects</PanelHead>
            <div className="kvlist">
              {SUBJECTS.map((s) => (
                <div className="kvlist__row" key={s.id}>
                  <span>{s.name}</span>
                  <b>{stars[s.id]} stars</b>
                </div>
              ))}
              <div className="kvlist__row">
                <span>Total</span>
                <b>{totalStars}</b>
              </div>
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Claymorphism</b>
              </div>
              <div className="kvlist__row">
                <span>Surfaces</span>
                <b>Puffy (shadow-2)</b>
              </div>
              <div className="kvlist__row">
                <span>Pressed</span>
                <b>Inset dough</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="clay">
          <Screen>
            <HomeScreen
              active={view === "home"}
              stars={stars}
              onOpenSubject={openSubject}
            />
            <PlayScreen
              active={view === "play"}
              subject={subject}
              onSelectSubject={selectSubject}
              onRoundEnd={handleRoundEnd}
            />
            <AwardsScreen active={view === "awards"} totalStars={totalStars} />
            <SettingsScreen active={view === "settings"} onResetStars={resetStars} />
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="soft"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}
