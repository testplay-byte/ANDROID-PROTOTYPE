"use client";

/**
 * thin / screens / settings — the three things that can change, and the keys.
 *
 * Minimalism means the settings screen is short: a theme, a type scale, a
 * motion switch. No accounts, no sync, no notification matrix, no "advanced"
 * section that hides nothing.
 *
 * The type scale is the interesting one — it re-declares --fs-* on the app
 * root with a multiplier, so every piece of type in the window, chrome and
 * lists and notes, grows together. There is no per-component font setting,
 * because that is how an app stops having one type scale.
 */

import type { ReactNode } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { SCALES, useThin, type ScaleId } from "../state/thin-context";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "1 – 4", action: "Today / Projects / Inbox / Settings" },
  { keys: "N", action: "Go to the inbox and start capturing" },
  { keys: "/", action: "Focus the project filter on Today" },
  { keys: "X", action: "Tick the selected tasks, or the next one" },
  { keys: "Esc", action: "Close the palette and clear the selection" },
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
    <div className="tn-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`tn-seg__btn ${value === o.id ? "is-on" : ""}`}
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
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="tn-field">
      <div className="tn-field__text">
        <p className="tn-field__label">{label}</p>
        <p className="tn-field__hint">{hint}</p>
      </div>
      <div className="tn-field__control">{children}</div>
    </div>
  );
}

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { prefs, setPrefs, resetAll, note } = useThin();

  return (
    <div className="tn-view tn-settings">
      <header className="tn-settings__head">
        <p className="tn-eyebrow">Settings</p>
        <h2 className="tn-view__title">Three switches, and nothing else.</h2>
      </header>

      <div className="tn-settings__grid">
        <section className="tn-card">
          <h3 className="tn-card__title">Appearance</h3>

          <Field label="Theme" hint="Scoped to this window, and remembered on this machine.">
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
            label="Type scale"
            hint="One ramp for the whole app. Everything above and below this line changes size together."
          >
            <Segmented
              label="Type scale"
              value={prefs.scale}
              onChange={(v) => setPrefs({ scale: v as ScaleId })}
              options={SCALES.map((s) => ({ id: s.id as ScaleId, label: s.label }))}
            />
          </Field>

          <div className="tn-preview" aria-live="polite">
            <p className="tn-preview__aa">Aa</p>
            <div>
              <p className="tn-preview__line">The quick brown fox</p>
              <p className="tn-preview__sub tnum">
                {SCALES.find((s) => s.id === prefs.scale)?.note} · {prefs.scale}
              </p>
            </div>
          </div>
        </section>

        <section className="tn-card">
          <h3 className="tn-card__title">Behaviour</h3>

          <Field
            label="Reduce motion"
            hint="Turns every transition to zero. Nothing in this app animates for decoration — only the palette, the hover states and the note's saved chip do."
          >
            <button
              type="button"
              role="switch"
              aria-checked={!prefs.motion}
              className="tn-switch"
              data-on={!prefs.motion || undefined}
              onClick={() => setPrefs({ motion: !prefs.motion })}
            >
              <span className="tn-switch__dot" />
              <span className="tn-switch__text">{prefs.motion ? "Off" : "On"}</span>
            </button>
          </Field>

          <Field
            label="Show finished work"
            hint="Whether ticked tasks stay in the list on Today, struck through, or disappear."
          >
            <button
              type="button"
              role="switch"
              aria-checked={prefs.showDone}
              className="tn-switch"
              data-on={prefs.showDone || undefined}
              onClick={() => setPrefs({ showDone: !prefs.showDone })}
            >
              <span className="tn-switch__dot" />
              <span className="tn-switch__text">{prefs.showDone ? "On" : "Off"}</span>
            </button>
          </Field>
        </section>

        <section className="tn-card">
          <h3 className="tn-card__title">Keys</h3>
          <dl className="tn-keys">
            {SHORTCUTS.map((s) => (
              <div className="tn-keys__row" key={s.keys}>
                <dt>
                  <kbd>{s.keys}</kbd>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="tn-card">
          <h3 className="tn-card__title">Data</h3>
          <p className="tn-card__text">
            Everything is fixed demo data — no clock, no randomness, so the window looks the same
            on every load. Your note for today is{" "}
            <b className="tn-card__inline">
              {note.trim() === "" ? "empty" : `${note.trim().split(/\s+/).length} words`}
            </b>
            .
          </p>
          <button type="button" className="tn-btn" onClick={resetAll}>
            Restore the demo data
          </button>
        </section>
      </div>
    </div>
  );
}
