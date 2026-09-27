/**
 * GeometricArt — the artwork plate: a pure-CSS geometric composition
 * generated from the artwork record (motif + accent). Zero bitmaps.
 * The field is aspect-square, so it renders identically as a 150px tile
 * and as a full-screen plate; every shape is percentage-sized.
 */

import type { Accent, ArtMotif } from "../lib/types";
import styles from "./geometric-art.module.css";

/** Shape plan per motif: each entry is one span with a class from the module. */
const MOTIF_SHAPES: Record<ArtMotif, string[]> = {
  circleBar: ["disc", "diagBar"],
  quarter: ["quarterBr", "smallSquare"],
  triangle: ["tri", "dot"],
  bars: ["barV1", "barV2"],
  cross: ["crossH", "crossV", "dotAcc"],
  semicircle: ["halfDisc", "baseBar"],
  stack: ["strip1", "strip2", "strip3"],
  disc: ["ring", "dotInk"],
  halves: ["triLeft", "triRight"],
  arc: ["arc", "baseBar"],
  steps: ["step1", "step2", "step3", "smallSquare"],
  target: ["ringOuter", "ringInner", "dotAcc"],
};

export function GeometricArt({
  motif,
  accent,
  className,
}: {
  motif: ArtMotif;
  accent: Accent;
  className?: string;
}) {
  return (
    <div
      className={`${styles.field} ${className ?? ""}`}
      data-accent={accent}
      aria-hidden="true"
    >
      {MOTIF_SHAPES[motif].map((shape) => (
        <span key={shape} className={styles[shape]} />
      ))}
    </div>
  );
}
