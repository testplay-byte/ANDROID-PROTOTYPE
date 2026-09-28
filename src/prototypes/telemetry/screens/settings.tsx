"use client";

/**
 * telemetry / screens / settings — console preferences.
 *
 * Desktop settings are a two-column form, not a phone's single scrolling
 * list. The controls here are real, not decorative:
 *   - theme, scoped to the SURFACE (the stage around it never changes)
 *   - row density, which resizes every table row and tile app-wide
 *   - a poll-interval stepper that drives the simulated fleet ticker
 *   - notification switches whose OFF state is explicit in both themes
 */

import { useDeviceTheme } from "../../../proto-kit";
import { useTelemetry, type Density } from "../state/telemetry-context";
import { Segmented, Stepper, Switch } from "../components/controls";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "Esc", action: "Close the palette, then the panel, then the selection" },
  { keys: "/", action: "Focus the fleet search field" },
  { keys: "1 – 4", action: "Jump to Fleet / Incidents / Metrics / Settings" },
  { keys: "↑ ↓ ↵", action: "Move the palette cursor and run the command" },
];

export function SettingsScreen() {
  const { prefs, setPrefs, density, setDensity, triggerPoll, resetIncidents, notify, pollStamp } =
    useTelemetry();
  const { theme, setTheme } = useDeviceTheme();

  return (
    <div className="tel-view" data-density={density}>
      <div className="tel-settings">
        <section className="tel-card">
          <header className="tel-card__head">
            <h2>Appearance</h2>
          </header>

          <div className="tel-field">
            <label>Theme</label>
            <Segmented
              ariaLabel="Theme"
              value={theme}
              onSelect={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
            <p className="tel-field__hint">
              Scoped to the console window — the stage around it never changes. Remembered as{" "}
              <span className="tel-kbd">telemetry-theme</span>.
            </p>
          </div>

          <div className="tel-field">
            <label>Row density</label>
            <Segmented<Density>
              ariaLabel="Row density"
              value={density}
              onSelect={setDensity}
              options={[
                { id: "comfortable", label: "Comfortable" },
                { id: "compact", label: "Compact" },
              ]}
            />
            <p className="tel-field__hint">
              Resizes every table row, status tile and chart card in the app, and is remembered.
            </p>
          </div>
        </section>

        <section className="tel-card">
          <header className="tel-card__head">
            <h2>Polling</h2>
            <span className="tel-card__meta tnum">last poll {pollStamp}</span>
          </header>
          <div className="tel-field">
            <label>Poll interval</label>
            <Stepper
              label="Poll interval"
              value={prefs.pollSec}
              min={5}
              max={120}
              step={5}
              format={(v) => `${v} seconds`}
              onChange={(v) => setPrefs({ pollSec: v })}
            />
            <p className="tel-field__hint">
              How often the fleet table and the tiles refresh. The demo replays a deterministic
              sequence, so the same tick always shows the same figures.
            </p>
          </div>
          <div className="tel-resetrow">
            <button type="button" className="tel-btn" onClick={triggerPoll}>
              Poll now
            </button>
            <button type="button" className="tel-btn tel-btn--ghost" onClick={resetIncidents}>
              Reset incident state
            </button>
          </div>
        </section>

        <section className="tel-card">
          <header className="tel-card__head">
            <h2>Notifications</h2>
          </header>
          <div className="tel-setgroup">
            <div className="tel-setrow">
              <span className="tel-setrow__text">
                <b>SEV-1 page</b>
                <span>Wake the on-call for a service-down alert</span>
              </span>
              <Switch
                label="SEV-1 page"
                checked={prefs.notifySev1}
                onChange={(v) => setPrefs({ notifySev1: v })}
              />
            </div>
            <div className="tel-setrow">
              <span className="tel-setrow__text">
                <b>SEV-2 email</b>
                <span>Email the team channel on degradation</span>
              </span>
              <Switch
                label="SEV-2 email"
                checked={prefs.notifySev2}
                onChange={(v) => setPrefs({ notifySev2: v })}
              />
            </div>
            <div className="tel-setrow">
              <span className="tel-setrow__text">
                <b>Weekly digest</b>
                <span>Uptime and SLO summary every Monday</span>
              </span>
              <Switch
                label="Weekly digest"
                checked={prefs.notifyWeekly}
                onChange={(v) => {
                  setPrefs({ notifyWeekly: v });
                  notify(v ? "Weekly digest enabled" : "Weekly digest disabled");
                }}
              />
            </div>
          </div>
          <p className="tel-field__hint tel-field__hint--gap">
            Each switch prints its state as text next to the track, so OFF is unambiguous in both
            Carbon themes.
          </p>
        </section>

        <section className="tel-card">
          <header className="tel-card__head">
            <h2>Keyboard</h2>
            <span className="tel-card__meta">Desktop shortcuts</span>
          </header>
          <dl className="tel-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <span className="tel-kbd">{s.keys}</span>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="tel-card">
          <header className="tel-card__head">
            <h2>Demo data</h2>
          </header>
          <p className="tel-field__hint">
            Every figure in Telemetry is seeded demo data — no randomness, no clock reads, no
            backend. Timestamps advance with the poll counter, so a reload replays the same
            sequence. Acknowledgements and preferences persist in{" "}
            <span className="tel-kbd">localStorage</span> on this device only.
          </p>
          <div className="tel-resetrow">
            <button
              type="button"
              className="tel-btn"
              onClick={() => notify("Preferences reset to defaults")}
            >
              Reset preferences
            </button>
            <button
              type="button"
              className="tel-btn tel-btn--primary"
              onClick={() => notify("Export queued — the demo has no backend to export to")}
            >
              Export fleet
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
