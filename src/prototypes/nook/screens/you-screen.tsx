"use client";

/* you-screen — the reader's record. Quiet stat numerals (finished /
   minutes / day streak), the yearly goal as a single hairline circle
   with a filled arc, stateful hairline toggles (tap-to-highlight,
   track minutes), the Dark/Light theme pair wired to useDeviceTheme,
   and a reset row. Everything is type + hairlines; zero color. */

import type { CSSProperties } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { useNook } from "../state/nook-context";
import { YEARLY_GOAL, minutesLabel } from "../lib/data";

export function YouScreen() {
  const { books, highlights, minutes, streak, prefs, setPrefs, resetAll } = useNook();
  const { theme, setTheme } = useDeviceTheme();

  const finished = books.filter((b) => b.status === "finished").length;
  const goalPct = Math.min(100, Math.round((finished / YEARLY_GOAL) * 100));
  // hairline circle r=42 → circumference ≈ 263.9
  const CIRC = 2 * Math.PI * 42;

  return (
    <section className="no-screen" aria-label="You">
      <div className="no-content">
        <header className="no-head" style={{ "--stagger": "0ms" } as CSSProperties}>
          <span className="no-head__kicker">You</span>
          <span className="no-head__meta">the record</span>
        </header>

        <div className="no-stats" style={{ "--stagger": "70ms" } as CSSProperties}>
          <div className="no-stat">
            <span className="no-stat__num tnum">{finished}</span>
            <span className="no-stat__label">books finished</span>
          </div>
          <div className="no-stat">
            <span className="no-stat__num tnum">{minutesLabel(minutes)}</span>
            <span className="no-stat__label">time read</span>
          </div>
          <div className="no-stat">
            <span className="no-stat__num tnum">{streak}</span>
            <span className="no-stat__label">day streak</span>
          </div>
        </div>

        <div className="no-goal" style={{ "--stagger": "140ms" } as CSSProperties}>
          <svg className="no-goal__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="no-goal__track" cx="50" cy="50" r="42" />
            <circle
              className="no-goal__arc"
              cx="50"
              cy="50"
              r="42"
              style={
                {
                  strokeDasharray: `${(goalPct / 100) * CIRC} ${CIRC}`,
                  "--stagger": "260ms",
                } as CSSProperties
              }
            />
          </svg>
          <span className="no-goal__num tnum">
            {finished}
            <em>/{YEARLY_GOAL}</em>
          </span>
          <div className="no-goal__copy">
            <span className="no-goal__title">This year&apos;s goal</span>
            <span className="no-goal__sub">
              {finished >= YEARLY_GOAL
                ? "goal met — raise it whenever"
                : `${YEARLY_GOAL - finished} books to go`}
            </span>
          </div>
        </div>

        <h2 className="no-sechead" style={{ "--stagger": "200ms" } as CSSProperties}>
          Reading
        </h2>
        <div className="no-prefs" style={{ "--stagger": "230ms" } as CSSProperties}>
          <PrefToggle
            label="Tap to highlight"
            sub="mark a paragraph where it stands"
            on={prefs.tapToHighlight}
            onChange={(v) => setPrefs({ tapToHighlight: v })}
          />
          <PrefToggle
            label="Count reading time"
            sub="advance the minutes as you turn pages"
            on={prefs.trackMinutes}
            onChange={(v) => setPrefs({ trackMinutes: v })}
          />
        </div>

        <h2 className="no-sechead" style={{ "--stagger": "290ms" } as CSSProperties}>
          Appearance
        </h2>
        <div className="no-theme" style={{ "--stagger": "320ms" } as CSSProperties} role="group" aria-label="Theme">
          <button
            className={"no-theme__opt" + (theme === "dark" ? " is-on" : "")}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
          <button
            className={"no-theme__opt" + (theme === "light" ? " is-on" : "")}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
        </div>

        <h2 className="no-sechead" style={{ "--stagger": "380ms" } as CSSProperties}>
          Data
        </h2>
        <div className="no-prefs" style={{ "--stagger": "410ms" } as CSSProperties}>
          <div className="no-fact">
            <span>Library</span>
            <b className="tnum">{books.length} books</b>
          </div>
          <div className="no-fact">
            <span>Marks kept</span>
            <b className="tnum">{highlights.length}</b>
          </div>
          <button className="no-danger" onClick={resetAll}>
            Reset the shelf
          </button>
        </div>

        <p className="no-foot" style={{ "--stagger": "470ms" } as CSSProperties}>
          Nook keeps progress, marks and prefs between visits — nothing leaves this device.
        </p>
      </div>
    </section>
  );
}

function PrefToggle({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      className="no-toggle"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
    >
      <span className="no-toggle__main">
        <span className="no-toggle__label">{label}</span>
        <span className="no-toggle__sub">{sub}</span>
      </span>
      <span className={"no-hairswitch" + (on ? " is-on" : "")} aria-hidden="true">
        <span className="no-hairswitch__knob" />
      </span>
    </button>
  );
}
