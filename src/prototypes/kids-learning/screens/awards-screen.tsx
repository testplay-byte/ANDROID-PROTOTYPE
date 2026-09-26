"use client";

/**
 * kids-learning / screens / awards-screen — the badge shelf.
 *
 * 6 circular clay badges. Unlocked = puffy raised (--shadow-2) with the
 * primary tint; locked = pressed dough (--shadow-inset) + muted. Tapping
 * a badge opens a small sheet with its name + description.
 */
import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { BADGES, KID_NAME } from "../lib/data";
import type { Badge } from "../lib/types";
import { BadgeIcon } from "../components/badge-icon";
import styles from "./awards-screen.module.css";

interface AwardsScreenProps {
  active: boolean;
  /** Total stars earned across all subjects. */
  totalStars: number;
}

export function AwardsScreen({ active, totalStars }: AwardsScreenProps) {
  const [selected, setSelected] = useState<Badge | null>(null);
  const unlockedCount = BADGES.filter((b) => totalStars >= b.threshold).length;

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="awards"
      aria-label="Awards"
      aria-hidden={!active}
    >
      <TopBar
        variant="hero"
        title="TROPHY SHELF"
        subtitle={`${unlockedCount} OF ${BADGES.length} UNLOCKED`}
      />
      <div className={styles.content}>
        <p className={styles.intro}>
          Earn stars in every game to unlock shiny badges!
        </p>
        <div className={styles.shelf}>
          {BADGES.map((badge) => {
            const unlocked = totalStars >= badge.threshold;
            return (
              <button
                key={badge.id}
                type="button"
                className={`${styles.badge} ${unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                onClick={() => setSelected(badge)}
                aria-label={`${badge.name} — ${unlocked ? "unlocked" : `needs ${badge.threshold} stars`}`}
              >
                <BadgeIcon icon={badge.icon} size={30} />
                {!unlocked && (
                  <svg
                    className={styles.lockOverlay}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className={styles.totalCard}>
          <span className={styles.totalNumber}>{totalStars}</span>
          <span className={styles.totalLabel}>
            {KID_NAME}'s stars so far — keep going!
          </span>
        </div>
      </div>

      {/* Small badge sheet */}
      <div
        className={`${styles.sheetBackdrop} ${selected ? styles.sheetBackdropShow : ""}`}
        onClick={() => setSelected(null)}
        aria-hidden={selected === null}
      >
        <div
          className={`${styles.sheet} ${selected ? styles.sheetShow : ""}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={selected ? `${selected.name} badge` : undefined}
        >
          {selected && (
            <>
              <span
                className={`${styles.sheetBadge} ${
                  totalStars >= selected.threshold
                    ? styles.badgeUnlocked
                    : styles.badgeLocked
                }`}
              >
                <BadgeIcon icon={selected.icon} size={34} />
              </span>
              <p className={styles.sheetName}>{selected.name}</p>
              <p className={styles.sheetDesc}>{selected.desc}</p>
              <p className={styles.sheetMeta}>
                {totalStars >= selected.threshold
                  ? "Unlocked!"
                  : `${selected.threshold - totalStars} more ${
                      selected.threshold - totalStars === 1 ? "star" : "stars"
                    } to go`}
              </p>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
