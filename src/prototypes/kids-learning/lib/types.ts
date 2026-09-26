/**
 * kids-learning / lib / types — shared types for the kids learning prototype.
 */

export type SubjectId = "letters" | "numbers" | "colors" | "shapes";

/** Token role used to tint a subject tile (keeps colors on tokens). */
export type AccentRole = "primary" | "secondary" | "tertiary" | "warn";

export interface Subject {
  id: SubjectId;
  name: string;
  tagline: string;
  accent: AccentRole;
}

export type ShapeKind =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "heart"
  | "diamond";

export interface AnswerOption {
  id: string;
  /** Letters / numbers show a text label. */
  label?: string;
  /** Colors show a blob of this (content) color. */
  color?: string;
  /** Shapes render this glyph. */
  shape?: ShapeKind;
}

export interface Question {
  id: string;
  prompt: string;
  kind: SubjectId;
  answers: AnswerOption[];
  correctId: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  /** Total stars needed across all subjects to unlock. */
  threshold: number;
  icon: "rocket" | "book" | "palette" | "star" | "trophy" | "crown";
}
