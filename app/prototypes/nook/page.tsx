"use client";

/**
 * nook / page — "Nook" typographic reading journal (Minimalism style).
 *
 * The design IS the type scale and the whitespace: monochrome ink,
 * 1px hairlines, small-caps kickers instead of large titles, and a
 * text-only bottom tab row (weight change + a 1px underline — no
 * floating pill nav anywhere).
 *
 * Shell:
 *   DeviceThemeProvider (nook-theme, persisted, initial dark) →
 *   NookProvider → Stage (side panels) → DeviceFrame (style="minimal")
 *     .no — app root: hash-routed screens (#shelf #read #notes #you),
 *           text-only tab row, toast. Views remount with key={view} to
 *           replay the quiet staggered entrance. Swipe left/right
 *           navigates the tabs; inside #read, back-swipes the reader
 *           out to the picker/shelf state.
 */

import { useEffect } from "react";
import {
  DeviceFrame,
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Screen,
  Stage,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import {
  NookProvider,
  useNook,
  VIEWS,
  type ViewId,
} from "../../../src/prototypes/nook/state/nook-context";
import { ShelfScreen } from "../../../src/prototypes/nook/screens/shelf-screen";
import { ReadScreen } from "../../../src/prototypes/nook/screens/read-screen";
import { NotesScreen } from "../../../src/prototypes/nook/screens/notes-screen";
import { YouScreen } from "../../../src/prototypes/nook/screens/you-screen";
import { Toast } from "../../../src/prototypes/nook/components/toast";

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  shelf: {
    name: "Shelf",
    desc: "The library as pure typography: a quiet small-caps header, one 'currently reading' card with the big serif title, then reading / finished / to-read rows — title, muted author, hairline separators, 1px progress rule under each line. Tap a line to open the reader.",
  },
  read: {
    name: "Read",
    desc: "Real long-form reader. 1px progress bar under the top chrome, three-step serif size control and tight/loose leading (persisted), scroll resumes where you left off. Tapping the page toggles immersive chrome; tapping a paragraph marks it as a note. Finishing flips the book to done.",
  },
  notes: {
    name: "Notes",
    desc: "Every marked passage grouped by book — hanging hairline quotations with serif text, muted ¶ locators, and two actions per note: 'read' jumps into the reader and flashes the paragraph; 'remove' deletes the mark.",
  },
  you: {
    name: "You",
    desc: "Quiet stat numerals (finished / minutes / streak), the yearly goal as one hairline circle + arc that draws on mount, hairline switches for tap-to-highlight and time tracking, an ink-filled Dark/Light pair wired to the scoped device theme, and a shelf reset.",
  },
};

const TABS: { id: ViewId; label: string }[] = [
  { id: "shelf", label: "Shelf" },
  { id: "read", label: "Read" },
  { id: "notes", label: "Notes" },
  { id: "you", label: "You" },
];

function Shell() {
  const {
    view,
    go,
    books,
    highlights,
    minutes,
    streak,
    activeBookId,
    closeBook,
  } = useNook();

  /* NookProvider hydrates `view` from the hash on mount; here we only
     normalize a bare URL to #shelf (replaceState — no history entry). */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#shelf");
      } catch {
        /* sandbox may block hash writes */
      }
    }
  }, []);

  /* swipe navigation (proto-kit) */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = VIEWS.indexOf(view);
      if (idx >= 0 && idx < VIEWS.length - 1) go(VIEWS[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = VIEWS.indexOf(view);
      if (idx > 0) go(VIEWS[idx - 1]);
    },
  });

  const reading = books.filter((b) => b.status === "reading");
  const finished = books.filter((b) => b.status === "finished").length;
  const info = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Nook</PanelTitle>
          <PanelDesc>
            A typographic reading journal in pure Minimalism — the design is
            the type scale and the whitespace. Serif long-form reader with
            immersive chrome, hairline-marked passages, a goal ring, and a
            text-only tab row. No color, no pills, no shadows but one.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Minimalism</span>
            <span className="tag">Reading journal</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Monochrome</span>
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

          <PanelHead>Interactions</PanelHead>
          <div className="mini-bars">
            <MiniBar
              label="Books"
              num={String(books.length)}
              width={`${Math.min(books.length * 14, 100)}%`}
              color="var(--sb-text)"
            />
            <MiniBar
              label="Reading"
              num={String(reading.length)}
              width={`${Math.min(reading.length * 30, 100)}%`}
              color="var(--sb-text-muted)"
            />
            <MiniBar
              label="Marks"
              num={String(highlights.length)}
              width={`${Math.min(highlights.length * 18, 100)}%`}
              color="var(--sb-text-muted)"
            />
            <MiniBar
              label="Streak"
              num={`${streak}d`}
              width={`${Math.min(streak * 14, 100)}%`}
              color="var(--sb-text)"
            />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Minimalism</b>
            </div>
            <div className="kvlist__row">
              <span>Palette</span>
              <b>Ink · monochrome</b>
            </div>
            <div className="kvlist__row">
              <span>Minutes read</span>
              <b>{minutes}</b>
            </div>
            <div className="kvlist__row">
              <span>Goal met</span>
              <b>{finished}/12</b>
            </div>
            <div className="kvlist__row">
              <span>Nav</span>
              <b>Text-only tabs</b>
            </div>
            <div className="kvlist__row">
              <span>Motion</span>
              <b>180ms opacity/translate</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="minimal">
        <Screen>
          <div className="no">
            <div className="no-screens" key={view}>
              {view === "shelf" && <ShelfScreen />}
              {view === "read" && <ReadScreen />}
              {view === "notes" && <NotesScreen />}
              {view === "you" && <YouScreen />}
            </div>

            <Toast />

            <nav className="no-tabs" aria-label="Nook tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={"no-tab" + (view === t.id ? " is-active" : "")}
                  aria-current={view === t.id ? "page" : undefined}
                  onClick={() => {
                    /* leaving Read closes the book back to the picker */
                    if (view === "read" && t.id !== "read" && activeBookId) closeBook();
                    go(t.id);
                  }}
                >
                  {t.label}
                  {t.id === "notes" && highlights.length > 0 ? (
                    <span className="no-tab__badge tnum">{highlights.length}</span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </Screen>
      </DeviceFrame>
    </Stage>
  );
}

/** Small helper — one metric row for the right panel. */
function MiniBar({ label, num, width, color }: { label: string; num: string; width: string; color: string }) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">{num}</span>
    </div>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="nook-theme" initialTheme="dark">
      <NookProvider>
        <Shell />
      </NookProvider>
    </DeviceThemeProvider>
  );
}
