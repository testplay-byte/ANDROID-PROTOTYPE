"use client";

/**
 * IosNavBar — real iOS navigation bar with a large title.
 *
 * Expanded: 34px bold large title sits above the content (nothing centered).
 * Collapsed (scrolled past `threshold`): the large title slides away and the
 * 17px semibold inline title fades in, centered in a 44px blurred bar with a
 * hairline bottom border — the standard iOS collapse-to-inline behavior.
 *
 * The parent wires the collapse: give the hook's `ref` to the scrollable
 * content element and pass the resulting `collapsed` boolean down.
 *
 * `inlineOnly` forces the compact centered bar (detail/pushed screens).
 */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./ios-nav-bar.module.css";

/** Observe the scrollable content element; true once it scrolls past `threshold`. */
export function useIosCollapse(threshold = 40) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setCollapsed(el.scrollTop > threshold);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { ref, collapsed };
}

export function IosNavBar({
  title,
  leading,
  trailing,
  collapsed = false,
  inlineOnly = false,
}: {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Content has scrolled past the threshold → collapse to inline title. */
  collapsed?: boolean;
  /** Never show the large title (pushed detail screens). */
  inlineOnly?: boolean;
}) {
  const isCollapsed = collapsed || inlineOnly;
  return (
    <header
      className={`${styles.navbar} ${isCollapsed ? styles.collapsed : ""} ${
        inlineOnly ? styles.inlineOnly : ""
      }`}
    >
      <div className={styles.inlineRow}>
        <div className={styles.side}>{leading}</div>
        <span className={styles.inlineTitle} aria-hidden={!isCollapsed}>
          {title}
        </span>
        <div className={styles.sideRight}>{trailing}</div>
      </div>
      <div className={styles.largeRow}>
        <h1 className={styles.largeTitle}>{title}</h1>
      </div>
    </header>
  );
}
