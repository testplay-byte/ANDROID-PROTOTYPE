/**
 * counter / data — deterministic demo data for the Counter booking desk.
 *
 * Everything here is FIXED. No Math.random, no Date.now, no `new Date()`
 * without arguments: the schedule grid, the totals and the counters must look
 * identical on every load so reviewers can talk about the same screen.
 *
 * "Today" is pinned to 2026-09-28, a Monday, so the default week is
 * Mon 28 Sep → Sun 4 Oct and the week-start preference visibly reorders the
 * same seven days.
 *
 * Times are stored as MINUTES FROM MIDNIGHT (540 = 09:00) so overlap maths
 * in the booking form is plain integer comparison — no date parsing at all.
 */

/** The frozen "today" for this prototype. Monday. */
export const TODAY = "2026-09-28";

/** The seven ISO days of the pinned week, in Monday-first order. */
export const WEEK_MON_FIRST = [
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
];

/** Opening hours of the schedule grid, in minutes from midnight. */
export const DAY_START = 8 * 60; // 08:00
export const DAY_END = 18 * 60; // 18:00
/** Vertical size of one hour row, in px. Fixed so the grid is deterministic. */
export const HOUR_PX = 38;

/** Status vocabulary — the transitions the detail panel performs. */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "no-show"
  | "cancelled";

export interface Service {
  id: string;
  name: string;
  /** minutes — drives the block height in the grid AND the end time */
  duration: number;
  /** whole pounds; 0 = free / included */
  price: number;
  category: string;
  /** archived services stay visible on #services but cannot be booked */
  active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  initials: string;
  /** which flat block tone this person uses in the schedule */
  tone: "a" | "b" | "c" | "d";
}

export interface Booking {
  id: string;
  serviceId: string;
  staffId: string;
  customer: string;
  /** ISO day, one of WEEK_MON_FIRST */
  day: string;
  /** minutes from midnight */
  start: number;
  status: BookingStatus;
  /** optional free-text note shown in the detail panel */
  note: string;
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "checked-in": "Checked in",
  completed: "Completed",
  "no-show": "No show",
  cancelled: "Cancelled",
};

/** The status pipeline, in order — the detail panel offers exactly these. */
export const STATUS_FLOW: BookingStatus[] = [
  "pending",
  "confirmed",
  "checked-in",
  "completed",
  "no-show",
  "cancelled",
];

/** Statuses that still occupy the calendar block. */
export const ACTIVE_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "checked-in",
  "completed",
];

export const STAFF: Staff[] = [
  { id: "s-ana", name: "Ana Duarte", initials: "AD", tone: "a" },
  { id: "s-bo", name: "Bo Lindqvist", initials: "BL", tone: "b" },
  { id: "s-cass", name: "Cass Oyelaran", initials: "CO", tone: "c" },
  { id: "s-dev", name: "Devi Raman", initials: "DR", tone: "d" },
];

export const SERVICES: Service[] = [
  { id: "sv-cut", name: "Signature cut", duration: 45, price: 58, category: "Hair", active: true },
  { id: "sv-colour", name: "Full colour", duration: 120, price: 145, category: "Hair", active: true },
  { id: "sv-gloss", name: "Gloss + tone", duration: 40, price: 44, category: "Colour", active: true },
  { id: "sv-blow", name: "Blow dry", duration: 30, price: 32, category: "Hair", active: true },
  { id: "sv-beard", name: "Beard sculpt", duration: 25, price: 26, category: "Grooming", active: true },
  { id: "sv-facial", name: "Deep-clean facial", duration: 60, price: 72, category: "Skin", active: true },
  { id: "sv-peel", name: "Enzyme peel", duration: 35, price: 48, category: "Skin", active: true },
  { id: "sv-consult", name: "Consultation", duration: 20, price: 0, category: "Consult", active: true },
  { id: "sv-repair", name: "Keratin repair", duration: 90, price: 110, category: "Colour", active: true },
  { id: "sv-haircut-legacy", name: "Dry cut (legacy)", duration: 30, price: 28, category: "Hair", active: false },
];

