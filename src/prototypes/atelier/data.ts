/**
 * atelier / data — deterministic demo data for the Bauhaus studio workspace.
 *
 * All numbers are fixed (no Math.random anywhere, no Date.now in render): the
 * plates, the capacity chart and the counters must look identical on every
 * load, exactly like the phone prototypes' seeded generators.
 *
 * The "imagery" of this prototype is geometry, not photography. Every work
 * carries a PLATE — a handful of shapes in normalised 0–100 coordinates that
 * components/geometry.tsx draws as inline SVG. Fills come from the Bauhaus
 * token layer (primary / secondary / tertiary / ink / paper) and nothing else,
 * so the triad is the only palette in the app.
 */

export type Tone = "primary" | "secondary" | "tertiary" | "ink" | "paper";

export type ShapeKind = "circle" | "square" | "triangle" | "half" | "quarter" | "bar";

/** One element of a work's plate. x/y are the centre in 0–100 plate units,
 *  s is the size as a share of the plate edge, r an optional rotation. */
export interface PlateShape {
  kind: ShapeKind;
  tone: Tone;
  x: number;
  y: number;
  s: number;
  r?: number;
}

export type Discipline = "identity" | "editorial" | "exhibition" | "typography" | "object";

/** Portfolio state of a work. */
export type WorkStatus = "commissioned" | "in-studio" | "archived";

export interface Work {
  id: string;
  /** Plate number, printed on the card and in the detail region. */
  plateNo: string;
  title: string;
  client: string;
  discipline: Discipline;
  year: number;
  status: WorkStatus;
  lead: string;
  due: string;
  progress: number;
  summary: string;
  scope: string[];
  plate: PlateShape[];
}

/** Kanban stage — the four headers carry the primary triad. */
export type Stage = "commission" | "sketch" | "construction" | "installed";

export interface Card {
  id: string;
  title: string;
  work: string;
  owner: string;
  stage: Stage;
  points: number;
  due: string;
  shape: ShapeKind;
  tone: Tone;
}

export interface Maker {
  id: string;
  name: string;
  initials: string;
  role: string;
  discipline: Discipline;
  /** Contracted hours for the season. */
  capacity: number;
  /** Hours already committed. */
  booked: number;
  shape: ShapeKind;
  tone: Tone;
}

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  identity: "Identity",
  editorial: "Editorial",
  exhibition: "Exhibition",
  typography: "Typography",
  object: "Object",
};

export const DISCIPLINE_TONE: Record<Discipline, Tone> = {
  identity: "primary",
  editorial: "secondary",
  exhibition: "tertiary",
  typography: "ink",
  object: "secondary",
};

export const DISCIPLINES: Discipline[] = [
  "identity",
  "editorial",
  "exhibition",
  "typography",
  "object",
];

export const STATUS_LABEL: Record<WorkStatus, string> = {
  commissioned: "Commissioned",
  "in-studio": "In studio",
  archived: "Archived",
};

export const SHAPE_LABEL: Record<ShapeKind, string> = {
  circle: "Circle",
  square: "Square",
  triangle: "Triangle",
  half: "Half",
  quarter: "Quarter",
  bar: "Bar",
};

/** Board columns, in order. `wip` is the work-in-progress limit (null = open). */
export const STAGES: { id: Stage; index: string; label: string; tone: Tone; wip: number | null }[] = [
  { id: "commission", index: "01", label: "Commission", tone: "primary", wip: 4 },
  { id: "sketch", index: "02", label: "Sketch", tone: "secondary", wip: 4 },
  { id: "construction", index: "03", label: "Construction", tone: "tertiary", wip: 4 },
  { id: "installed", index: "04", label: "Installed", tone: "ink", wip: null },
];

/** Clicking a card advances it to the next stage; Installed wraps to Commission. */
export const NEXT_STAGE: Record<Stage, Stage> = {
  commission: "sketch",
  sketch: "construction",
  construction: "installed",
  installed: "commission",
};

