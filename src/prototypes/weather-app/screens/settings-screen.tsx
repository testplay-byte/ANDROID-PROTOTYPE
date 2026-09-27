"use client";

/* settings screen — units, appearance (themes/blur/motion), demo data
   (exact port of the reference screens/settings.js) */

import { UiIcon, WxIcon } from "../components/icons";
import { useWeather } from "../state/weather-context";
import type { ThemeId, Unit, WindUnit, TimeFormat } from "../lib/prefs";

const THEMES: [ThemeId, string][] = [
  ["dawn", "Dawn"],
  ["day", "Day"],
  ["dusk", "Dusk"],
  ["night", "Night"],
];
const WIND_UNITS: [WindUnit, string][] = [
  ["kmh", "km/h"],
  ["mph", "mph"],
  ["ms", "m/s"],
];

export function SettingsScreen() {
  const {
    prefs,
    setUnit,
    setWindU,
    setTimeF,
    setTheme,
    setThemeAuto,
    setBlur,
    setReduceMotion,
    setSimError,
    resetAll,
  } = useWeather();

  return (
    <>
      <div className="g-title">Units</div>
      <div className="set-group glass">
        <div className="g-pad">
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="thermo" size={14} />
              </span>
              <div>
                <div className="set-name">Temperature</div>
                <div className="set-desc">Applies everywhere instantly</div>
              </div>
            </div>
            <div className="seg" role="radiogroup" aria-label="Temperature unit">
              {(["c", "f"] as Unit[]).map((u) => (
                <button key={u} className={prefs.unit === u ? "on" : ""} onClick={() => setUnit(u)}>
                  °{u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="wind" size={14} />
              </span>
              <div>
                <div className="set-name">Wind speed</div>
              </div>
            </div>
            <div className="seg" role="radiogroup" aria-label="Wind speed unit">
              {WIND_UNITS.map(([u, lab]) => (
                <button key={u} className={prefs.windU === u ? "on" : ""} onClick={() => setWindU(u)}>
                  {lab}
                </button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="clock" size={14} />
              </span>
              <div>
                <div className="set-name">Time format</div>
              </div>
            </div>
            <div className="seg" role="radiogroup" aria-label="Time format">
              {(["12h", "24h"] as TimeFormat[]).map((f) => (
                <button key={f} className={prefs.timeF === f ? "on" : ""} onClick={() => setTimeF(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="g-title">Appearance</div>
      <div className="set-group glass">
        <div className="g-pad">
          <div className="set-row block">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="sparkle" size={14} />
              </span>
              <div>
                <div className="set-name">Backdrop theme</div>
                <div className="set-desc">Night is the dark mode</div>
              </div>
            </div>
            <div className="themes">
              {THEMES.map(([id, name]) => (
                <button
                  key={id}
                  className={"theme-swatch" + (prefs.theme === id ? " on" : "")}
                  aria-pressed={prefs.theme === id}
                  aria-label={`${name} theme`}
                  onClick={() => setTheme(id)}
                >
                  <span className={"sw sw-" + id} />
                  <span className="sw-l">{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="clock" size={14} />
              </span>
              <div>
                <div className="set-name">Auto by time of day</div>
                <div className="set-desc">Dawn → Day → Dusk → Night, from the city's clock</div>
              </div>
            </div>
            <button className={"switch" + (prefs.themeAuto ? " on" : "")} role="switch" aria-checked={prefs.themeAuto} aria-label="Auto theme" onClick={() => setThemeAuto(!prefs.themeAuto)}>
              <i />
            </button>
          </div>
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="layers" size={14} />
              </span>
              <div>
                <div className="set-name">Glass blur</div>
                <div className="set-desc">{prefs.blur}px backdrop blur</div>
              </div>
            </div>
            <input
              className="slider"
              type="range"
              min={8}
              max={40}
              step={1}
              value={prefs.blur}
              aria-label="Glass blur amount"
              onChange={(e) => setBlur(+e.target.value)}
            />
          </div>
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="sparkle" size={14} />
              </span>
              <div>
                <div className="set-name">Reduce motion</div>
                <div className="set-desc">Pauses orbs, rain &amp; drift</div>
              </div>
            </div>
            <button className={"switch" + (prefs.reduceMotion ? " on" : "")} role="switch" aria-checked={prefs.reduceMotion} aria-label="Reduce motion" onClick={() => setReduceMotion(!prefs.reduceMotion)}>
              <i />
            </button>
          </div>
        </div>
      </div>

      <div className="g-title">Demo data</div>
      <div className="set-group glass">
        <div className="g-pad">
          <div className="set-row">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="alert" size={14} />
              </span>
              <div>
                <div className="set-name">Simulate connection error</div>
                <div className="set-desc">Next refresh shows the error state</div>
              </div>
            </div>
            <button className={"switch" + (prefs.simError ? " on" : "")} role="switch" aria-checked={prefs.simError} aria-label="Simulate connection error" onClick={() => setSimError(!prefs.simError)}>
              <i />
            </button>
          </div>
          <div className="set-row block">
            <div className="set-label">
              <span className="sr-ic">
                <UiIcon name="trash" size={14} />
              </span>
              <div>
                <div className="set-name">Reset prototype</div>
                <div className="set-desc">Restores favorites &amp; all preferences</div>
              </div>
            </div>
            <button className="reset-btn" onClick={resetAll}>
              Reset everything
            </button>
          </div>
        </div>
      </div>

      <div className="about-card glass rim">
        <span className="a-logo">
          <WxIcon code="partly" isDay size={28} />
        </span>
        <span>
          <b>Aurora Weather</b>
          <span>
            Glassmorphism concept prototype · React + proto-kit
            <br />
            All data is simulated for demonstration.
          </span>
        </span>
        <span className="version">v3.0</span>
      </div>
    </>
  );
}
