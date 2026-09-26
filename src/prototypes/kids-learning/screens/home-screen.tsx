"use client";

/**
 * kids-learning / screens / home-screen — friendly landing screen.
 *
 * Big hero greeting, then a 2-col grid of four puffy subject tiles.
 * Each tile shows the subject glyph, name, and a star progress row.
 * Tapping a tile opens the Play tab with that subject preselected.
 */
import { TopBar } from "../../../proto-kit";
import { SUBJECTS, KID_NAME } from "../lib/data";
import type { SubjectId } from "../lib/types";
import { StarRow } from "../components/star-row";
import { ShapeGlyph } from "../components/shape-glyph";
import styles from "./home-screen.module.css";

interface HomeScreenProps {
  active: boolean;
  /** Earned stars per subject id. */
  stars: Record<SubjectId, number>;
  onOpenSubject: (subject: SubjectId) => void;
}

/** Token role → CSS custom property for the tile accent blob. */
const ACCENT_VAR: Record<string, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
  warn: "var(--color-warn)",
};

export function HomeScreen({ active, stars, onOpenSubject }: HomeScreenProps) {
  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="home"
      aria-label="Home"
      aria-hidden={!active}
    >
      <TopBar variant="hero" title={`Hi, ${KID_NAME}!`} subtitle="READY TO PLAY?" />
      <div className={styles.content}>
        <p className={styles.intro}>
          Pick a subject and earn shiny stars today!
        </p>
        <div className={styles.grid}>
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              type="button"
              className={styles.tile}
              onClick={() => onOpenSubject(subject.id)}
              aria-label={`Play ${subject.name}`}
            >
              <span
                className={styles.blob}
                style={{ background: ACCENT_VAR[subject.accent] }}
                aria-hidden="true"
              >
                {subject.id === "letters" && <span className={styles.glyphText}>A</span>}
                {subject.id === "numbers" && <span className={styles.glyphText}>7</span>}
                {subject.id === "colors" && (
                  <span className={styles.palette}>
                    <i className={styles.paletteDot} style={{ background: "#e35d6a" }} />
                    <i className={styles.paletteDot} style={{ background: "#5b8def" }} />
                    <i className={styles.paletteDot} style={{ background: "#f2c14e" }} />
                  </span>
                )}
                {subject.id === "shapes" && (
                  <span className={styles.shapeStack}>
                    <ShapeGlyph kind="circle" size={18} />
                    <ShapeGlyph kind="triangle" size={18} />
                    <ShapeGlyph kind="square" size={16} />
                  </span>
                )}
              </span>
              <span className={styles.tileName}>{subject.name}</span>
              <span className={styles.tileTagline}>{subject.tagline}</span>
              <StarRow filled={Math.min(stars[subject.id], 5)} total={5} size={16} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
