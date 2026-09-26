/**
 * GeometricArt — the collection thumbnail: a pure CSS geometric
 * composition (triad blocks on a surface field) chosen per artwork motif.
 */

import type { ArtMotif } from "../lib/types";
import styles from "./geometric-art.module.css";

const ACCENT_VAR: Record<string, string> = {
  red: "var(--color-primary)",
  blue: "var(--color-secondary)",
  yellow: "var(--color-tertiary)",
};

export function GeometricArt({
  motif,
  accent,
}: {
  motif: ArtMotif;
  accent: "red" | "blue" | "yellow";
}) {
  const accentColor = ACCENT_VAR[accent];
  const second = accent === "red" ? "var(--color-secondary)" : "var(--color-primary)";

  return (
    <div className={styles.field} aria-hidden="true" style={{ background: "var(--color-surface-1)" }}>
      {motif === "circleBar" && (
        <>
          <span className={styles.circle} style={{ background: accentColor }} />
          <span className={`${styles.bar} ${styles.barDiagonal}`} style={{ background: "var(--color-outline)" }} />
        </>
      )}

      {motif === "quarter" && (
        <>
          <span className={styles.quarter} style={{ background: accentColor }} />
          <span className={styles.smallSquare} style={{ background: second }} />
        </>
      )}

      {motif === "triangle" && (
        <>
          <span className={styles.triangle} style={{ borderBottomColor: accentColor }} />
          <span className={styles.dot} style={{ background: second }} />
        </>
      )}

      {motif === "bars" && (
        <>
          <span className={`${styles.bar} ${styles.barV1}`} style={{ background: accentColor }} />
          <span className={`${styles.bar} ${styles.barV2}`} style={{ background: "var(--color-outline)" }} />
        </>
      )}

      {motif === "cross" && (
        <>
          <span className={`${styles.bar} ${styles.crossH}`} style={{ background: "var(--color-outline)" }} />
          <span className={`${styles.bar} ${styles.crossV}`} style={{ background: "var(--color-outline)" }} />
          <span className={styles.dot} style={{ background: accentColor }} />
        </>
      )}

      {motif === "semicircle" && (
        <>
          <span className={styles.semicircle} style={{ background: accentColor }} />
          <span className={`${styles.bar} ${styles.barBase}`} style={{ background: "var(--color-outline)" }} />
        </>
      )}

      {motif === "stack" && (
        <>
          <span className={`${styles.strip} ${styles.strip1}`} style={{ background: accentColor }} />
          <span className={`${styles.strip} ${styles.strip2}`} style={{ background: "var(--color-tertiary)" }} />
          <span className={`${styles.strip} ${styles.strip3}`} style={{ background: "var(--color-outline)" }} />
        </>
      )}

      {motif === "disc" && (
        <>
          <span className={styles.ring} style={{ borderColor: accentColor }} />
          <span className={styles.dot} style={{ background: "var(--color-outline)" }} />
        </>
      )}
    </div>
  );
}
