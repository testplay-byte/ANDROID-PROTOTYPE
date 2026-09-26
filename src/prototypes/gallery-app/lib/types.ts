/**
 * gallery-app / lib/types — shared domain types.
 */

/** Artwork categories used by the Collection filter chips. */
export type ArtCategory = "painting" | "sculpture" | "print";

/** Which pure-CSS geometric composition renders on an artwork block. */
export type ArtMotif =
  | "circleBar"
  | "quarter"
  | "triangle"
  | "bars"
  | "cross"
  | "semicircle"
  | "stack"
  | "disc";

/** Which of the triad leads the composition. */
export type Accent = "red" | "blue" | "yellow";

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: string;
  category: ArtCategory;
  motif: ArtMotif;
  accent: Accent;
}

export interface Exhibition {
  id: number;
  title: string;
  dates: string;
  /** Ticket price in EUR. */
  price: number;
  /** Which poster composition to render. */
  poster: "posterA" | "posterB";
}
