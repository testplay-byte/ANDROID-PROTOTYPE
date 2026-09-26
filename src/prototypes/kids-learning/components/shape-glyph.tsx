/**
 * kids-learning / components / shape-glyph — inline SVG shape glyphs used
 * by the Shapes subject (tiles + answer buttons).
 */
import type { ShapeKind } from "../lib/types";
import styles from "./shape-glyph.module.css";

export function ShapeGlyph({
  kind,
  size = 56,
  color,
}: {
  kind: ShapeKind;
  size?: number;
  /** Optional override color (content swatches); defaults to token primary. */
  color?: string;
}) {
  const fill = color ?? "var(--color-primary)";
  const common = { x: 0, y: 0, width: size, height: size, viewBox: "0 0 24 24" };
  return (
    <svg {...common} className={styles.glyph} aria-hidden="true">
      {kind === "circle" && <circle cx="12" cy="12" r="9" fill={fill} />}
      {kind === "square" && (
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill={fill} />
      )}
      {kind === "triangle" && <path d="M12 3l9.5 17h-19z" fill={fill} />}
      {kind === "star" && (
        <path
          d="M12 2.5l2.9 5.9 6.6.96-4.75 4.63 1.12 6.54L12 17.47 6.13 20.53l1.12-6.54L2.5 9.36l6.6-.96z"
          fill={fill}
        />
      )}
      {kind === "heart" && (
        <path
          d="M12 21s-8.5-5.3-8.5-11A4.9 4.9 0 0 1 12 7.2 4.9 4.9 0 0 1 20.5 10c0 5.7-8.5 11-8.5 11z"
          fill={fill}
        />
      )}
      {kind === "diamond" && <path d="M12 2.5l9 9.5-9 9.5-9-9.5z" fill={fill} />}
    </svg>
  );
}
