"use client";

/**
 * Toast — brutalist announcement slab that pops above the bottom nav.
 * Parent-owned message state (see page.tsx); auto-dismisses via onDone.
 */

import { useEffect } from "react";
import styles from "./toast.module.css";

export function Toast({
  message,
  tone = "ink",
  onDone,
}: {
  message: string;
  tone?: "ink" | "flame";
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1900);
    return () => window.clearTimeout(t);
  }, [message, onDone]);

  return (
    <div
      className={`${styles.root} ${tone === "flame" ? styles.toneFlame : styles.toneInk}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        ▸
      </span>
      <span className={styles.text}>{message}</span>
    </div>
  );
}
