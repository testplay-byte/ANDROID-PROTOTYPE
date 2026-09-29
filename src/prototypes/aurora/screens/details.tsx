"use client";

/**
 * aurora / screens / details — the detail region.
 *
 * Desktop-only content: a 14×9 radar field with range rings and a sweep, a
 * sun/moon arc with the marker at the city's pinned local time, and a real
 * multi-metric grid (wind compass, humidity, feels-like, ambience mix).
 *
 * Layout: radar + sun stacked in the wide column, a 2-up metric grid in the
 * side column on desktop. At tablet width the outer grid collapses to ONE
 * column and the metrics stay 2-up; below 760px they go single file.
 */

import type { CSSProperties } from "react";
import {
  RADAR,
  RADAR_COLS,
  RADAR_LEGEND,
  RADAR_ROWS,
  ambienceById,
  formatTemp,
  sunTrack,
} from "../data";
import { useAurora } from "../state/aurora-context";
import {
  AmbienceIcon,
  CompassIcon,
  DropletIcon,
  EyeIcon,
  GaugeIcon,
  LayersIcon,
  MoonIcon,
  SparkIcon,
  SunIcon,
} from "../components/icons";

export function DetailsScreen() {
  const { active, unit, ambience, setAmbience, notify } = useAurora();
  const city = active;
  const { marks, progress } = sunTrack(city);
  const scene = ambienceById(ambience);

  /*
    Position on the quadratic arc the SVG draws: Q from (2,86) via (50,-6)
    to (98,86). Deterministic maths on the city's pinned local time — the
    marker never samples a live clock.
  */
  const t = progress;
  const sunX = (1 - t) ** 2 * 2 + 2 * (1 - t) * t * 50 + t ** 2 * 98;
  const sunY = (1 - t) ** 2 * 86 + 2 * (1 - t) * t * -6 + t ** 2 * 86;
  const sunStyle = { "--sun-x": `${sunX}%`, "--sun-y": `${sunY}%` } as CSSProperties;

  return (
    <div className="aur-view">
      <div className="aur-details">
        {/* ---------------- wide column ---------------- */}
        <div className="aur-details__col">
          <section className="aur-panel aur-radar">
            <header className="aur-panel__head">
              <div>
                <h2>Precipitation radar</h2>
                <p>
                  {RADAR_COLS}×{RADAR_ROWS} field · 60 km north-west of {city.name}
                </p>
              </div>
              <span className="aur-chip aur-chip--accent">
                <SparkIcon size={12} /> Live
              </span>
            </header>

            <div className="aur-radar__grid">
              {RADAR.map((cell) => (
                <span
                  key={`${cell.col}-${cell.row}`}
                  className="aur-cell"
                  data-level={cell.level}
                />
              ))}
              <span className="aur-radar__rings" aria-hidden="true" />
              <span className="aur-radar__sweep" aria-hidden="true" />
            </div>

            <div className="aur-radar__legend">
              {RADAR_LEGEND.map((label, i) => (
                <span className="aur-radar__key" key={label}>
                  <span className="aur-radar__swatch" data-level={i} />
                  {label}
                </span>
              ))}
              <span className="aur-radar__key">mm/h · 5-minute steps</span>
            </div>
          </section>

          <section className="aur-panel aur-sun">
            <header className="aur-panel__head">
              <div>
                <h2>Sun &amp; moon</h2>
                <p>
                  The marker sits at {city.time} local — the whole track is derived, never sampled
                  from a live clock
                </p>
              </div>
              <span className="aur-panel__meta">{city.daylight} of daylight</span>
            </header>

            <div className="aur-sun__track" style={sunStyle}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="aur-sun__horizon" d="M0 86H100" />
                <path className="aur-sun__arc" d="M2 86 Q 50 -6 98 86" />
                <path
                  className="aur-sun__arc--lit"
                  d="M2 86 Q 50 -6 98 86"
                  pathLength={1}
                  strokeDasharray={`${progress} 1`}
                />
              </svg>
              <span className="aur-sun__mark" aria-hidden="true">
                <SunIcon size={15} />
              </span>
            </div>

            <div className="aur-sun__scale">
              {marks.map((m) => (
                <span key={`${m.label}-${m.note}`} title={m.note}>
                  {m.label}
                </span>
              ))}
            </div>

            <div className="aur-sun__facts">
              <div>
                <span>Sunrise</span>
                <b className="tnum">{city.sunrise}</b>
              </div>
              <div>
                <span>Sunset</span>
                <b className="tnum">{city.sunset}</b>
              </div>
              <div>
                <span>Moonrise</span>
                <b className="tnum">{city.moonrise}</b>
              </div>
              <div>
                <span>Moon phase</span>
                <b>{city.moonPhase}</b>
              </div>
              <div>
                <span>Illumination</span>
                <b className="tnum">{city.moonIllum}%</b>
              </div>
              <div>
                <span>UV index</span>
                <b className="tnum">
                  {city.uvIndex} · {city.uvLabel}
                </b>
              </div>
            </div>
          </section>
        </div>

        {/* ---------------- the multi-metric grid ---------------- */}
        <div className="aur-details__col">
          <div className="aur-metrics">
            <section className="aur-panel aur-metric">
              <header className="aur-metric__head">
                <span className="aur-metric__icon">
                  <CompassIcon size={16} />
                </span>
                <h3>Wind</h3>
                <span className="aur-panel__meta aur-spacer">{city.windLabel}</span>
              </header>
              <div className="aur-compass">
                <span data-c="N">N</span>
                <span data-c="E">E</span>
                <span data-c="S">S</span>
                <span data-c="W">W</span>
                <span
                  className="aur-compass__needle"
                  style={{ "--needle": `${city.windDeg}deg` } as CSSProperties}
                />
                <span className="aur-compass__hub" />
              </div>
              <p className="aur-metric__val tnum">
                {city.windKph}
                <small>km/h sustained</small>
              </p>
              <dl className="aur-facts">
                <div>
                  <dt>Gusts</dt>
                  <dd>{city.windGustKph} km/h</dd>
                </div>
                <div>
                  <dt>Bearing</dt>
                  <dd>{city.windDeg}°</dd>
                </div>
                <div>
                  <dt>Pressure</dt>
                  <dd>{city.pressureKpa} kPa</dd>
                </div>
              </dl>
            </section>

            <section className="aur-panel aur-metric" data-tone="good">
              <header className="aur-metric__head">
                <span className="aur-metric__icon">
                  <DropletIcon size={16} />
                </span>
                <h3>Humidity</h3>
              </header>
              <p className="aur-metric__val tnum">
                {city.humidity}
                <small>% relative</small>
              </p>
              <div className="aur-meter" data-tone="good">
                <i style={{ width: `${city.humidity}%` }} />
              </div>
              <dl className="aur-facts">
                <div>
                  <dt>Dew point</dt>
                  <dd>{formatTemp(city.dewPointC, unit)}</dd>
                </div>
                <div>
                  <dt>Cloud cover</dt>
                  <dd>{city.cloudCover}%</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{city.visibilityKm} km</dd>
                </div>
              </dl>
            </section>

            <section className="aur-panel aur-metric aur-metric--wide">
              <header className="aur-metric__head">
                <span className="aur-metric__icon">
                  <EyeIcon size={16} />
                </span>
                <h3>Feels like</h3>
              </header>
              <p className="aur-metric__val tnum">
                {formatTemp(city.feelsC, unit)}
                <small>actual {formatTemp(city.tempC, unit)}</small>
              </p>
              <p className="aur-metric__sub">
                Apparent temperature folds in wind chill above 5 km/h and humidity — a{" "}
                {city.windKph} km/h {city.windLabel} flow at {city.humidity}% humidity explains the
                gap.
              </p>
            </section>

            <section className="aur-panel aur-metric aur-metric--wide">
              <header className="aur-metric__head">
                <span className="aur-metric__icon">
                  <GaugeIcon size={16} />
                </span>
                <h3>Ambience mix</h3>
                <span className="aur-panel__meta aur-spacer">{scene.label}</span>
              </header>
              <div className="aur-layers aur-flush">
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
              <p className="aur-metric__sub">
                <LayersIcon size={12} /> {scene.hint} — the ambient scene behind the glass
                repaints when you change it.
              </p>
              <div className="aur-field__row aur-gap-top">
                <button
                  className="aur-btn"
                  type="button"
                  onClick={() => {
                    setAmbience(city.ambience);
                    notify(`Ambience set to ${ambienceById(city.ambience).label}`);
                  }}
                >
                  <AmbienceIcon size={14} /> Match {city.name}
                </button>
                <span className="aur-spacer">
                  <MoonIcon size={15} />
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
