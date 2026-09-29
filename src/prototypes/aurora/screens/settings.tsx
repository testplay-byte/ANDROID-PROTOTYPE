"use client";

/**
 * aurora / screens / settings — preferences that really do something.
 *
 * Desktop settings are a two-column form, not a phone list: every control
 * here is wired to state that changes the whole window —
 *   · Theme        → DeviceThemeProvider, scoped to the Aurora surface
 *   · Units        → every temperature on every screen re-renders
 *   · Glass        → data-glass on the app root changes the blur + overlay
 *   · Ambience     → data-scene repaints the ambient orbs behind the glass
 *   · Keyboard     → the reference the desktop shortcuts actually implement
 */

import { useDeviceTheme } from "../../../proto-kit";
import { AMBIENCES, SHORTCUTS, UNIT_LABEL, ambienceById } from "../data";
import { GLASS_LEVELS, useAurora, type GlassLevel } from "../state/aurora-context";
import { AmbienceIcon, LayersIcon, RefreshIcon, SearchIcon } from "../components/icons";

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
    <div className="aur-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`aur-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const {
    unit,
    setUnit,
    glass,
    setGlass,
    ambience,
    setAmbience,
    savedCities,
    resetPreferences,
    notify,
  } = useAurora();

  const scene = ambienceById(ambience);

  return (
    <div className="aur-view">
      <div className="aur-settings">
        <section className="aur-panel">
          <header className="aur-panel__head">
            <div>
              <h2>Appearance</h2>
              <p>Scoped to the Aurora window — the stage around it never changes</p>
            </div>
          </header>

          <div className="aur-field">
            <label id="aur-theme-label">Theme</label>
            <Segmented
              label="Theme"
              value={theme}
              onChange={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
            <p className="aur-field__hint">
              Glass reads in both: the dark palette is a saturated navy base with cool-tinted frosted
              layers, the light palette is a tinted daylight base with a near-opaque frost ladder.
            </p>
          </div>

          <div className="aur-field">
            <label id="aur-unit-label">Units</label>
            <Segmented
              label="Temperature units"
              value={unit}
              onChange={(u) => setUnit(u)}
              options={[
                { id: "c", label: UNIT_LABEL.c },
                { id: "f", label: UNIT_LABEL.f },
              ]}
            />
            <p className="aur-field__hint">
              Applies immediately to every screen — the hero, the hourly strip, the 7-day range bars
              and all nine cities. Saved as a preference.
            </p>
          </div>

          <div className="aur-field">
            <label id="aur-glass-label">Glass intensity</label>
            <Segmented
              label="Glass intensity"
              value={glass}
              onChange={(g: GlassLevel) => {
                setGlass(g);
                notify(`Glass intensity: ${g}`);
              }}
              options={GLASS_LEVELS.map((g) => ({ id: g.id, label: g.label }))}
            />
            <p className="aur-field__hint">
              Sets <code>data-glass</code> on the app root. Soft drops the backdrop blur to 7px and
              lets the ambient scene through; dense raises it to 34px and lays the
              <code> --color-surface-solid</code> overlay over every panel, so the frost dominates
              the scene. The window bar above the app root keeps the shipped recipe.
            </p>
          </div>
        </section>

        <section className="aur-panel">
          <header className="aur-panel__head">
            <div>
              <h2>Ambience</h2>
              <p>Sets data-scene — the palette of orbs the glass samples</p>
            </div>
            <span className="aur-chip">
              <AmbienceIcon size={12} /> {scene.label}
            </span>
          </header>

          <div className="aur-scenes">
            {AMBIENCES.map((a) => (
              <button
                key={a.id}
                type="button"
                className="aur-scene"
                aria-pressed={a.id === ambience}
                onClick={() => {
                  setAmbience(a.id);
                  notify(`Ambience: ${a.label}`);
                }}
              >
                <b>{a.label}</b>
                <span>{a.hint}</span>
              </button>
            ))}
          </div>

          <div className="aur-layers">
            {scene.layers.map((l) => (
              <div className="aur-layer" key={l.name}>
                <span>{l.name}</span>
                <span className="aur-meter">
                  <i style={{ width: `${l.gain}%` }} />
                </span>
                <b>{l.gain}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="aur-panel">
          <header className="aur-panel__head">
            <div>
              <h2>Keyboard</h2>
              <p>The desktop-only shortcuts this window actually implements</p>
            </div>
            <span className="aur-panel__meta">
              <SearchIcon size={12} /> ⌘K
            </span>
          </header>
          <dl className="aur-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <span className="aur-kbd">{s.keys}</span>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="aur-panel">
          <header className="aur-panel__head">
            <div>
              <h2>Data</h2>
              <p>Every number in Aurora is fixed demo data</p>
            </div>
            <span className="aur-panel__meta">
              <LayersIcon size={12} /> {savedCities.length} locations
            </span>
          </header>
          <p className="aur-field__hint">
            The hourly strip, the 7-day and the radar grid come out of a seeded generator pinned to
            29 September 2026 — no randomness, no live clock, no backend. Resetting only clears
            the preferences you changed on this device.
          </p>
          <div className="aur-field__row aur-gap-top">
            <button className="aur-btn" type="button" onClick={resetPreferences}>
              <RefreshIcon size={14} /> Reset preferences
            </button>
            <button
              className="aur-btn aur-btn--filled"
              type="button"
              onClick={() => notify("Export queued — the demo has no backend to export to")}
            >
              Export forecast
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
