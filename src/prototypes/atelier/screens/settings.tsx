"use client";

/**
 * atelier / screens / settings — preferences and the keyboard reference.
 *
 * Desktop settings are a multi-column form: independent panels side by side,
 * not one scrolling list (phone settings are a single column, and a Bauhaus
 * desktop window has the width for three). The contrast control is the one
 * worth explaining: it pulls the triad back toward the cream ground so a
 * projector or a bright studio floor stops shouting.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { useAtelier, type Contrast, type Density } from "../state/atelier-context";
import { Segmented } from "../components/controls";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / CTRL+K", action: "Open the command palette" },
  { keys: "ESC", action: "Close the palette or the detail region" },
  { keys: "1 – 4", action: "Jump to Work / Board / Studio / Settings" },
  { keys: "CLICK A CARD", action: "Advance the job one stage" },
  { keys: "CLICK A PLATE", action: "Open its detail region beside the wall" },
];

function Panel({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="atl-box">
      <header className="atl-box__head">
        <h2>{title}</h2>
        {meta && <span>{meta}</span>}
      </header>
      {children}
    </section>
  );
}

export function SettingsScreen() {
  const { density, setDensity, contrast, setContrast, resetPrefs, notify } = useAtelier();
  const { theme, setTheme } = useDeviceTheme();

  return (
    <div className="atl-view">
      <div className="atl-settings">
        <Panel title="Ground" meta="Theme">
          <div className="atl-field">
            <label>Theme</label>
            <Segmented
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { id: "dark", label: "Ink" },
                { id: "light", label: "Paper" },
              ]}
            />
            <p className="atl-field__hint">
              Scoped to the desktop window — the dashboard around it never changes.
            </p>
          </div>

          <div className="atl-field">
            <label>Contrast</label>
            <Segmented<Contrast>
              label="Contrast"
              value={contrast}
              onChange={setContrast}
              options={[
                { id: "full", label: "Full triad" },
                { id: "reduced", label: "Muted triad" },
              ]}
            />
            <p className="atl-field__hint">
              Muted pulls red, blue and yellow toward the cream ground — the layout is
              identical, the blocks only step back. Good for projectors and for long
              sessions.
            </p>
            <div className="atl-swatches" aria-hidden="true">
              <i className="atl-geo--primary" />
              <i className="atl-geo--secondary" />
              <i className="atl-geo--tertiary" />
              <i className="atl-geo--ink" />
              <span>Primary · Secondary · Tertiary · Ink</span>
            </div>
          </div>

          <div className="atl-field">
            <label>Density</label>
            <Segmented<Density>
              label="Density"
              value={density}
              onChange={setDensity}
              options={[
                { id: "regular", label: "Regular" },
                { id: "dense", label: "Dense" },
              ]}
            />
            <p className="atl-field__hint">
              Changes the plate grid, the board cards and every bar app-wide.
            </p>
          </div>
        </Panel>

        <Panel title="Keyboard" meta="Desktop only">
          <dl className="atl-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <kbd>{s.keys}</kbd>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Plates" meta="Data">
          <p className="atl-field__hint">
            Every plate, job and figure in Atelier is fixed demo data — no randomness, no
            backend, no clock. Resetting only clears the two preferences you changed on this
            machine.
          </p>
          <ul className="atl-inventory">
            <li>
              <b className="tnum">8</b> plates filed
            </li>
            <li>
              <b className="tnum">14</b> jobs on the board
            </li>
            <li>
              <b className="tnum">6</b> makers on the roster
            </li>
          </ul>
          <div className="atl-field atl-field--row">
            <button type="button" className="atl-btn" onClick={resetPrefs}>
              Reset preferences
            </button>
            <button
              type="button"
              className="atl-btn atl-btn--ink"
              onClick={() => notify("Index exported — the demo has no backend to export to")}
            >
              Export index
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
