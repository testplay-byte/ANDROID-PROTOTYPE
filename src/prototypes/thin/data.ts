/**
 * thin / data — deterministic demo data for "Thin", a minimal desktop
 * tasks + writing app.
 *
 * Everything here is FIXED. No Math.random, no Date.now, no `new Date()`:
 * the list, the counts, the projects and the daily notes must look
 * identical on every load so two people can talk about the same screen.
 *
 * "Today" is pinned to 2026-09-29 (a Tuesday). Two days sit *before* it on
 * purpose: the Today view folds overdue work into the same quiet list and
 * labels it, so "what is left" is one screen instead of two.
 *
 * `order` is an explicit integer, never an array index: sorting by it keeps
 * the list stable no matter which task was just ticked or filed.
 */

/** The frozen "today" for this prototype. */
export const TODAY = "2026-09-29";

/** The pinned day before today, used for the two overdue tasks. */
export const YESTERDAY = "2026-09-28";
export const LAST_WEEK = "2026-09-22";

export const DAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

/** Long form of a frozen ISO date: "Tuesday, 29 September". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return `${DAY_LONG[weekdayIndex(iso)]}, ${d} ${MONTH_FULL[m - 1]}`;
}

export const MONTH_FULL = [
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

/** 0 = Sunday … 6 = Saturday, computed by hand (no Date). */
export function weekdayIndex(iso: string): number {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  /* days from the civil epoch, Howard Hinnant's algorithm */
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const days = era * 146097 + doe - 719468;
  return ((days % 7) + 7 + 4) % 7; // 1970-01-01 was a Thursday (4)
}

/** ISO date → "29 Sep", for the one place a task's date is spelled out. */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return `${d} ${MONTH_SHORT[m - 1]}`;
}

/**
 * Does this task belong on Today's list?
 *
 * Two cases only: it is dated today (finished or not — you did it today),
 * or it is still OPEN from an earlier day (it is genuinely left). Work
 * finished days ago is not "left today", and dragging it back onto the list
 * every morning is how a to-do list stops being trustworthy.
 *
 * Shared by the list, the header counts, the project filter and the sidebar
 * badge so they can never disagree.
 */
export function onTodayList(t: Task): boolean {
  return !t.archived && t.day !== null && t.day <= TODAY && (!t.done || t.day === TODAY);
}

/** 25 minutes → "25m", 90 → "1h 30m". */
export function estLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export interface Project {
  id: string;
  name: string;
  /** the one-word area shown under the name in the master list */
  area: string;
  /** a single quiet line under the project title in the detail column */
  note: string;
}

export interface Task {
  id: string;
  title: string;
  /** null = unfiled, so it lives in the inbox */
  projectId: string | null;
  /** null = no date, so it lives in the inbox */
  day: string | null;
  done: boolean;
  archived: boolean;
  /** minutes — shown small and grey, never as a progress bar */
  est: number;
  /** explicit sort key; see the file header */
  order: number;
}

export const PROJECTS: Project[] = [
  {
    id: "p-site",
    name: "Website rebuild",
    area: "Work",
    note: "Ships at the end of the month. Nothing about the visual design is settled.",
  },
  {
    id: "p-invoice",
    name: "Q4 invoicing",
    area: "Work",
    note: "Two clients still owe money. Chase on Tuesdays, never on Fridays.",
  },
  {
    id: "p-hire",
    name: "Studio hire",
    area: "Work",
    note: "One desk, one chair, one very good lamp.",
  },
  {
    id: "p-garden",
    name: "Garden",
    area: "Home",
    note: "Hedge cut before the end of the month or the neighbours will notice.",
  },
  {
    id: "p-reading",
    name: "Reading",
    area: "Self",
    note: "Twenty minutes, every evening, phone in another room.",
  },
];

export function projectById(id: string | null | undefined): Project | undefined {
  if (!id) return undefined;
  return PROJECTS.find((p) => p.id === id);
}

