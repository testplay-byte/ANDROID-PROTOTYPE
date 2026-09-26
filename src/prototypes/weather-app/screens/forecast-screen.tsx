"use client";

/**
 * Forecast screen — 7-day glass list for the active city.
 * Each row: day label, condition icon, lo temp, range bar (lo→hi within
 * the week's span), hi temp. Range bar fill uses the primary→tertiary
 * gradient so warm days read longer/warmer.
 */

import { TopBar } from "../../../proto-kit";
import {
  formatTemp,
  toUnit,
  type CityWeather,
  type Unit,
} from "../lib/weather";
import { ConditionIcon, CalendarIcon } from "../components/icons";
import styles from "./forecast-screen.module.css";

export interface ForecastScreenProps {
  city: CityWeather;
  unit: Unit;
}

export function ForecastScreen({ city, unit }: ForecastScreenProps) {
  const weekLo = Math.min(...city.daily.map((d) => d.loC));
  const weekHi = Math.max(...city.daily.map((d) => d.hiC));
  const span = Math.max(1, weekHi - weekLo);

  return (
    <div className={styles.root}>
      <TopBar
        variant="center"
        title={`${city.daily.length}-Day Forecast`}
        leading={<CalendarIcon size={18} />}
      />

      <div className={styles.content}>
        <p className={styles.cityNote}>
          {city.name} · H {formatTemp(city.hiC, unit)} / L {formatTemp(city.loC, unit)} today
        </p>

        <div className={styles.list}>
          {city.daily.map((d, i) => {
            const leftPct = ((d.loC - weekLo) / span) * 100;
            const widthPct = Math.max(6, ((d.hiC - d.loC) / span) * 100);
            return (
              <div
                key={d.day}
                className={`${styles.row} stagger`}
                style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
              >
                <span className={styles.day}>{d.day}</span>
                <span className={styles.icon}>
                  <ConditionIcon condition={d.condition} size={22} />
                </span>
                <span className={styles.lo}>{formatTemp(d.loC, unit)}</span>
                <span className={styles.barTrack}>
                  <span
                    className={styles.barFill}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </span>
                <span className={styles.hi}>{formatTemp(d.hiC, unit)}</span>
              </div>
            );
          })}
        </div>

        <p className={styles.rangeNote}>
          Week range {formatTemp(weekLo, unit)} – {formatTemp(weekHi, unit)} ({unit.toUpperCase()})
          · scale {toUnit(span, unit)}°
        </p>
      </div>
    </div>
  );
}
