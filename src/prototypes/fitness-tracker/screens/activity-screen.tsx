"use client";

/**
 * fitness-tracker / screens / activity-screen — three activity rings
 * (move/exercise/stand), a weekly day selector (M T W T F S S pills),
 * and iOS grouped stat cards: steps, heart rate, distance.
 */

import { useState } from "react";
import { WEEK_ACTIVITY } from "../lib/data";
import { ActivityRings } from "../components/activity-rings";
import { Group, Row, SectionLabel } from "../components/grouped-list";
import { IosNavBar, useIosCollapse } from "../components/ios-nav-bar";
import styles from "./activity-screen.module.css";

export function ActivityScreen() {
  const [dayIndex, setDayIndex] = useState(6);
  const day = WEEK_ACTIVITY[dayIndex];
  const { ref, collapsed } = useIosCollapse();

  return (
    <div className={styles.root}>
      <IosNavBar
        title="Activity"
        collapsed={collapsed}
        trailing={
          <button type="button" className={styles.shareBtn} aria-label="Share activity">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="m7 8 5-5 5 5" />
              <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
          </button>
        }
      />

      <div className={styles.content} ref={ref}>
        {/* Rings + summary */}
        <section className={styles.ringsCard}>
          <div className={styles.ringsWrap}>
            <ActivityRings values={day} />
          </div>
          <div className={styles.ringStats}>
            <div className={styles.ringStat}>
              <span className={styles.ringDot} style={{ background: "var(--color-primary)" }} />
              <span className={styles.ringValue}>{day.move}<span className={styles.ringGoal}>/{day.moveGoal}kcal</span></span>
            </div>
            <div className={styles.ringStat}>
              <span className={styles.ringDot} style={{ background: "var(--color-success)" }} />
              <span className={styles.ringValue}>{day.exercise}<span className={styles.ringGoal}>/{day.exerciseGoal}min</span></span>
            </div>
            <div className={styles.ringStat}>
              <span className={styles.ringDot} style={{ background: "var(--color-warn)" }} />
              <span className={styles.ringValue}>{day.stand}<span className={styles.ringGoal}>/{day.standGoal}hrs</span></span>
            </div>
          </div>
        </section>

        {/* Weekly day selector */}
        <div className={styles.weekRow} role="tablist" aria-label="Pick a day">
          {WEEK_ACTIVITY.map((d, i) => (
            <button
              key={d.name}
              type="button"
              role="tab"
              aria-selected={i === dayIndex}
              className={`${styles.dayPill} ${i === dayIndex ? styles.dayPillActive : ""}`}
              onClick={() => setDayIndex(i)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className={styles.dayName}>{day.name}</p>

        {/* Stat cards */}
        <SectionLabel>Today&rsquo;s stats</SectionLabel>
        <Group>
          <Row
            icon={<StepsIcon />}
            iconClassName={styles.tintBlue}
            title="Steps"
            subtitle="Daily goal 10,000"
            value={day.steps.toLocaleString()}
          />
          <Row
            icon={<HeartIcon />}
            iconClassName={styles.tintRed}
            title="Heart rate"
            subtitle="Resting average"
            value={`${day.heartRate} bpm`}
          />
          <Row
            icon={<RouteIcon />}
            iconClassName={styles.tintGreen}
            title="Distance"
            subtitle="Walking + running"
            value={`${day.distance} km`}
            last
          />
        </Group>
      </div>
    </div>
  );
}

function StepsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3c-1.5 1.5-2 4-2 6.5S7 14 8.5 14s2.5-2 2.5-4.5S9.5 4.5 8 3z" />
      <path d="M6 17.5c0 1.5 1 3.5 2.5 3.5s2.5-2 2.5-3.5" />
      <path d="M16.5 6c1.5 1 2.5 3 3 5s.5 4-1 4.5-2.5-1.5-3-3.5.5-5 1-6z" />
      <path d="M15.5 18.5c.2 1.2 1 2.5 2 2.5s1.8-1.3 2-2.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M15.5 5H10a4 4 0 0 0 0 8h4a4 4 0 0 1 0 8H8.5" />
    </svg>
  );
}
