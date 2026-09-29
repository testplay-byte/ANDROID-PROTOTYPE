/**
 * facet / data — deterministic demo data for the Facet bento dashboard.
 *
 * Everything here is FIXED. No Math.random, no Date.now, no argument-less
 * `new Date()`: the clock tile, the month grid and every counter must look
 * identical on every load so reviewers can talk about the same screen.
 *
 * "Today" is pinned to 2026-09-28, a Monday, so the agenda, the habit ring
 * and the highlighted day in the month grid all agree with each other.
 *
 * Calendar maths is pure integer work — `daysFromCivil` is Howard Hinnant's
 * days-since-epoch formula, written out as arithmetic so no Date object is
 * ever constructed. Weekdays, month lengths and "is this day in this month"
 * are therefore all deterministic functions of a y/m/d triple.
 */

/* =========================================================================
   1. the pinned clock + civil-date arithmetic
   ========================================================================= */

/** The frozen "today" for this prototype. Monday 28 September 2026. */
export const TODAY = "2026-09-28";
export const TODAY_YEAR = 2026;
export const TODAY_MONTH = 9; // 1-12

/** Day and month labels — a lookup, not a locale call, so SSR and client match. */
export const DAY_LONG = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** Days since 1970-01-01 for a y/m/d triple (Hinnant's days_from_civil). */
export function daysFromCivil(y: number, m: number, d: number): number {
  const year = y - (m <= 2 ? 1 : 0);
  const era = Math.floor(year / 400);
  const yoe = year - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/** Weekday of a y/m/d triple, 0 = Monday … 6 = Sunday. */
export function weekdayOf(y: number, m: number, d: number): number {
  return (((daysFromCivil(y, m, d) + 3) % 7) + 7) % 7;
}

/** Weekday of an ISO "YYYY-MM-DD" string. Parsing only, never constructing. */
export function weekdayIndex(iso: string): number {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return weekdayOf(y, m, d);
}

/** Number of days in a month, 1-indexed. */
export function daysInMonth(y: number, m: number): number {
  if (m === 2) return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
  return m === 4 || m === 6 || m === 9 || m === 11 ? 30 : 31;
}

/** ISO "YYYY-MM-DD" for a y/m/d triple. */
export const iso = (y: number, m: number, d: number) =>
  `${y}-${pad2(m)}-${pad2(d)}`;

/** Month offset arithmetic — the (year, month) pair `delta` months away.
 *  Named distinctly from the context's `shiftMonth` action so the two can
 *  never be confused at a call site. */
export function monthAt(year: number, month: number, delta: number) {
  const zero = year * 12 + (month - 1) + delta;
  return { year: Math.floor(zero / 12), month: (zero % 12) + 1 };
}

/** "Mon 28 Sep" — the label used by the clock and the agenda tiles. */
export function shortDate(dayIso: string): string {
  const [y, m, d] = dayIso.split("-").map((n) => parseInt(n, 10));
  return `${DAY_SHORT[weekdayOf(y, m, d)]} ${d} ${MONTH_SHORT[m - 1]}`;
}

/** "28 September 2026" */
export function longDate(dayIso: string): string {
  const [y, m, d] = dayIso.split("-").map((n) => parseInt(n, 10));
  return `${d} ${MONTH_LONG[m - 1]} ${y}`;
}

/** Day-of-month as a number, for month-grid cells. */
export const dayOfMonth = (dayIso: string) => parseInt(dayIso.slice(8), 10);

/** Minutes-from-midnight → "09:30". The only time formatter in the app. */
export function hhmm(min: number): string {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
}

/* =========================================================================
   2. the bento board — tile definitions + the span system
   ========================================================================= */

/** The four tile sizes. Size carries meaning: how big a tile is tells you
 *  how often you need it, which is the one rule bento layout never bends. */
export type SpanId = "1x1" | "2x1" | "1x2" | "2x2";

/** The order the per-tile cycle control walks through. */
export const SPAN_CYCLE: SpanId[] = ["1x1", "2x1", "2x2", "1x2"];

export const SPAN_LABEL: Record<SpanId, string> = {
  "1x1": "1 × 1",
  "2x1": "2 × 1",
  "1x2": "1 × 2",
  "2x2": "2 × 2",
};

/** grid-column / grid-row spans, on a 4-column board. */
export const SPAN_COLS: Record<SpanId, number> = { "1x1": 1, "2x1": 2, "1x2": 1, "2x2": 2 };
export const SPAN_ROWS: Record<SpanId, number> = { "1x1": 1, "2x1": 1, "1x2": 2, "2x2": 2 };

export type ToneId = "primary" | "secondary" | "tertiary" | "surface" | "quiet";

export interface TileDef {
  id: string;
  /** the one job this tile does, in the tile's own words */
  job: string;
  /** default span before the user re-sizes anything */
  span: SpanId;
  /** can the tile be hidden from #settings? */
  hideable: boolean;
  tone: ToneId;
}

export const TILES: TileDef[] = [
  { id: "clock", job: "What time it is", span: "2x1", hideable: false, tone: "surface" },
  { id: "weather", job: "Outside right now", span: "2x1", hideable: true, tone: "secondary" },
  { id: "agenda", job: "Today's plan", span: "2x2", hideable: false, tone: "surface" },
  { id: "capture", job: "Capture a thought", span: "1x1", hideable: false, tone: "primary" },
  { id: "habits", job: "Habits done today", span: "1x1", hideable: true, tone: "tertiary" },
  { id: "focus", job: "Deep work this week", span: "1x1", hideable: true, tone: "quiet" },
  { id: "notes", job: "Latest note", span: "1x1", hideable: true, tone: "surface" },
  { id: "month", job: "Month at a glance", span: "2x1", hideable: true, tone: "surface" },
  { id: "signal", job: "This week's numbers", span: "2x1", hideable: true, tone: "quiet" },
];

export const TILE_BY_ID: Record<string, TileDef> = Object.fromEntries(
  TILES.map((t) => [t.id, t])
);

/* =========================================================================
   3. weather (pinned — the board never fetches anything)
   ========================================================================= */

export interface WeatherHour {
  time: string;
  temp: number;
  kind: "sun" | "part" | "cloud" | "rain";
}

export interface WeatherDay {
  day: string;
  kind: "sun" | "part" | "cloud" | "rain";
  hi: number;
  lo: number;
}

export const WEATHER = {
  place: "Lisbon",
  temp: 21,
  feels: 20,
  kind: "sun" as const,
  summary: "Clear · light breeze from the west",
  high: 24,
  low: 15,
  humidity: 46,
  wind: "11 km/h W",
  hours: [
    { time: "09", temp: 19, kind: "sun" },
    { time: "11", temp: 20, kind: "sun" },
    { time: "13", temp: 21, kind: "part" },
    { time: "15", temp: 24, kind: "sun" },
    { time: "17", temp: 22, kind: "part" },
    { time: "19", temp: 19, kind: "cloud" },
  ] as WeatherHour[],
  days: [
    { day: "Tue", kind: "sun", hi: 25, lo: 16 },
    { day: "Wed", kind: "part", hi: 24, lo: 15 },
    { day: "Thu", kind: "cloud", hi: 21, lo: 14 },
    { day: "Fri", kind: "rain", hi: 19, lo: 13 },
    { day: "Sat", kind: "sun", hi: 26, lo: 17 },
  ] as WeatherDay[],
};

/* =========================================================================
   4. agenda — minutes from midnight, ISO day
   ========================================================================= */

export type EventTone = "primary" | "secondary" | "tertiary" | "quiet";

export interface AgendaEvent {
  id: string;
  day: string;
  /** minutes from midnight */
  start: number;
  title: string;
  where: string;
  tone: EventTone;
}

export const EVENTS: AgendaEvent[] = [
  { id: "e1", day: "2026-09-28", start: 9 * 60, title: "Stand-up with the design crew", where: "Huddle · 15 min", tone: "quiet" },
  { id: "e2", day: "2026-09-28", start: 10 * 60 + 30, title: "Facet board review", where: "Studio 2", tone: "primary" },
  { id: "e3", day: "2026-09-28", start: 13 * 60, title: "Lunch with Ines", where: "Prado", tone: "secondary" },
  { id: "e4", day: "2026-09-28", start: 15 * 60, title: "Prototype clinic", where: "Workshop", tone: "tertiary" },
  { id: "e5", day: "2026-09-28", start: 17 * 60 + 30, title: "Evening run · 6 km", where: "Riverside", tone: "quiet" },
  { id: "e6", day: "2026-09-29", start: 9 * 60 + 30, title: "1:1 with the platform team", where: "Video", tone: "primary" },
  { id: "e7", day: "2026-09-29", start: 12 * 60, title: "Design critique", where: "Studio 2", tone: "tertiary" },
  { id: "e8", day: "2026-09-30", start: 10 * 60, title: "Dentist", where: "Clínica Graça", tone: "quiet" },
  { id: "e9", day: "2026-09-30", start: 16 * 60, title: "Quarterly numbers", where: "Room 4", tone: "secondary" },
  { id: "e10", day: "2026-10-01", start: 9 * 60, title: "Sprint planning", where: "Studio 2", tone: "primary" },
  { id: "e11", day: "2026-10-01", start: 14 * 60, title: "Library research block", where: "Quiet", tone: "quiet" },
  { id: "e12", day: "2026-10-02", start: 11 * 60, title: "Facet tile layouts", where: "Desk", tone: "tertiary" },
  { id: "e13", day: "2026-10-05", start: 10 * 60, title: "Team offsite", where: "Sintra", tone: "primary" },
  { id: "e14", day: "2026-10-06", start: 15 * 60, title: "Retro", where: "Studio 2", tone: "secondary" },
  { id: "e15", day: "2026-10-08", start: 9 * 60 + 30, title: "Board walkthrough", where: "Room 1", tone: "tertiary" },
  { id: "e16", day: "2026-10-09", start: 13 * 60, title: "Coffee with Marco", where: "Bica", tone: "quiet" },
  { id: "e17", day: "2026-10-12", start: 10 * 60, title: "Accessibility audit", where: "Remote", tone: "primary" },
  { id: "e18", day: "2026-10-13", start: 16 * 60 + 30, title: "Show-and-tell", where: "Studio 2", tone: "tertiary" },
];

/* =========================================================================
   5. habits — the ring on the board
   ========================================================================= */

export interface Habit {
  id: string;
  name: string;
  /** target per day */
  target: number;
  done: boolean;
  tone: EventTone;
}

export const HABITS: Habit[] = [
  { id: "h1", name: "Morning walk", target: 1, done: true, tone: "tertiary" },
  { id: "h2", name: "Inbox to zero", target: 1, done: true, tone: "secondary" },
  { id: "h3", name: "Read 20 pages", target: 1, done: false, tone: "quiet" },
  { id: "h4", name: "No phone after 10", target: 1, done: false, tone: "primary" },
  { id: "h5", name: "Stretch break", target: 3, done: false, tone: "secondary" },
];

/** Longest run at the top of the list, in days — a pinned stat, not a clock. */
export const HABIT_STREAK = 12;

/* =========================================================================
   6. captures — quick capture, really appended
   ========================================================================= */

export interface Capture {
  id: string;
  text: string;
  /** short deterministic stamp, e.g. "08:40" — never a live clock read */
  at: string;
  done: boolean;
}

export const CAPTURES: Capture[] = [
  { id: "cap-1", text: "Ask Rui about the offline cache story", at: "08:12", done: false },
  { id: "cap-2", text: "Book the tile-grid workshop room", at: "08:40", done: true },
  { id: "cap-3", text: "Rewrite the bento spacing rule in one sentence", at: "09:05", done: false },
];

/* =========================================================================
   7. notes — list + editor
   ========================================================================= */

export interface Note {
  id: string;
  title: string;
  body: string;
  /** pinned label, so the list reads the same on every load */
  stamp: string;
  tag: string;
}

export const NOTES: Note[] = [
  {
    id: "n1",
    title: "Bento rules, one page",
    tag: "Design",
    stamp: "Edited 2h ago",
    body:
      "A bento tile does ONE job. If you need a second idea in there, add a second tile.\n\n" +
      "Size carries meaning: the bigger the tile, the more often you need it. A 2×2 is the thing you check every morning; a 1×1 is the thing you glance at.\n\n" +
      "Tiles are borderless. The gutter is the separation — 14px of felt background between every card. No borders, because a border reads as a table cell and a table cell has a job of its own.\n\n" +
      "Nothing scrolls inside a tile. If the content is too tall, either the tile is too small or the content is wrong.",
  },
  {
    id: "n2",
    title: "Facet — what ships first",
    tag: "Product",
    stamp: "Edited yesterday",
    body:
      "1. The board. Clock, weather, agenda, capture, habits — five tiles that answer 'what is happening today' without opening anything.\n" +
      "2. The calendar, because the agenda tile needs a place to go.\n" +
      "3. Notes, because a dashboard that cannot hold a thought is a screensaver.\n\n" +
      "Settings last, but the hide-tile control has to exist from day one — the whole point of a bento board is that the user owns the layout.",
  },
  {
    id: "n3",
    title: "Container queries, not media queries",
    tag: "Engineering",
    stamp: "Edited 3 days ago",
    body:
      "The window is its own query container, named `surface`. A media query would follow the browser window; a container query follows the prototype window, which is what actually matters when the stage puts two panels beside it.\n\n" +
      "At 900px the board drops to two columns and the 2×2 tiles become 2×1. That is a layout change, not a squeeze: the tiles keep their aspect ratio and the reading order stays left-to-right, top-to-bottom.",
  },
  {
    id: "n4",
    title: "Monday reset checklist",
    tag: "Routine",
    stamp: "Edited last week",
    body:
      "· Clear the capture inbox, or move it to the agenda\n" +
      "· Pick the one thing that, if it slips, makes the week feel lost\n" +
      "· Re-read last week's note before opening anything new\n" +
      "· Walk for twenty minutes — not as a reward, as a warm-up",
  },
  {
    id: "n5",
    title: "Reading list",
    tag: "Personal",
    stamp: "Edited last week",
    body:
      "The Design of Everyday Things — Norman\n" +
      "Shape Up — Singer\n" +
      "A Pattern Language — Alexander\n" +
      "How Buildings Learn — Stewart Brand",
  },
];

/* =========================================================================
   8. the small numeric tiles
   ========================================================================= */

export const CLOCK = {
  /** a pinned time, because a live clock would make the prototype
   *  non-deterministic (and a screenshot would never match) */
  time: "09:41",
  seconds: 24,
  timezone: "WEST",
  greeting: "Good morning",
  /** the day's shape, used by the progress arc in the clock tile */
  elapsedPct: 41,
  doneToday: 2,
  totalToday: 5,
};

export const FOCUS = {
  hours: 11.5,
  goal: 15,
  /** pinned 7-day series, Monday first — drives the bar chart */
  week: [1.5, 2.25, 1, 2.5, 2, 1.75, 0.5],
  delta: "+18% vs last week",
};

export const SIGNAL = [
  { id: "s1", label: "Steps", value: "7 240", unit: "of 9 000", pct: 80 },
  { id: "s2", label: "Focus", value: "11.5", unit: "hours", pct: 77 },
  { id: "s3", label: "Inbox", value: "3", unit: "captures", pct: 38 },
  { id: "s4", label: "Sleep", value: "7h 20", unit: "of 8h", pct: 92 },
];

export const SHORTCUTS: { keys: string; what: string }[] = [
  { keys: "⌘K", what: "Command palette — views, notes, tile actions" },
  { keys: "1 – 4", what: "Jump to Board / Calendar / Notes / Settings" },
  { keys: "C", what: "Focus the quick-capture field" },
  { keys: "[ ]", what: "Shrink or grow the selected tile" },
  { keys: "← →", what: "Previous / next month (on Calendar)" },
  { keys: "Esc", what: "Close the palette, the note editor's selection" },
];
