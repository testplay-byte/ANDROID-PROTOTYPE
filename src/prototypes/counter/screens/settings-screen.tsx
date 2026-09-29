"use client";

/**
 * counter / screens / settings — preferences and the keyboard reference.
 *
 * Desktop settings are a multi-column form of blocks, not a scrolling phone
 * list: each preference is a solid block with its own label, its control, and
 * a one-line note saying what it changes.
 *
 * "Colour blocks" is the flat language's own preference — Flat Design 2.0 is
 * solid planes, and the tinted variants are OPTIONAL. Turning them off leaves
 * the app correct, just strictly two-tone.
 */

import type { ReactNode } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { DAY_SHORT, WEEK_MON_FIRST, shortDate, weekdayIndex } from "../data";
import { useCounter, type WeekStart } from "../state/counter-context";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "Esc", action: "Close the palette, the detail panel or the selection" },
  { keys: "1 – 4", action: "Jump to Schedule / Bookings / Services / Settings" },
  { keys: "/", action: "Focus the search field on Bookings" },
  { keys: "N", action: "Focus the new-booking customer field" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="ctr-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`ctr-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint: string;
}) {
  return (
    <div className="ctr-field">
      <span className="ctr-field__label">{label}</span>
      {children}
      <p className="ctr-field__hint">{hint}</p>
    </div>
  );
}

export function SettingsScreen() {
  const { prefs, setPrefs, resetPrefs, notify, bookings, services, resetServices } = useCounter();
  const { theme, setTheme } = useDeviceTheme();

  const sunFirst = [...WEEK_MON_FIRST.slice(1), WEEK_MON_FIRST[0]];

  return (
    <div className="ctr-view">
      <div className="ctr-settings">
        <section className="ctr-panel">
          <header className="ctr-panel__head">
            <h2>Appearance</h2>
          </header>

          <Field
            label="Theme"
            hint="Scoped to the desktop window — the stage around it never changes."
          >
            <Segmented
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
          </Field>

          <Field
            label="Colour blocks"
            hint="Flat Design treats tinted planes as optional. Off, every block drops to a neutral surface; the layout and contrast are unchanged."
          >
            <Segmented
              label="Colour blocks"
              value={prefs.blocks ? "on" : "off"}
              onChange={(v) => setPrefs({ blocks: v === "on" })}
              options={[
                { id: "on", label: "Tinted" },
                { id: "off", label: "Neutral" },
              ]}
            />
          </Field>
        </section>

        <section className="ctr-panel">
          <header className="ctr-panel__head">
            <h2>Schedule</h2>
          </header>

          <Field
            label="Week starts"
            hint="Reorders the seven columns of the schedule grid and the day list. Both orders are shown here so the change is obvious."
          >
            <Segmented
              label="Week start"
              value={prefs.weekStart}
              onChange={(v: WeekStart) => setPrefs({ weekStart: v })}
              options={[
                { id: "mon", label: "Monday" },
                { id: "sun", label: "Sunday" },
              ]}
            />
            <ol className="ctr-weekpreview">
              {(prefs.weekStart === "mon" ? WEEK_MON_FIRST : sunFirst).map((d) => (
                <li key={d}>
                  <b>{DAY_SHORT[weekdayIndex(d)]}</b>
                  <span className="tnum">{shortDate(d)}</span>
                </li>
              ))}
            </ol>
          </Field>
        </section>

        <section className="ctr-panel">
          <header className="ctr-panel__head">
            <h2>Keyboard</h2>
            <span className="ctr-panel__meta">Desktop shortcuts</span>
          </header>
          <dl className="ctr-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <kbd>{s.keys}</kbd>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ctr-panel">
          <header className="ctr-panel__head">
            <h2>Demo data</h2>
          </header>
          <p className="ctr-field__hint">
            {bookings.length} bookings and {services.length} services are fixed demo data — no
            randomness, no clock, no backend. "Today" is pinned to 28 Sep 2026. Restoring only
            resets what you changed in this session.
          </p>
          <div className="ctr-field ctr-field--row">
            <button
              className="ctr-btn"
              type="button"
              onClick={() => {
                resetPrefs();
                notify("Preferences reset to defaults");
              }}
            >
              Reset preferences
            </button>
            <button
              className="ctr-btn"
              type="button"
              onClick={() => {
                resetServices();
                resetPrefs();
                notify("Menu and preferences restored");
              }}
            >
              Restore everything
            </button>
            <button
              className="ctr-btn ctr-btn--solid"
              type="button"
              onClick={() => notify("Diary export queued — the demo has no backend")}
            >
              Export the week
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
