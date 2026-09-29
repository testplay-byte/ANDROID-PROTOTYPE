"use client";

/**
 * aurora / screens / now — current conditions.
 *
 * The desktop Now view is not a phone weather card widened out: it is a hero
 * panel beside a column of metric cards, a 24-slot hourly strip that fits the
 * window as a grid, and a 7-day list with a temperature-range bar. At tablet
 * width the SAME markup rearranges — one column, metrics 2-up, hourly strip
 * turned into a scrolling rail (see §8 of aurora.css).
 */

import {
  CONDITIONS,
  HOURLY,
  WEEK,
  formatTemp,
  toUnit,
  UNIT_LABEL,
  ambienceById,
} from "../data";
import { useAurora } from "../state/aurora-context";
import {
  AmbienceIcon,
  ConditionIcon,
  DropletIcon,
  EyeIcon,
  LeafIcon,
  MoonIcon,
  SunIcon,
} from "../components/icons";

/** The 24-hour temperature curve behind the hero. */
function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map(
    (v, i) => `${((i / (values.length - 1)) * 100).toFixed(2)},${(94 - ((v - min) / span) * 84).toFixed(2)}`
  );
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,100 ${pts.join(" ")} 100,100`} className="aur-hero__area" />
      <polyline points={pts.join(" ")} className="aur-hero__line" />
    </svg>
  );
}

export function NowScreen() {
  const { active, unit, go, ambience, setAmbience, notify } = useAurora();
  const city = active;
  const hours = HOURLY[city.id];
  const week = WEEK[city.id];
  const nowHour = Number(city.time.slice(0, 2));
  const nowIndex = hours.findIndex((h) => h.hour === nowHour);
  const scene = ambienceById(ambience);

  const lows = week.map((d) => d.lowC);
  const highs = week.map((d) => d.highC);
  const weekMin = Math.min(...lows);
  const weekMax = Math.max(...highs);
  const weekSpan = weekMax - weekMin || 1;

  const aqiPct = Math.min(100, (city.aqi / 200) * 100);
  const aqiTone = city.aqi <= 50 ? "good" : city.aqi <= 100 ? "warn" : "bad";
  const precipTone = city.precipChance > 60 ? "warn" : "good";

  return (
    <div className="aur-view aur-now">
      <div className="aur-now__grid">
        {/* ---- hero ---- */}
        <section className="aur-panel aur-hero">
          <div className="aur-hero__top">
            <div className="aur-hero__place">
              <span className="aur-hero__city">{city.name}</span>
              <span className="aur-hero__where">
                {city.region}, {city.country} · {city.offset}
              </span>
            </div>
            <span className="aur-hero__clock tnum">
              {city.time} local · updated 6 min ago
            </span>
          </div>

          <div className="aur-hero__read">
            <div>
              <div className="aur-hero__num tnum">{Math.round(toUnit(city.tempC, unit))}</div>
              <div className="aur-hero__deg">{UNIT_LABEL[unit]}</div>
            </div>
            <div className="aur-hero__cond">
              <span className="aur-hero__condicon" data-tone={CONDITIONS[city.condition].tone}>
                <ConditionIcon id={city.condition} size={34} strokeWidth={1.5} />
              </span>
              <div>
                <b>{CONDITIONS[city.condition].label}</b>
                <span>{city.summary}</span>
              </div>
            </div>
          </div>

          <div className="aur-hero__spark">
            <Sparkline values={hours.map((h) => h.tempC)} />
          </div>

          <div className="aur-hero__stats">
            <div className="aur-hero__stat">
              <span>Feels like</span>
              <b>{formatTemp(city.feelsC, unit)}</b>
            </div>
            <div className="aur-hero__stat">
              <span>High / low</span>
              <b>
                {formatTemp(city.highC, unit)} / {formatTemp(city.lowC, unit)}
              </b>
            </div>
            <div className="aur-hero__stat">
              <span>Humidity</span>
              <b>{city.humidity}%</b>
            </div>
            <div className="aur-hero__stat">
              <span>Wind {city.windLabel}</span>
              <b>{city.windKph} km/h</b>
            </div>
          </div>

          <div className="aur-hero__tags">
            <span className="aur-chip aur-chip--accent">
              <AmbienceIcon size={13} />
              {scene.label}
            </span>
            <span className="aur-chip">
              <SunIcon size={13} /> {city.uvLabel} UV
            </span>
            <span className="aur-chip">
              <MoonIcon size={13} /> {city.moonPhase} {city.moonIllum}%
            </span>
            <button
              className="aur-btn aur-btn--ghost"
              type="button"
              onClick={() => {
                setAmbience(city.ambience);
                notify(`Ambience set to ${ambienceById(city.ambience).label}`);
              }}
            >
              Match this city
            </button>
          </div>
        </section>

        {/* ---- the metric column: two stacked cards beside the hero ---- */}
        <div className="aur-now__side">
          <section className="aur-panel aur-metric" data-tone={precipTone}>
            <header className="aur-metric__head">
              <span className="aur-metric__icon">
                <DropletIcon size={16} />
              </span>
              <h3>Precipitation</h3>
            </header>
            <p className="aur-metric__val tnum">
              {city.precipChance}%
              <small>next hour</small>
            </p>
            <div className="aur-meter" data-tone={precipTone}>
              <i style={{ width: `${city.precipChance}%` }} />
            </div>
            <div className="aur-scale">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <p className="aur-metric__sub">
              {city.precipMm} mm in the last hour · {city.pressureKpa} kPa pressure
            </p>
          </section>

          <section className="aur-panel aur-metric" data-tone={aqiTone}>
            <header className="aur-metric__head">
              <span className="aur-metric__icon">
                <LeafIcon size={16} />
              </span>
              <h3>Air quality</h3>
            </header>
            <p className="aur-metric__val tnum">
              {city.aqi}
              <small>AQI · {city.aqiLabel}</small>
            </p>
            <div className="aur-meter" data-tone={aqiTone}>
              <i style={{ width: `${aqiPct}%` }} />
            </div>
            <div className="aur-scale">
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy</span>
            </div>
            <p className="aur-metric__sub">
              PM2.5 {Math.round(city.aqi * 0.42)} µg/m³ · visibility {city.visibilityKm} km
            </p>
          </section>

          <section className="aur-panel aur-metric" data-tone="good">
            <header className="aur-metric__head">
              <span className="aur-metric__icon">
                <EyeIcon size={16} />
              </span>
              <h3>Sun &amp; daylight</h3>
            </header>
            <p className="aur-metric__val tnum">
              {city.sunrise}
              <small>rise → {city.sunset}</small>
            </p>
            <p className="aur-metric__sub">
              {city.daylight} of daylight · UV index {city.uvIndex} ({city.uvLabel.toLowerCase()})
            </p>
          </section>
        </div>
      </div>

      {/* ---- hourly strip ---- */}
      <section className="aur-panel aur-hours">
        <header className="aur-panel__head">
          <h3>Next 24 hours</h3>
          <span className="aur-panel__meta">
            Temperature, condition and chance of rain per hour
          </span>
        </header>
        <div className="aur-hours__track">
          {hours.map((h, i) => (
            <div
              className="aur-hour"
              key={`${city.id}-h${i}`}
              data-now={i === nowIndex ? "" : undefined}
              data-day={h.isDay ? "day" : "night"}
              title={`${h.label} · ${formatTemp(h.tempC, unit)} · ${CONDITIONS[h.condition].label}`}
            >
              <span className="aur-hour__t">{h.label.slice(0, 2)}</span>
              <ConditionIcon id={h.condition} size={16} strokeWidth={1.6} />
              <span className="aur-hour__temp">{formatTemp(h.tempC, unit)}</span>
              <span className="aur-hour__p">{h.precip}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 7-day ---- */}
      <section className="aur-panel aur-week">
        <header className="aur-panel__head">
          <h3>7-day outlook</h3>
          <button className="aur-btn aur-btn--ghost" type="button" onClick={() => go("cities")}>
            Manage cities
          </button>
        </header>
        {week.map((d) => (
          <div className="aur-week__row" key={d.key} data-today={d.isToday ? "" : undefined}>
            <span className="aur-week__day">
              <b>{d.day}</b>
              <span>{d.date}</span>
            </span>
            <span className="aur-week__icon">
              <ConditionIcon id={d.condition} size={18} strokeWidth={1.6} />
            </span>
            <span className="aur-week__p tnum">{d.precip}%</span>
            <span className="aur-week__lo tnum">{formatTemp(d.lowC, unit)}</span>
            <span className="aur-week__bar">
              <i
                style={{
                  left: `${((d.lowC - weekMin) / weekSpan) * 100}%`,
                  width: `${((d.highC - d.lowC) / weekSpan) * 100}%`,
                }}
              />
            </span>
            <span className="aur-week__hi tnum">{formatTemp(d.highC, unit)}</span>
          </div>
        ))}
        <p className="aur-week__foot">
          <span className="aur-week__legend">
            <span className="aur-radar__swatch" data-level="3" />
            range across the week
          </span>
          <span>
            Hottest {formatTemp(weekMax, unit)} · coldest {formatTemp(weekMin, unit)}
          </span>
        </p>
      </section>
    </div>
  );
}
