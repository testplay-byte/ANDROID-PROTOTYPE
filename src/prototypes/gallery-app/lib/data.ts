/**
 * gallery-app / lib/data — exhibitions, the permanent collection, and the
 * visit planner. All artwork imagery is generated from these records by the
 * pure-CSS geometry components; there are zero bitmaps in this prototype.
 */

import type { Artwork, Exhibition } from "./types";

export const EXHIBITIONS: Exhibition[] = [
  {
    id: 1,
    num: "01",
    title: "Form & Colour",
    dates: "12 Sep — 24 Jan",
    price: 14,
    poster: "posterA",
    location: "Galerie Ost — 1. OG",
    blurb:
      "Twelve painters and printmakers reduce the poster, the canvas and the stage set to the primary triad. Nothing is decoration: every disc, bar and quarter-circle carries the whole weight of the composition.",
    artworkIds: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    num: "02",
    title: "The New Grid",
    dates: "03 Oct — 15 Feb",
    price: 11,
    poster: "posterB",
    location: "Galerie West — Erdgeschoss",
    blurb:
      "A survey of the ruled plane: stacked strips, stepped blocks and banded prints in which the grid itself becomes the subject. The exhibition wall is the artwork — the frame is always the ink line.",
    artworkIds: [7, 8, 9, 10],
  },
  {
    id: 3,
    num: "03",
    title: "Circle & Arc Studies",
    dates: "21 Nov — 30 Mar",
    price: 9,
    poster: "posterC",
    location: "Kabinett — 2. OG",
    blurb:
      "The round as discipline. Half-discs, rings and concentric targets from the preparatory workshops, shown for the first time beside their ruled construction drawings.",
    artworkIds: [11, 12, 5, 2],
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
    medium: "Oil on canvas",
    dimensions: "88 × 88 cm",
    room: "SAAL 1",
    note: "The disc floats; the ruled bar pins it to the lower plane.",
  },
  {
    id: 2,
    title: "Quarter Turn",
    artist: "I. Brandt",
    year: "1931",
    category: "print",
    motif: "quarter",
    accent: "blue",
    medium: "Lithograph",
    dimensions: "48 × 48 cm",
    room: "SAAL 1",
    note: "One quarter-circle, rotated 90°, redraws the entire field.",
  },
  {
    id: 3,
    title: "Yellow Peak",
    artist: "M. Kowa",
    year: "1924",
    category: "painting",
    motif: "triangle",
    accent: "yellow",
    medium: "Tempera on board",
    dimensions: "65 × 65 cm",
    room: "SAAL 1",
    note: "The acute angle as the loudest voice in the triad.",
  },
  {
    id: 4,
    title: "Two Bars",
    artist: "A. Rehm",
    year: "1929",
    category: "print",
    motif: "bars",
    accent: "red",
    medium: "Relief print",
    dimensions: "52 × 41 cm",
    room: "SAAL 1",
    note: "Two verticals, offset by one measure — rhythm without ornament.",
  },
  {
    id: 5,
    title: "Cross Study",
    artist: "I. Brandt",
    year: "1926",
    category: "sculpture",
    motif: "cross",
    accent: "yellow",
    medium: "Painted steel",
    dimensions: "120 × 120 cm",
    room: "SAAL 2",
    note: "A maquette for the monument that was never cast.",
  },
  {
    id: 6,
    title: "Half Discipline",
    artist: "M. Kowa",
    year: "1933",
    category: "painting",
    motif: "semicircle",
    accent: "red",
    medium: "Oil on canvas",
    dimensions: "76 × 76 cm",
    room: "SAAL 2",
    note: "The semicircle rests on its ruled base like a sun held down.",
  },
  {
    id: 7,
    title: "Stacked Planes",
    artist: "J. Ferber",
    year: "1928",
    category: "sculpture",
    motif: "stack",
    accent: "blue",
    medium: "Lacquered wood",
    dimensions: "210 × 90 cm",
    room: "SAAL 3",
    note: "Three strips, three colours, one plumb line.",
  },
  {
    id: 8,
    title: "Disc no. 4",
    artist: "J. Ferber",
    year: "1930",
    category: "print",
    motif: "disc",
    accent: "blue",
    medium: "Screenprint",
    dimensions: "50 × 50 cm",
    room: "SAAL 3",
    note: "The fourth of nine prints: the ring thickens, the dot answers.",
  },
  {
    id: 9,
    title: "Split Field",
    artist: "L. Ron",
    year: "1925",
    category: "painting",
    motif: "halves",
    accent: "yellow",
    medium: "Gouache on paper",
    dimensions: "60 × 60 cm",
    room: "SAAL 3",
    note: "A diagonal cuts the square; the halves trade colour by weight.",
  },
  {
    id: 10,
    title: "Rising Arc",
    artist: "L. Ron",
    year: "1932",
    category: "print",
    motif: "arc",
    accent: "red",
    medium: "Lithograph",
    dimensions: "44 × 60 cm",
    room: "SAAL 4",
    note: "Half a disc cut horizontally — the arc climbs its own basebar.",
  },
  {
    id: 11,
    title: "Stair of Colours",
    artist: "H. Veit",
    year: "1929",
    category: "sculpture",
    motif: "steps",
    accent: "blue",
    medium: "Painted plywood",
    dimensions: "140 × 100 cm",
    room: "SAAL 4",
    note: "Steps in red, yellow and blue — the triad as architecture.",
  },
  {
    id: 12,
    title: "Concentric Order",
    artist: "H. Veit",
    year: "1934",
    category: "painting",
    motif: "target",
    accent: "red",
    medium: "Casein on canvas",
    dimensions: "84 × 84 cm",
    room: "SAAL 4",
    note: "Ring inside ring inside ring: the circle as a strict class system.",
  },
];

/** Fast lookup for plate view + exhibition detail pushes. */
export const ARTWORK_BY_ID: Record<number, Artwork> = Object.fromEntries(
  ARTWORKS.map((a) => [a.id, a])
);

export const CATEGORY_LABELS: Record<Artwork["category"], string> = {
  painting: "PAINTING",
  sculpture: "SCULPTURE",
  print: "PRINT",
};

/** Colour-study row on the Collection screen — the triad, dissected. */
export const TRIAD_STUDY = [
  { id: "red", label: "ROT", token: "--color-primary" },
  { id: "blue", label: "BLAU", token: "--color-secondary" },
  { id: "yellow", label: "GELB", token: "--color-tertiary" },
] as const;

/** Ticket price list for the Visit screen. */
export const TICKET_TYPES = [
  { id: "adult", label: "Adult", price: 18 },
  { id: "concession", label: "Concession", price: 10 },
] as const;

export type TicketTypeId = (typeof TICKET_TYPES)[number]["id"];

/** Date chips for the Visit planner — built from the current week. */
export interface SlotDay {
  id: string;
  weekday: string;
  day: string;
  month: string;
  closed?: boolean;
}

const WEEKDAYS = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAI", "JUN",
  "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ",
];

/** Next 7 calendar days, Monday closed (matches HOURS). */
export function buildSlotDays(): SlotDay[] {
  const out: SlotDay[] = [];
  const now = new Date();
  for (let i = 1; i <= 7; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const wd = d.getDay();
    out.push({
      id: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      weekday: WEEKDAYS[wd],
      day: String(d.getDate()).padStart(2, "0"),
      month: MONTHS[d.getMonth()],
      closed: wd === 1,
    });
  }
  return out;
}

/** Time-slot chips for the Visit planner. */
export const TIME_SLOTS = ["10:30", "13:00", "15:30", "18:00"] as const;
