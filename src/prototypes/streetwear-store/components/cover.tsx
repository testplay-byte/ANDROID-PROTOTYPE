"use client";

/**
 * Cover + HeartIcon — shared brutalist cover art primitives.
 * Cover renders a flat tone block with hard geometric decorations
 * (diamond + bar), zero radius, ink inner border. Used by the shop
 * grid, product detail, and cart swatch at different sizes.
 */

import type { ReactNode } from "react";
import type { CoverTone } from "../lib/types";
import styles from "./cover.module.css";

export const TONE_CLASS: Record<CoverTone, string> = {
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  tertiary: styles.toneTertiary,
  success: styles.toneSuccess,
  surface: styles.toneSurface,
};

export function Cover({
  tone,
  className,
  children,
  plain = false,
}: {
  tone: CoverTone;
  /** Extra layout classes from the consuming screen (size, borders, ...). */
  className?: string;
  children?: ReactNode;
  /** Minimal art — for small swatches. */
  plain?: boolean;
}) {
  return (
    <div className={`${styles.cover} ${TONE_CLASS[tone]} ${className ?? ""}`}>
      {!plain ? (
        <>
          <span className={styles.diamond} aria-hidden="true" />
          <span className={styles.bar} aria-hidden="true" />
        </>
      ) : (
        <span className={styles.dot} aria-hidden="true" />
      )}
      {children}
    </div>
  );
}

/** Geometric heart — square joins, reads as a cut-paper sticker. */
export function HeartIcon({
  filled,
  size = 16,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M12 20 4 12V7h4l4 4 4-4h4v5Z" />
    </svg>
  );
}