export const BOOKINGS: Booking[] = [
  /* ---- Monday 28 Sep (today) ---- */
  { id: "b-01", serviceId: "sv-cut", staffId: "s-ana", customer: "Priya Raman", day: "2026-09-28", start: 9 * 60, status: "completed", note: "Keep the length, blunt the ends." },
  { id: "b-02", serviceId: "sv-colour", staffId: "s-ana", customer: "Noor Haddad", day: "2026-09-28", start: 10 * 60 + 15, status: "completed", note: "Level 8, virgin box." },
  { id: "b-03", serviceId: "sv-consult", staffId: "s-ana", customer: "Marguerite Obi", day: "2026-09-28", start: 13 * 60, status: "cancelled", note: "Enquiry only — no patch test yet." },
  { id: "b-04", serviceId: "sv-facial", staffId: "s-ana", customer: "Iris Kwan", day: "2026-09-28", start: 14 * 60, status: "confirmed", note: "First visit — sensitive skin." },

  { id: "b-05", serviceId: "sv-blow", staffId: "s-bo", customer: "Sam Okonjo", day: "2026-09-28", start: 9 * 60, status: "checked-in", note: "" },
  { id: "b-06", serviceId: "sv-peel", staffId: "s-bo", customer: "Theo Lindgren", day: "2026-09-28", start: 10 * 60, status: "checked-in", note: "Course of three — session 2." },
  { id: "b-07", serviceId: "sv-gloss", staffId: "s-bo", customer: "Wren Adeyemi", day: "2026-09-28", start: 12 * 60, status: "confirmed", note: "" },
  { id: "b-08", serviceId: "sv-cut", staffId: "s-bo", customer: "Jonas Beck", day: "2026-09-28", start: 15 * 60, status: "pending", note: "Text if running late." },

  { id: "b-09", serviceId: "sv-consult", staffId: "s-cass", customer: "Elena Rossi", day: "2026-09-28", start: 8 * 60 + 30, status: "completed", note: "" },
  { id: "b-10", serviceId: "sv-repair", staffId: "s-cass", customer: "Dev Shah", day: "2026-09-28", start: 11 * 60, status: "confirmed", note: "Prefers low-heat." },
  { id: "b-11", serviceId: "sv-facial", staffId: "s-cass", customer: "Halima Yusuf", day: "2026-09-28", start: 14 * 60 + 30, status: "confirmed", note: "" },

  { id: "b-12", serviceId: "sv-beard", staffId: "s-dev", customer: "Marcus Hale", day: "2026-09-28", start: 10 * 60, status: "no-show", note: "Left a voicemail." },
  { id: "b-13", serviceId: "sv-cut", staffId: "s-dev", customer: "Lucia Ferrari", day: "2026-09-28", start: 12 * 60 + 30, status: "confirmed", note: "" },

  /* ---- Tuesday 29 Sep ---- */
  { id: "b-14", serviceId: "sv-colour", staffId: "s-ana", customer: "Rosa Delgado", day: "2026-09-29", start: 9 * 60, status: "confirmed", note: "Balayage, two tones." },
  { id: "b-15", serviceId: "sv-peel", staffId: "s-ana", customer: "Ines Farrow", day: "2026-09-29", start: 12 * 60, status: "pending", note: "" },
  { id: "b-16", serviceId: "sv-facial", staffId: "s-ana", customer: "Otto Vogel", day: "2026-09-29", start: 15 * 60, status: "confirmed", note: "" },

  { id: "b-17", serviceId: "sv-cut", staffId: "s-bo", customer: "Priya Raman", day: "2026-09-29", start: 9 * 60 + 30, status: "confirmed", note: "Six weeks since the last cut." },
  { id: "b-18", serviceId: "sv-blow", staffId: "s-bo", customer: "Tariq Mensah", day: "2026-09-29", start: 11 * 60, status: "pending", note: "" },
  { id: "b-19", serviceId: "sv-gloss", staffId: "s-bo", customer: "Aiko Tanaka", day: "2026-09-29", start: 16 * 60, status: "confirmed", note: "Blonde, weekly upkeep." },

  { id: "b-20", serviceId: "sv-consult", staffId: "s-cass", customer: "Felipe Souza", day: "2026-09-29", start: 9 * 60, status: "confirmed", note: "" },
  { id: "b-21", serviceId: "sv-repair", staffId: "s-cass", customer: "Bea Nowak", day: "2026-09-29", start: 13 * 60, status: "pending", note: "" },

  { id: "b-22", serviceId: "sv-beard", staffId: "s-dev", customer: "Sean Whelan", day: "2026-09-29", start: 10 * 60 + 30, status: "confirmed", note: "" },
  { id: "b-23", serviceId: "sv-cut", staffId: "s-dev", customer: "Yara Haddad", day: "2026-09-29", start: 14 * 60, status: "pending", note: "" },

  /* ---- Wednesday 30 Sep ---- */
  { id: "b-24", serviceId: "sv-colour", staffId: "s-ana", customer: "Nina Petrova", day: "2026-09-30", start: 8 * 60 + 30, status: "confirmed", note: "Root refresh." },
  { id: "b-25", serviceId: "sv-cut", staffId: "s-ana", customer: "Gwen Ashby", day: "2026-09-30", start: 12 * 60, status: "pending", note: "" },
  { id: "b-26", serviceId: "sv-facial", staffId: "s-bo", customer: "Idris Bello", day: "2026-09-30", start: 10 * 60, status: "confirmed", note: "" },
  { id: "b-27", serviceId: "sv-blow", staffId: "s-bo", customer: "Marguerite Obi", day: "2026-09-30", start: 15 * 60, status: "pending", note: "" },
  { id: "b-28", serviceId: "sv-consult", staffId: "s-cass", customer: "Aleks Petrov", day: "2026-09-30", start: 9 * 60 + 30, status: "confirmed", note: "" },
  { id: "b-29", serviceId: "sv-cut", staffId: "s-dev", customer: "Wren Adeyemi", day: "2026-09-30", start: 11 * 60, status: "confirmed", note: "" },

  /* ---- Thursday 1 Oct ---- */
  { id: "b-30", serviceId: "sv-repair", staffId: "s-ana", customer: "Salma Idris", day: "2026-10-01", start: 9 * 60, status: "pending", note: "" },
  { id: "b-31", serviceId: "sv-gloss", staffId: "s-bo", customer: "Dev Shah", day: "2026-10-01", start: 10 * 60, status: "confirmed", note: "" },
  { id: "b-32", serviceId: "sv-peel", staffId: "s-cass", customer: "Elena Rossi", day: "2026-10-01", start: 13 * 60, status: "confirmed", note: "Course of three — session 1." },
  { id: "b-33", serviceId: "sv-beard", staffId: "s-dev", customer: "Marcus Hale", day: "2026-10-01", start: 12 * 60, status: "pending", note: "Re-booked after the no-show." },

  /* ---- Friday 2 Oct ---- */
  { id: "b-34", serviceId: "sv-colour", staffId: "s-ana", customer: "Lucia Ferrari", day: "2026-10-02", start: 9 * 60 + 30, status: "confirmed", note: "" },
  { id: "b-35", serviceId: "sv-cut", staffId: "s-ana", customer: "Tariq Mensah", day: "2026-10-02", start: 14 * 60, status: "pending", note: "" },
  { id: "b-36", serviceId: "sv-facial", staffId: "s-bo", customer: "Rosa Delgado", day: "2026-10-02", start: 11 * 60, status: "confirmed", note: "" },
  { id: "b-37", serviceId: "sv-consult", staffId: "s-cass", customer: "Yara Haddad", day: "2026-10-02", start: 10 * 60, status: "pending", note: "" },
  { id: "b-38", serviceId: "sv-blow", staffId: "s-dev", customer: "Aiko Tanaka", day: "2026-10-02", start: 16 * 60, status: "confirmed", note: "" },

  /* ---- Saturday 3 Oct ---- */
  { id: "b-39", serviceId: "sv-cut", staffId: "s-ana", customer: "Gwen Ashby", day: "2026-10-03", start: 10 * 60, status: "confirmed", note: "" },
  { id: "b-40", serviceId: "sv-peel", staffId: "s-bo", customer: "Otto Vogel", day: "2026-10-03", start: 11 * 60, status: "confirmed", note: "" },
  { id: "b-41", serviceId: "sv-facial", staffId: "s-cass", customer: "Halima Yusuf", day: "2026-10-03", start: 13 * 60, status: "pending", note: "" },
];

