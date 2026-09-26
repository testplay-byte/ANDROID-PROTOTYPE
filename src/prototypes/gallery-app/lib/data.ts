/**
 * gallery-app / lib/data — exhibitions + the permanent collection.
 */

import type { Artwork, Exhibition } from "./types";

export const EXHIBITIONS: Exhibition[] = [
  {
    id: 1,
    title: "Form & Colour",
    dates: "12 Sep — 24 Jan",
    price: 14,
    poster: "posterA",
  },
  {
    id: 2,
    title: "The New Grid",
    dates: "03 Oct — 15 Feb",
    price: 11,
    poster: "posterB",
  },
];

export const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Composition in Red",
    artist: "A. Rehm",
    year: "1927",
    category: "painting",
    motif: "circleBar",
    accent: "red",
  },
  {
    id: 2,
    title: "Quarter Turn",
    artist: "I. Brandt",
    year: "1931",
    category: "print",
    motif: "quarter",
    accent: "blue",
  },
  {
    id: 3,
    title: "Yellow Peak",
    artist: "M. Kowa",
    year: "1924",
    category: "painting",
    motif: "triangle",
    accent: "yellow",
  },
  {
    id: 4,
    title: "Two Bars",
    artist: "A. Rehm",
    year: "1929",
    category: "print",
    motif: "bars",
    accent: "red",
  },
  {
    id: 5,
    title: "Cross Study",
    artist: "I. Brandt",
    year: "1926",
    category: "sculpture",
    motif: "cross",
    accent: "yellow",
  },
  {
    id: 6,
    title: "Half Discipline",
    artist: "M. Kowa",
    year: "1933",
    category: "painting",
    motif: "semicircle",
    accent: "red",
  },
  {
    id: 7,
    title: "Stacked Planes",
    artist: "J. Ferber",
    year: "1928",
    category: "sculpture",
    motif: "stack",
    accent: "blue",
  },
  {
    id: 8,
    title: "Disc no. 4",
    artist: "J. Ferber",
    year: "1930",
    category: "print",
    motif: "disc",
    accent: "blue",
  },
];

export const CATEGORY_LABELS: Record<Artwork["category"], string> = {
  painting: "PAINTING",
  sculpture: "SCULPTURE",
  print: "PRINT",
};

/** Ticket price list for the Visit screen. */
export const TICKET_TYPES = [
  { id: "adult", label: "Adult", price: 18 },
  { id: "concession", label: "Concession", price: 10 },
] as const;

export type TicketTypeId = (typeof TICKET_TYPES)[number]["id"];
