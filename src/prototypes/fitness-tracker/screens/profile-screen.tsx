"use client";

/**
 * fitness-tracker / screens / profile-screen — iOS grouped list:
 * profile header with initials avatar disc, stats grid
 * (streak / total workouts / minutes), achievement badges row.
 */

import { TopBar } from "../../../proto-kit";
import { PROFILE_STATS, ACHIEVEMENTS } from "../lib/data";
import { Group, Row, SectionLabel } from "../components/grouped-list";
import styles from "./profile-screen.module.css";

export function ProfileScreen() {
  return (
    <div className={styles.root}>
      <TopBar variant="center" title="Profile" />

      <div className={styles.content}>
        {/* Profile header */}
        <div className={styles.header}>
          <span className={styles.avatar} aria-hidden="true">AK</span>
          <div className={styles.headerInfo}>
            <span className={styles.name}>Alex Kim</span>
            <span className={styles.member}>Member since 2024</span>
          </div>
        </div>

        {/* Stats grid */}
        <SectionLabel>This year</SectionLabel>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{PROFILE_STATS.streak}</span>
            <span className={styles.statLabel}>day streak</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{PROFILE_STATS.totalWorkouts}</span>
            <span className={styles.statLabel}>workouts</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {(PROFILE_STATS.totalMinutes / 1000).toFixed(1)}k
            </span>
            <span className={styles.statLabel}>minutes</span>
          </div>
        </div>

        {/* Achievements */}
        <SectionLabel>Achievements</SectionLabel>
        <Group>
          <div className={styles.badges}>
            {ACHIEVEMENTS.map((a) => (
              <div key={a.id} className={styles.badge}>
                <span className={`${styles.badgeDisc} ${styles[a.tint]}`}>
                  <BadgeIcon />
                </span>
                <span className={styles.badgeName}>{a.name}</span>
              </div>
            ))}
          </div>
          <Row
            title="See all achievements"
            chevron
            last
            onClick={() => undefined}
          />
        </Group>

        {/* Details */}
        <SectionLabel>Details</SectionLabel>
        <Group>
          <Row
            icon={<UserIcon />}
            iconClassName={styles.tintBlue}
            title="Personal info"
            value="Alex"
            chevron
          />
          <Row
            icon={<ShieldIcon />}
            iconClassName={styles.tintGreen}
            title="Health permissions"
            value="On"
            chevron
            last
          />
        </Group>
      </div>
    </div>
  );
}

function BadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