/* ---------------------------------------------------------------- helpers */

/** 540 → "09:00". Pure string maths, no Date. */
export function hhmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}

/** "09:00" → 540, for reading a form input back. */
export function toMinutes(hhmmString: string): number {
  const [h, m] = hhmmString.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

/** 0 = Sunday … 6 = Saturday, hard-coded per ISO day (no Date parsing). */
const WEEKDAY_INDEX: Record<string, number> = {
  "2026-09-28": 1,
  "2026-09-29": 2,
  "2026-09-30": 3,
  "2026-10-01": 4,
  "2026-10-02": 5,
  "2026-10-03": 6,
  "2026-10-04": 0,
};

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Weekday index of an ISO day from the pinned week. */
export function weekdayIndex(day: string): number {
  return WEEKDAY_INDEX[day] ?? 0;
}

/** "2026-09-28" → "28 Sep". */
export function shortDate(day: string): string {
  const [, m, d] = day.split("-");
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
    parseInt(m, 10) - 1
  ];
  return `${parseInt(d, 10)} ${month}`;
}

export const serviceById = (id: string): Service | undefined => SERVICES.find((s) => s.id === id);
export const staffById = (id: string): Staff | undefined => STAFF.find((s) => s.id === id);
export const bookingById = (list: Booking[], id: string | null): Booking | undefined =>
  id ? list.find((b) => b.id === id) : undefined;

/** End time of a booking, derived from the service duration. */
export function bookingEnd(b: Booking): number {
  const svc = serviceById(b.serviceId);
  return b.start + (svc?.duration ?? 30);
}

export function bookingPrice(b: Booking): number {
  return serviceById(b.serviceId)?.price ?? 0;
}

/** Two bookings collide when they overlap on the same day AND the same person. */
export function overlaps(
  a: { day: string; staffId: string; start: number; end: number },
  b: { day: string; staffId: string; start: number; end: number }
): boolean {
  return a.day === b.day && a.staffId === b.staffId && a.start < b.end && b.start < a.end;
}

export const money = (n: number) => (n === 0 ? "Free" : `£${n.toFixed(0)}`);

export function durationLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