export const stageLabel = (id: Stage) => STAGES.find((s) => s.id === id)?.label ?? id;
export const stageIndex = (id: Stage) => STAGES.find((s) => s.id === id)?.index ?? "00";

export const WORKS: Work[] = [
  {
    id: "w-quadrat",
    plateNo: "01",
    title: "Quadrat Annual",
    client: "Quadrat Press",
    discipline: "editorial",
    year: 2026,
    status: "in-studio",
    lead: "Vera Ostermann",
    due: "Mar 12",
    progress: 62,
    summary:
      "A 240-page annual for a small press: one grid, three weights, no decoration. The cover is a single red square on cream stock.",
    scope: ["Grid system", "Type specification", "Cover series", "Print supervision"],
    plate: [
      { kind: "square", tone: "primary", x: 38, y: 44, s: 46 },
      { kind: "bar", tone: "ink", x: 72, y: 44, s: 6, r: 0 },
      { kind: "circle", tone: "ink", x: 72, y: 22, s: 13 },
    ],
  },
  {
    id: "w-zeichen",
    plateNo: "02",
    title: "Zeichen Type Foundry",
    client: "Zeichen GmbH",
    discipline: "typography",
    year: 2026,
    status: "in-studio",
    lead: "Ansel Kray",
    due: "Apr 02",
    progress: 34,
    summary:
      "A variable grotesque cut in three widths. The specimen is a wall of black rules interrupted by one blue counterform.",
    scope: ["Latin core", "Width axis", "Specimen book", "Webfont build"],
    plate: [
      { kind: "bar", tone: "ink", x: 50, y: 18, s: 58, r: 90 },
      { kind: "bar", tone: "ink", x: 50, y: 46, s: 58, r: 90 },
      { kind: "bar", tone: "ink", x: 50, y: 74, s: 58, r: 90 },
      { kind: "square", tone: "secondary", x: 22, y: 46, s: 16 },
    ],
  },
  {
    id: "w-spektrum",
    plateNo: "03",
    title: "Spektrum Pavilion",
    client: "Halle 9 Köln",
    discipline: "exhibition",
    year: 2025,
    status: "archived",
    lead: "Vera Ostermann",
    due: "Sep 20",
    progress: 100,
    summary:
      "Wayfinding for a travelling pavilion: six rooms, six primaries, one rule. Everything is a shape on a wall and nothing is a sign.",
    scope: ["Room numbering", "Wayfinding", "Floor vinyl", "Catalogue"],
    plate: [
      { kind: "triangle", tone: "primary", x: 34, y: 40, s: 44 },
      { kind: "square", tone: "secondary", x: 68, y: 40, s: 34 },
      { kind: "circle", tone: "tertiary", x: 68, y: 76, s: 22 },
      { kind: "bar", tone: "ink", x: 34, y: 78, s: 40, r: 0 },
    ],
  },
  {
    id: "w-kreis",
    plateNo: "04",
    title: "Kreis Cooperative",
    client: "Kreis Werkstätten",
    discipline: "identity",
    year: 2025,
    status: "in-studio",
    lead: "Milo Vance",
    due: "Feb 18",
    progress: 78,
    summary:
      "An identity built from one rotating disc. The mark is a circle, the wordmark is a square of tracked capitals, the palette is fixed.",
    scope: ["Mark", "Wordmark", "Stamp set", "Vehicle livery"],
    plate: [
      { kind: "circle", tone: "tertiary", x: 44, y: 50, s: 52 },
      { kind: "quarter", tone: "primary", x: 44, y: 50, s: 52 },
      { kind: "square", tone: "ink", x: 80, y: 50, s: 14 },
    ],
  },
  {
    id: "w-blatt",
    plateNo: "05",
    title: "Blatt Werkzeuge",
    client: "Blatt Werkzeuge AG",
    discipline: "identity",
    year: 2024,
    status: "archived",
    lead: "Milo Vance",
    due: "Jun 11",
    progress: 100,
    summary:
      "Catalogue and packaging for a toolmaker. Yellow on black, safety first: the hierarchy is a bar chart of load ratings.",
    scope: ["Packaging system", "Catalogue", "Tool decals", "Trade fair wall"],
    plate: [
      { kind: "bar", tone: "ink", x: 26, y: 50, s: 26, r: 0 },
      { kind: "bar", tone: "tertiary", x: 50, y: 50, s: 44, r: 0 },
      { kind: "bar", tone: "ink", x: 74, y: 50, s: 62, r: 0 },
    ],
  },
  {
    id: "w-halle",
    plateNo: "06",
    title: "Halle 4 Poster Series",
    client: "Kunstverein",
    discipline: "editorial",
    year: 2024,
    status: "archived",
    lead: "Ansel Kray",
    due: "Nov 30",
    progress: 100,
    summary:
      "Twelve A1 posters, one per exhibition, each reducing the show to a single primitive at poster scale.",
    scope: ["Poster series", "Hang system", "Press run"],
    plate: [
      { kind: "half", tone: "secondary", x: 38, y: 50, s: 56 },
      { kind: "square", tone: "paper", x: 38, y: 50, s: 22 },
      { kind: "triangle", tone: "ink", x: 76, y: 50, s: 40 },
    ],
  },
  {
    id: "w-form",
    plateNo: "07",
    title: "Form Chair No. 4",
    client: "Werkbund Werkstatt",
    discipline: "object",
    year: 2026,
    status: "commissioned",
    lead: "Juno Feld",
    due: "May 24",
    progress: 18,
    summary:
      "Production drawings for a stacking chair in three ply laminations. Every joint is a circle or a square; nothing is decorative.",
    scope: ["Prototype", "Lamination jig", "Production drawings", "Assembly key"],
    plate: [
      { kind: "square", tone: "secondary", x: 44, y: 50, s: 50 },
      { kind: "circle", tone: "ink", x: 44, y: 50, s: 22 },
      { kind: "bar", tone: "primary", x: 44, y: 84, s: 66, r: 0 },
    ],
  },
  {
    id: "w-ton",
    plateNo: "08",
    title: "Ton Festival Identity",
    client: "Ton Festival",
    discipline: "exhibition",
    year: 2026,
    status: "commissioned",
    lead: "Juno Feld",
    due: "Jun 08",
    progress: 25,
    summary:
      "A festival identity that reassembles itself each year from the same three shapes. This year it is a stack of three triangles.",
    scope: ["Festival mark", "Stage graphics", "Wayfinding", "Merch"],
    plate: [
      { kind: "triangle", tone: "primary", x: 50, y: 32, s: 42 },
      { kind: "triangle", tone: "secondary", x: 50, y: 58, s: 42 },
      { kind: "triangle", tone: "tertiary", x: 50, y: 84, s: 42 },
    ],
  },
];