export const TASKS: Task[] = [
  /* ---- today, filed ------------------------------------------------- */
  { id: "t-01", title: "Rewrite the pricing page intro", projectId: "p-site", day: TODAY, done: false, archived: false, est: 45, order: 1 },
  { id: "t-02", title: "Send the Q4 invoice reminders", projectId: "p-invoice", day: TODAY, done: true, archived: false, est: 15, order: 2 },
  { id: "t-03", title: "Reply to the two studio viewings", projectId: "p-hire", day: TODAY, done: false, archived: false, est: 20, order: 3 },
  { id: "t-04", title: "Book the hedge trim", projectId: "p-garden", day: TODAY, done: false, archived: false, est: 10, order: 4 },
  { id: "t-05", title: "Read chapter four", projectId: "p-reading", day: TODAY, done: true, archived: false, est: 20, order: 5 },
  { id: "t-06", title: "Fix the mobile menu on Safari", projectId: "p-site", day: TODAY, done: false, archived: false, est: 30, order: 6 },
  { id: "t-07", title: "Collect the signed timesheet", projectId: "p-hire", day: TODAY, done: false, archived: false, est: 15, order: 7 },
  { id: "t-08", title: "Write the weekly note", projectId: null, day: TODAY, done: false, archived: false, est: 10, order: 8 },
  { id: "t-09", title: "Water the seedlings", projectId: "p-garden", day: TODAY, done: true, archived: false, est: 5, order: 9 },

  /* ---- overdue, folded into today ----------------------------------- */
  { id: "t-10", title: "Send the deposit invoice", projectId: "p-invoice", day: YESTERDAY, done: false, archived: false, est: 15, order: 10 },
  { id: "t-11", title: "Export the old blog archive", projectId: "p-site", day: LAST_WEEK, done: false, archived: false, est: 40, order: 11 },

  /* ---- later days, so projects have real work in them ---------------- */
  { id: "t-12", title: "Move the hosting to the new account", projectId: "p-site", day: "2026-10-02", done: false, archived: false, est: 60, order: 12 },
  { id: "t-13", title: "Draft the three desk options", projectId: "p-hire", day: "2026-10-01", done: false, archived: false, est: 50, order: 13 },
  { id: "t-14", title: "Compare the two lamps", projectId: "p-hire", day: "2026-10-01", done: false, archived: false, est: 25, order: 14 },
  { id: "t-15", title: "Ask the accountant about the estimate", projectId: "p-invoice", day: "2026-10-05", done: false, archived: false, est: 20, order: 15 },
  { id: "t-16", title: "Cut back the beech hedge", projectId: "p-garden", day: "2026-10-03", done: false, archived: false, est: 90, order: 16 },
  { id: "t-17", title: "Order the compost", projectId: "p-garden", day: "2026-09-30", done: false, archived: false, est: 10, order: 17 },
  { id: "t-18", title: "Finish the notes for chapter four", projectId: "p-reading", day: "2026-10-04", done: false, archived: false, est: 30, order: 18 },
  { id: "t-19", title: "Rewrite the navigation labels", projectId: "p-site", day: "2026-10-02", done: false, archived: false, est: 40, order: 19 },
  { id: "t-20", title: "Photograph the finished pages", projectId: "p-site", day: "2026-10-06", done: false, archived: false, est: 35, order: 20 },

  /* ---- done and finished earlier ------------------------------------- */
  { id: "t-21", title: "Clear the July invoices", projectId: "p-invoice", day: "2026-09-24", done: true, archived: false, est: 25, order: 21 },
  { id: "t-22", title: "Cancel the old broadband", projectId: "p-hire", day: "2026-09-25", done: true, archived: false, est: 20, order: 22 },
  { id: "t-23", title: "Read chapters one to three", projectId: "p-reading", day: "2026-09-26", done: true, archived: false, est: 60, order: 23 },
  { id: "t-24", title: "Sharpen the shears", projectId: "p-garden", day: "2026-09-23", done: true, archived: true, est: 15, order: 24 },
  { id: "t-25", title: "Delete the staging site", projectId: "p-site", day: "2026-09-20", done: true, archived: true, est: 10, order: 25 },

  /* ---- the inbox: captured, never filed ------------------------------ */
  { id: "t-26", title: "Ask about the accessibility audit", projectId: null, day: null, done: false, archived: false, est: 15, order: 26 },
  { id: "t-27", title: "Replace the kitchen tap washer", projectId: null, day: null, done: false, archived: false, est: 20, order: 27 },
  { id: "t-28", title: "Find the original proof of the letterpress card", projectId: null, day: null, done: false, archived: false, est: 30, order: 28 },
  { id: "t-29", title: "Look up whether the lamp is dimmable", projectId: null, day: null, done: false, archived: false, est: 10, order: 29 },
  { id: "t-30", title: "Return the wrong-sized drill bits", projectId: null, day: null, done: false, archived: false, est: 15, order: 30 },
];

/** The three seeded daily notes — plain text, saved the moment you type. */
export const SEED_NOTES: Record<string, string> = {
  "2026-09-24": "Cleared the July invoices. Two clients still haven't paid, so the chasing starts next Tuesday, not today.",
  "2026-09-28": "Only two things left. The site export is the one I keep putting off because it is boring, not because it is hard.\n\nThe studio viewing is at four.",
  [TODAY]:
    "Slow start. The pricing page is written, which is the part everyone can see, and the Safari menu is the part nobody can see, which is the part that matters.\n\nNote to self: chase the deposit on the way back from the studio.",
};
