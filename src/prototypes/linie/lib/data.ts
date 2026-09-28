/* linie / lib / data — the metro network: 3 lines drawn as
   right-angle/45° SVG paths, circle stations, interchanges.
   Station coords are in a 0-100 × 0-100 viewBox space. */

export type LineId = "A" | "B" | "C";

export interface Line {
  id: LineId;
  name: string;
  /** bauhaus triad: red is primary, blue/yellow secondary */
  token: "primary" | "secondary" | "tertiary";
  /** SVG path, 100×100 space, 2px stroke */
  path: string;
}

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  /** line ids serving this stop */
  lines: LineId[];
  interchange?: boolean;
}

export const LINES: Line[] = [
  {
    id: "A",
    name: "Rot",
    token: "primary",
    path: "M 10 86 L 30 86 L 50 66 L 50 30 L 74 30 L 90 14",
  },
  {
    id: "B",
    name: "Blau",
    token: "secondary",
    path: "M 12 30 L 36 30 L 56 50 L 84 50",
  },
  {
    id: "C",
    name: "Gelb",
    token: "tertiary",
    path: "M 20 68 L 44 68 L 68 44 L 68 16 L 88 16",
  },
];

export const STATIONS: Station[] = [
  { id: "wested", name: "Wested", x: 10, y: 86, lines: ["A"] },
  { id: "markt", name: "Markthalle", x: 30, y: 86, lines: ["A"], interchange: true },
  { id: "hafen", name: "Hafen", x: 12, y: 30, lines: ["B"] },
  { id: "altstadt", name: "Altstadt", x: 36, y: 30, lines: ["B"] },
  { id: "zirkus", name: "Zirkusplatz", x: 50, y: 66, lines: ["A", "C"], interchange: true },
  { id: "dom", name: "Dom", x: 50, y: 30, lines: ["A"], interchange: true },
  { id: "garten", name: "Garten", x: 56, y: 50, lines: ["B", "C"], interchange: true },
  { id: "berg", name: "Bergbahn", x: 68, y: 44, lines: ["C"] },
  { id: "uni", name: "Universität", x: 74, y: 30, lines: ["A"] },
  { id: "nord", name: "Nordring", x: 68, y: 16, lines: ["C"] },
  { id: "ost", name: "Ostbahnhof", x: 88, y: 16, lines: ["A", "C"], interchange: true },
  { id: "sued", name: "Südbahnhof", x: 84, y: 50, lines: ["B"] },
];

export interface Departure {
  stationId: string;
  line: LineId;
  dest: string;
  /** minutes from now (ticks down live) */
  mins: number;
}

export const DEPARTURES: Departure[] = [
  { stationId: "markt", line: "A", dest: "Ostbahnhof", mins: 2 },
  { stationId: "markt", line: "A", dest: "Nordring", mins: 9 },
  { stationId: "markt", line: "A", dest: "Südbahnhof", mins: 14 },
  { stationId: "markt", line: "B", dest: "Hafen", mins: 5 },
  { stationId: "markt", line: "B", dest: "Altstadt", mins: 11 },
  { stationId: "ost", line: "A", dest: "Wested", mins: 3 },
  { stationId: "ost", line: "C", dest: "Nordring", mins: 7 },
  { stationId: "garten", line: "B", dest: "Hafen", mins: 4 },
  { stationId: "garten", line: "C", dest: "Bergbahn", mins: 12 },
  { stationId: "dom", line: "A", dest: "Ostbahnhof", mins: 6 },
];

export const SERVICE: { label: string; tone: "good" | "warn" | "down" }[] = [
  { label: "Rolltreppe Zirkusplatz", tone: "warn" },
  { label: "Alle Linien fahren", tone: "good" },
];

export const TICKETS = [
  { id: "single", name: "Einzel", price: 4, color: "Rot" as const, note: "90 min, eine Linie" },
  { id: "day", name: "Tageskarte", price: 12, color: "Gelb" as const, note: "unbegrenzt am selben Tag" },
  { id: "week", name: "Wochenkarte", price: 42, color: "Blau" as const, note: "7 Tage, alle Linien" },
];

export interface SavedRoute {
  id: string;
  from: string;
  to: string;
  stops: number;
  mins: number;
}

export const DEFAULT_ROUTES: SavedRoute[] = [
  { id: "r1", from: "Wested", to: "Ostbahnhof", stops: 4, mins: 22 },
  { id: "r2", from: "Hafen", to: "Bergbahn", stops: 3, mins: 17 },
];

export const byId = (id: string) => STATIONS.find((s) => s.id === id);
export const lineById = (id: LineId) => LINES.find((l) => l.id === id)!;
export const departsFor = (stationId: string) => DEPARTURES.filter((d) => d.stationId === stationId);

export function money(v: number): string {
  return `${v} €`;
}

export function nameOf(id: string): string {
  return byId(id)?.name ?? id;
}
