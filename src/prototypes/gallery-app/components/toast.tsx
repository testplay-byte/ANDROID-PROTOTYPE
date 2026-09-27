"use client";

/**
 * Toast — the gallery confirmation: an ink-bordered slab (no shadow) that
 * slides up above the nav hard-slab. A solid triad square marks the
 * message channel; uppercase wide-tracked text. Driven by gallery-context.
 */

import { useGallery } from "../state/gallery-context";
import styles from "./toast.module.css";

export function Toast() {
  const { toast } = useGallery();
  return (
    <div
      className={`${styles.toast} ${toast ? styles.show : ""}`}
      data-accent={toast?.accent ?? "red"}
      role="status"
      aria-live="polite"
    >
      <span className={styles.block} aria-hidden="true" />
      <span className={styles.msg}>{toast?.msg ?? ""}</span>
    </div>
  );
}
