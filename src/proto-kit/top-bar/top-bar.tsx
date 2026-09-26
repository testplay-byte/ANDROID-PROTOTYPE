"use client";

import type { ReactNode } from "react";
import styles from "./top-bar.module.css";

export type TopBarVariant = "large" | "center" | "inline" | "hero";

export interface TopBarProps {
  /** Screen title. */
  title: string;
  /** Optional secondary line (large/inline/hero variants). */
  subtitle?: string;
  /** Visual variant. Default "large". See docs/design-languages/. */
  variant?: TopBarVariant;
  /** Left slot (back button, avatar, ...). Used by the center variant. */
  leading?: ReactNode;
  /** Right slot / actions (icon buttons). */
  trailing?: ReactNode;
}

/**
 * TopBar — multi-variant top app bar.
 *
 * Reads the style tokens, so it automatically adapts to the active design
 * language (data-style on .device). Presentational: the parent owns any
 * state and passes icon buttons via `leading`/`trailing`.
 *
 * - large:  big left-aligned title + optional subtitle (M3, bento, minimal).
 * - center: centered title with leading/trailing slots (HIG, glass).
 * - inline: compact enterprise row (carbon, flat).
 * - hero:   oversized uppercase display title (brutalism, bauhaus, clay).
 */
export function TopBar({ title, subtitle, variant = "large", leading, trailing }: TopBarProps) {
  if (variant === "center") {
    return (
      <header className={`${styles.topbar} ${styles.center}`}>
        <div className={styles.leading}>{leading}</div>
        <h1 className={styles.centerTitle}>{title}</h1>
        <div className={styles.trailing}>{trailing}</div>
      </header>
    );
  }

  if (variant === "inline") {
    return (
      <header className={`${styles.topbar} ${styles.inline}`}>
        <div style={{ display: "flex", alignItems: "baseline", minWidth: 0 }}>
          <h1 className={styles.inlineTitle}>{title}</h1>
          {subtitle ? <span className={styles.inlineSubtitle}>{subtitle}</span> : null}
        </div>
        <div className={styles.actions}>{trailing}</div>
      </header>
    );
  }

  if (variant === "hero") {
    return (
      <header className={`${styles.topbar} ${styles.hero}`}>
        {subtitle ? <span className={styles.heroSubtitle}>{subtitle}</span> : null}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--sp-3)" }}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.actions}>{trailing}</div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${styles.topbar} ${styles.large}`}>
      <div style={{ minWidth: 0 }}>
        <h1 className={styles.largeTitle}>{title}</h1>
        {subtitle ? <p className={styles.largeSubtitle}>{subtitle}</p> : null}
      </div>
      <div className={styles.actions}>{trailing}</div>
    </header>
  );
}
