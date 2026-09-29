"use client";

/**
 * halo / screens / settings — the four preferences a desktop app owns.
 *
 *   Theme     — scoped to the window via the proto-kit DeviceThemeProvider.
 *   Softness  — the neumorphic signature control. It writes `data-softness`
 *               on the `.halo` root, and halo.css re-bakes the whole shadow
 *               recipe from it: the offset, the blur and the light source
 *               every raised and carved surface in the app reads. A phone
 *               settings screen has no equivalent because the phone frame
 *               never resizes the way a window does.
 *   Routines  — automations, each a NeuSwitch.
 *   Keyboard  — the shortcut reference, which only a desktop has.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { SHORTCUTS, SOFTNESS_OPTIONS, useHalo, type Softness } from "../state/halo-context";
import { CardHead } from "../components/controls";
import { NeuSwitch } from "../components/neu-switch";
import { CheckIcon } from "../components/icons";

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
    <div className="halo-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`halo-seg__btn ${value === o.id ? "is-on" : ""}`}
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
  const { softness, setSoftness, automations, toggleAutomation, resetDevices, awayScene, notify } = useHalo();

  return (
    <div className="halo-view">
      <div className="halo-settings">
        <section className="halo-card halo-raised">
          <CardHead title="Appearance" desc="Scoped to this window — the stage around it never changes" />

          <div className="halo-field">
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
            <p className="halo-field__hint">
              Both palettes are checked for 4.5:1 on every text role — the language is soft, never
              illegible.
            </p>
          </div>

          <div className="halo-field">
            <label>Softness</label>
            <Segmented
              label="Softness"
              value={softness}
              onChange={(s: Softness) => {
                setSoftness(s);
                notify(`Shadow recipe: ${s}`);
              }}
              options={SOFTNESS_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
            />
            {/* The swatches inherit --neu-o / --neu-b from the app root, so
                this preview IS the live recipe — not a drawing of it. */}
            <div className="halo-soft">
              <span className="halo-soft__swatch" aria-hidden="true" />
              <span className="halo-soft__swatch" aria-hidden="true" />
              <span className="halo-soft__swatch" aria-hidden="true" />
            </div>
            <p className="halo-field__hint">
              {SOFTNESS_OPTIONS.find((o) => o.id === softness)?.detail} — writes{" "}
              <code>data-softness=&quot;{softness}&quot;</code> on the app root and re-bakes every
              raised and carved shadow from it.
            </p>
          </div>
        </section>

        <section className="halo-card halo-raised">
          <CardHead title="Routines" desc="Automations running against the demo device set" />
          <ul className="halo-automation">
            {automations.map((a) => (
              <li key={a.id} className="halo-raised">
                <span className="halo-automation__id">
                  <b>{a.name}</b>
                  <span>{a.detail}</span>
                </span>
                <NeuSwitch on={a.on} onChange={() => toggleAutomation(a.id)} label={a.name} />
              </li>
            ))}
          </ul>
        </section>

        <section className="halo-card halo-raised">
          <CardHead title="Keyboard" desc="Desktop shortcuts — none of these exist on a phone" />
          <dl className="halo-shortcuts">
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

        <section className="halo-card halo-raised">
          <CardHead title="Demo data" desc="Everything here is fixed demo state — no backend, no randomness" />
          <p className="halo-field__hint">
            Halo reads from a literal data set: the same devices, the same 24 hourly readings and
            the same temperatures on every load. Resetting puts the device states back exactly where
            they started.
          </p>
          <div className="halo-field__row">
            <button type="button" className="halo-btn" onClick={awayScene}>
              Run away scene
            </button>
            <button type="button" className="halo-btn halo-btn--quiet" onClick={resetDevices}>
              <CheckIcon size={14} /> Reset devices
            </button>
            <button
              type="button"
              className="halo-btn halo-btn--quiet"
              onClick={() => notify("Export queued — the demo has nothing to export to")}
            >
              Export readings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