export const CARDS: Card[] = [
  { id: "c-1", title: "Approve cover grid", work: "Quadrat Annual", owner: "Vera Ostermann", stage: "sketch", points: 3, due: "Oct 02", shape: "square", tone: "primary" },
  { id: "c-2", title: "Cut width axis proof", work: "Zeichen Type Foundry", owner: "Ansel Kray", stage: "sketch", points: 8, due: "Oct 09", shape: "bar", tone: "secondary" },
  { id: "c-3", title: "Room numbering test", work: "Spektrum Pavilion", owner: "Vera Ostermann", stage: "installed", points: 2, due: "Sep 24", shape: "circle", tone: "tertiary" },
  { id: "c-4", title: "Disc rotation states", work: "Kreis Cooperative", owner: "Milo Vance", stage: "construction", points: 5, due: "Oct 06", shape: "circle", tone: "tertiary" },
  { id: "c-5", title: "Livery vinyl order", work: "Kreis Cooperative", owner: "Milo Vance", stage: "construction", points: 3, due: "Oct 14", shape: "bar", tone: "ink" },
  { id: "c-6", title: "Load rating chart", work: "Blatt Werkzeuge", owner: "Milo Vance", stage: "installed", points: 5, due: "Sep 28", shape: "bar", tone: "tertiary" },
  { id: "c-7", title: "Press check 400gsm", work: "Quadrat Annual", owner: "Ruta Senn", stage: "construction", points: 3, due: "Oct 10", shape: "square", tone: "tertiary" },
  { id: "c-8", title: "Hang plan for 12 posters", work: "Halle 4 Poster Series", owner: "Ansel Kray", stage: "installed", points: 2, due: "Oct 01", shape: "square", tone: "paper" },
  { id: "c-9", title: "Lamination jig drawing", work: "Form Chair No. 4", owner: "Juno Feld", stage: "commission", points: 8, due: "Nov 04", shape: "square", tone: "primary" },
  { id: "c-10", title: "Brief workshop with Ton", work: "Ton Festival Identity", owner: "Juno Feld", stage: "commission", points: 2, due: "Oct 20", shape: "triangle", tone: "primary" },
  { id: "c-11", title: "Specimen book layout", work: "Zeichen Type Foundry", owner: "Ruta Senn", stage: "sketch", points: 5, due: "Oct 16", shape: "half", tone: "secondary" },
  { id: "c-12", title: "Punch list — wall 3", work: "Spektrum Pavilion", owner: "Vera Ostermann", stage: "construction", points: 2, due: "Oct 08", shape: "quarter", tone: "tertiary" },
  { id: "c-13", title: "Sign off stamp set", work: "Kreis Cooperative", owner: "Milo Vance", stage: "sketch", points: 3, due: "Oct 12", shape: "circle", tone: "ink" },
  { id: "c-14", title: "Archive plate scans", work: "Blatt Werkzeuge", owner: "Ruta Senn", stage: "commission", points: 2, due: "Oct 22", shape: "square", tone: "ink" },
];

