"use client";

/**
 * Today screen — current conditions for the active city.
 *
 * Big 72px temperature over the ambient blobs, condition icon + text,
 * a "feels like" chip, a horizontally scrolling glass hourly strip
 * (8 hours) and a 2×2 grid of glass detail tiles (humidity / wind /
 * UV / pressure). All temps are converted via the shared unit helpers.
 */

import { TopBar } from "../../../proto-kit";
import {
  formatTemp,
  type CityWeather,
  type Unit,
} from "../lib/weather";
import {
  ConditionIcon,
  DropletIcon,
  WindIcon,
  UvIcon,
  GaugeIcon,
  MapPinIcon,
  ThermometerIcon,
} from "../components/icons";
import styles from "./today-screen.module.css";

export interface TodayScreenProps {
  city: CityWeather;
  unit: Unit;
}

export function TodayScreen({ city, unit }: TodayScreenProps) {
  return (
    <div className={styles.root}>
      <TopBar
        variant="center"
        title={`${city.name}, ${city.country}`}
        leading={<MapPinIcon size={18} />}
      />

      <div className={styles.content}>
        {/* Hero — big temperature + condition */}
        <section className={styles.hero}>
          <span className={styles.heroIcon}>
            <ConditionIcon condition={city.condition} size={76} />
          </span>
          <span className={styles.heroTemp}>{formatTemp(city.tempC, unit)}</span>
          <span className={styles.heroDesc}>{city.description}</span>
          <span className={styles.feelsChip}>
            <ThermometerIcon size={14} />
            Feels like {formatTemp(city.feelsLikeC, unit)}
          </span>
          <span className={styles.heroHiLo}>
            H {formatTemp(city.hiC, unit)} · L {formatTemp(city.loC, unit)}
          </span>
        </section>

        {/* Hourly strip — horizontal scroll, 8 glass cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Hourly</h2>
          <div className={`${styles.hourlyStrip} strip`} role="list">
            {city.hourly.map((h, i) => (
              <div
                key={`${h.hour}-${i}`}
                role="listitem"
                className={`${styles.hourCard} stagger`}
                style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
              >
                <span className={styles.hourLabel}>{h.hour}</span>
                <span className={styles.hourIcon}>
                  <ConditionIcon condition={h.condition} size={22} />
                </span>
                <span className={styles.hourTemp}>{formatTemp(h.tempC, unit)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Details grid — glass tiles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <div className={styles.detailsGrid}>
            <div className={`${styles.tile} stagger`} style={{ ["--stagger-i" as string]: 0 } as React.CSSProperties}>
              <span className={styles.tileIcon}><DropletIcon size={20} /></span>
              <span className={styles.tileLabel}>Humidity</span>
              <span className={styles.tileValue}>{city.humidity}%</span>
            </div>
            <div className={`${styles.tile} stagger`} style={{ ["--stagger-i" as string]: 1 } as React.CSSProperties}>
              <span className={styles.tileIcon}><WindIcon size={20} /></span>
              <span className={styles.tileLabel}>Wind</span>
              <span className={styles.tileValue}>{city.windKph} km/h</span>
            </div>
            <div className={`${styles.tile} stagger`} style={{ ["--stagger-i" as string]: 2 } as React.CSSProperties}>
              <span className={styles.tileIcon}><UvIcon size={20} /></span>
              <span className={styles.tileLabel}>UV index</span>
              <span className={styles.tileValue}>{city.uv}</span>
            </div>
            <div className={`${styles.tile} stagger`} style={{ ["--stagger-i" as string]: 3 } as React.CSSProperties}>
              <span className={styles.tileIcon}><GaugeIcon size={20} /></span>
              <span className={styles.tileLabel}>Pressure</span>
              <span className={styles.tileValue}>{city.pressure} hPa</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
