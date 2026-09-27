/**
 * gallery-app / lib/types — shared domain types.
 */

/** Artwork categories used by the Collection filter chips. */
export type ArtCategory = "painting" | "sculpture" | "print";

/** Which pure-CSS geometric composition renders on an artwork plate. */
export type ArtMotif =
  | "circleBar"
  | "quarter"
  | "triangle"
  | "bars"
  | "cross"
  | "semicircle"
  | "stack"
  | "disc"
  | "halves"
  | "arc"
  | "steps"
  | "target";

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
  /** Plate caption line: technique. */
  medium: string;
  /** Plate caption line: size. */
  dimensions: string;
  /** Gallery room the work hangs in, e.g. "SAAL 2". */
  room: string;
  /** One-sentence curatorial note shown on the plate. */
  note: string;
}

/** Which poster composition an exhibition renders. */
export type PosterMotif = "posterA" | "posterB" | "posterC";

export interface Exhibition {
  id: number;
  /** Big display number in the exhibition list ("01"). */
  num: string;
  title: string;
  dates: string;
  /** Ticket price in EUR. */
  price: number;
  poster: PosterMotif;
  /** Where in the building, e.g. "Galerie Ost — 1. OG". */
  location: string;
  /** Curatorial paragraph for the detail screen. */
  blurb: string;
  /** Works hung in this exhibition (ids into ARTWORKS). */
  artworkIds: number[];
}