export const MAKERS: Maker[] = [
  { id: "m-vera", name: "Vera Ostermann", initials: "VO", role: "Director", discipline: "exhibition", capacity: 34, booked: 31, shape: "circle", tone: "primary" },
  { id: "m-ansel", name: "Ansel Kray", initials: "AK", role: "Type designer", discipline: "typography", capacity: 38, booked: 22, shape: "bar", tone: "secondary" },
  { id: "m-milo", name: "Milo Vance", initials: "MV", role: "Identity designer", discipline: "identity", capacity: 36, booked: 34, shape: "square", tone: "tertiary" },
  { id: "m-juno", name: "Juno Feld", initials: "JF", role: "Object designer", discipline: "object", capacity: 32, booked: 14, shape: "triangle", tone: "primary" },
  { id: "m-ruta", name: "Ruta Senn", initials: "RS", role: "Studio manager", discipline: "editorial", capacity: 30, booked: 17, shape: "half", tone: "secondary" },
  { id: "m-hale", name: "Hale Ito", initials: "HI", role: "Production", discipline: "editorial", capacity: 34, booked: 30, shape: "quarter", tone: "ink" },
];

/** Studio-wide figures for the top strip. Fixed, like everything else here. */
export const STUDIO = {
  openCommissions: 2,
  platesThisSeason: 8,
  installedThisYear: 3,
  printHoursLeft: 96,
};

export const workById = (id: string) => WORKS.find((w) => w.id === id);
export const makerByName = (name: string) => MAKERS.find((m) => m.name === name);

/** Booked share of contracted hours, clamped to 0–100 for the bars. */
export const loadPct = (m: Maker) => Math.max(0, Math.min(100, Math.round((m.booked / m.capacity) * 100)));
