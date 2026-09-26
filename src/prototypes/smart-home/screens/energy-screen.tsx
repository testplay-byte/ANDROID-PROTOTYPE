"use client";

/**
 * smart-home / screens / energy-screen — today/week segmented control,
 * usage bar chart (peak day in primary orange), "usage this week" big
 * number, and per-device usage rows with proportional bars.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import {
  TODAY_USAGE,
  WEEK_USAGE,
  DEVICE_USAGE,
  weekTotal,
  peakIndex,
  maxUsage,
} from "../lib/data";
import styles from "./energy-screen.module.css";

type Range = "today" | "week";

export function EnergyScreen() {
  const [range, setRange] = useState<Range>("week");

  const points = range === "week" ? WEEK_USAGE : TODAY_USAGE;
  const max = maxUsage(points);
  const peak = peakIndex(points);
  const total = range === "week" ? weekTotal(WEEK_USAGE) : weekTotal(TODAY_USAGE);
  const deviceMax = DEVICE_USAGE.reduce((m, d) => Math.max(m, d.kwh), 0);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Energy" subtitle="Track usage and cut waste" />

      <div className={styles.content}>
        {/* Big number card */}
        <section className={styles.totalCard}>
          <span className={styles.totalLabel}>
            {range === "week" ? "Usage this week" : "Usage today"}
          </span>
          <span className={styles.totalValue}>
            {total.toFixed(1)}
            <span className={styles.totalUnit}> kWh</span>
          </span>
          <span className={styles.totalDelta}>
            {range === "week" ? "-6.2% vs last week" : "Peak 6–9 pm"}
          </span>
        </section>

        {/* Segmented control */}
        <div className={styles.segmented} role="tablist" aria-label="Usage range">
          <button
            type="button"
            role="tab"
            aria-selected={range === "today"}
            className={`${styles.segment} ${range === "today" ? styles.segmentActive : ""}`}
            onClick={() => setRange("today")}
          >
            Today
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={range === "week"}
            className={`${styles.segment} ${range === "week" ? styles.segmentActive : ""}`}
            onClick={() => setRange("week")}
          >
            Week
          </button>
        </div>

        {/* Bar chart */}
        <section className={styles.chartCard} aria-label="Usage chart">
          <div className={styles.chart}>
            {points.map((p, i) => (
              <div key={p.label} className={styles.chartCol}>
                <span className={styles.chartVal}>{p.kwh}</span>
                <div
                  className={`${styles.bar} ${i === peak ? styles.barPeak : ""}`}
                  style={{ height: `${Math.max(6, Math.round((p.kwh / max) * 100))}%` }}
                />
                <span className={styles.barLabel}>{p.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Per-device usage */}
        <section className={styles.card} aria-label="Usage by device">
          <h2 className={styles.cardTitle}>By device</h2>
          {DEVICE_USAGE.map((d) => (
            <div key={d.id} className={styles.usageRow}>
              <span className={styles.usageName}>{d.name}</span>
              <div className={styles.usageTrack}>
                <div
                  className={styles.usageFill}
                  style={{ width: `${Math.round((d.kwh / deviceMax) * 100)}%` }}
                />
              </div>
              <span className={styles.usageKwh}>{d.kwh.toFixed(1)}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
