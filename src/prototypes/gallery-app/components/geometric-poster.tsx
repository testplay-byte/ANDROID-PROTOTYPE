/**
 * GeometricPoster — exhibition feature-card artwork built from PURE CSS
 * GEOMETRY (no images): solid triad blocks, quarter-circles, triangles and
 * bars on a bordered field — the bauhaus poster look.
 */

import styles from "./geometric-poster.module.css";

export function GeometricPoster({ poster }: { poster: "posterA" | "posterB" }) {
  if (poster === "posterB") {
    return (
      <div className={`${styles.field} ${styles.fieldB}`} aria-hidden="true">
        <span className={`${styles.tri} ${styles.triYellow}`} />
        <span className={`${styles.disc} ${styles.discBlue}`} />
        <span className={`${styles.bar} ${styles.barRed}`} />
        <span className={styles.inkLine} />
      </div>
    );
  }

  return (
    <div className={styles.field} aria-hidden="true">
      <span className={`${styles.disc} ${styles.discRed}`} />
      <span className={`${styles.quarter} ${styles.quarterBlue}`} />
      <span className={`${styles.bar} ${styles.barYellow}`} />
      <span className={styles.inkLine} />
    </div>
  );
}
