/**
 * GeometricPoster — exhibition feature artwork built from PURE CSS
 * GEOMETRY (no images): solid triad blocks, discs, quarter-circles, bars
 * and a diagonal, composed like a printed poster. One field per motif.
 */

import type { PosterMotif } from "../lib/types";
import styles from "./geometric-poster.module.css";

export function GeometricPoster({ poster }: { poster: PosterMotif }) {
  return (
    <div className={styles.field} data-poster={poster} aria-hidden="true">
      {poster === "posterA" && (
        <>
          <span className={`${styles.bar} ${styles.barTopYellow}`} />
          <span className={`${styles.disc} ${styles.discRedA}`} />
          <span className={`${styles.quarter} ${styles.quarterBlueA}`} />
          <span className={styles.rule} />
        </>
      )}
      {poster === "posterB" && (
        <>
          <span className={`${styles.tri} ${styles.triYellowB}`} />
          <span className={`${styles.disc} ${styles.discBlueB}`} />
          <span className={`${styles.bar} ${styles.barRedB}`} />
          <span className={styles.rule} />
        </>
      )}
      {poster === "posterC" && (
        <>
          <span className={`${styles.ring} ${styles.ringRedC}`} />
          <span className={`${styles.disc} ${styles.discYellowC}`} />
          <span className={`${styles.quarter} ${styles.quarterBlueC}`} />
          <span className={`${styles.bar} ${styles.barBlueC}`} />
          <span className={styles.rule} />
        </>
      )}
    </div>
  );
}
