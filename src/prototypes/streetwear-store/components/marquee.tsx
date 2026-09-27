"use client";

/**
 * Marquee — infinite brutalist ticker strip.
 * Items repeat twice for a seamless CSS translateX loop; ink border
 * top+bottom so it reads as a slab band welded into the chrome.
 * variant "ink" = yellow block, "paper" = bg block, "flame" = orange-red.
 */

import styles from "./marquee.module.css";

export type MarqueeVariant = "ink" | "paper" | "flame";

const VARIANT_CLASS: Record<MarqueeVariant, string> = {
  ink: styles.variantInk,
  paper: styles.variantPaper,
  flame: styles.variantFlame,
};

export function Marquee({
  items,
  variant = "ink",
}: {
  items: string[];
  variant?: MarqueeVariant;
}) {
  // One visual sequence; duplicated in the DOM for the seamless loop.
  const seq = (
    <span className={styles.sequence}>
      {items.map((item, i) => (
        <span key={i} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden="true" />
        </span>
      ))}
    </span>
  );
  return (
    <div
      className={`${styles.root} ${VARIANT_CLASS[variant]}`}
      aria-label={items.join(" — ")}
    >
      <div className={styles.track}>
        {seq}
        {seq}
      </div>
    </div>
  );
}
