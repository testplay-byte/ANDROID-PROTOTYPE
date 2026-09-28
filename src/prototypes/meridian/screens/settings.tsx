"use client";

/**
 * meridian / screens / settings — preferences and the keyboard reference.
 *
 * Desktop settings are a two-column form: a section list on the left, the
 * selected section's controls on the right. (Phone settings are a single
 * scrolling list — again, not the same component stretched.)
 */

import { useDeviceTheme } from "../../../proto-kit";
import { useMeridian, type Density } from "../state/meridian-context";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "Esc", action: "Close the palette, inspector, or selection" },
  { keys: "/", action: "Focus the search field" },
  { keys: "1 – 4", action: "Jump to Overview / Projects / Board / Settings" },
  { keys: "↑ ↓", action: "Move between table rows" },
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
    <div className="mrd-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`mrd-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsScreen() {
  const { density, setDensity, notify } = useMeridian();
  const { theme, setTheme } = useDeviceTheme();

  return (
    <div className="mrd-view mrd-settings" data-density={density}>
      <div className="mrd-settings__grid">
        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Appearance</h2>
          </header>
          <div className="mrd-field">
            <label>Theme</label>
            <Segmented
              label="Theme"
              value={theme}
              onChange={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
            <p className="mrd-field__hint">Scoped to the desktop window — the dashboard around it never changes.</p>
          </div>

          <div className="mrd-field">
            <label>Density</label>
            <Segmented
              label="Row density"
              value={density}
              onChange={(d: Density) => setDensity(d)}
              options={[
                { id: "comfortable", label: "Comfortable" },
                { id: "compact", label: "Compact" },
              ]}
            />
            <p className="mrd-field__hint">Changes every table and board card app-wide, and is remembered.</p>
          </div>
        </section>

        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Keyboard</h2>
            <span className="mrd-card__meta">Desktop shortcuts</span>
          </header>
          <dl className="mrd-shortcuts">
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

        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Data</h2>
          </header>
          <p className="mrd-field__hint">
            Every number in Meridian is fixed demo data — no randomness, no backend. Resetting
            only clears the preferences you changed on this device.
          </p>
          <div className="mrd-field mrd-field--row">
            <button className="mrd-btn" type="button" onClick={() => notify("Preferences reset to defaults")}>
              Reset preferences
            </button>
            <button
              className="mrd-btn mrd-btn--filled"
              type="button"
              onClick={() => notify("Export queued — the demo has no backend to export to")}
            >
              Export workspace
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
