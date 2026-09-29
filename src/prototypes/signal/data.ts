/**
 * signal / data — deterministic demo data for the analytics console.
 *
 * NOTHING here is random and nothing here reads the clock:
 *   · the daily series come from a FIXED-SEED mulberry32 generator, so the
 *     same curve is drawn on every load and in every reviewer's browser;
 *   · the calendar is pinned to a fictional "today" (2026-09-29) and the
 *     labels are computed with pure day-of-year arithmetic — no `new Date`,
 *     no `Date.now`, no locale surprises.
 *
 * The range selector is real: every window (7D / 30D / 90D) slices the same
 * 210-day history, and each view derives its numbers from the slice it is
 * given, so changing the range genuinely re-scales the whole console.
 */

/* ------------------------------------------------------------------ *
 * Seeded generator — mulberry32. Small, fast, and identical forever.
 * ------------------------------------------------------------------ */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ *
 * Pinned calendar. Day-of-year arithmetic only — deliberately no Date.
 * ------------------------------------------------------------------ */
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Day-of-year (1-based) for a 1-indexed month/day in a non-leap year. */
function dayOfYear(month1: number, day: number): number {
  let n = day;
  for (let m = 0; m < month1 - 1; m++) n += MONTH_DAYS[m];
  return n;
}

/** "2026-09-29" → 272. */
const TODAY_DOY = dayOfYear(9, 29);
const HISTORY = 210; // 90d current + 90d comparison + headroom

/** Day-of-year → { label: "12 Sep", dow: 0..6 (Mon-first) }. */
function calendarEntry(doyRaw: number) {
  // wrap into 1..365 so the history can run back through the year boundary
  let doy = ((doyRaw - 1) % 365 + 365) % 365 + 1;
  let m = 0;
  while (doy > MONTH_DAYS[m]) {
    doy -= MONTH_DAYS[m];
    m++;
  }
  // 2026-09-29 is a Tuesday → day 2 in a Mon-first week.
  const dow = (doyRaw + 1) % 7;
  return { label: `${doy} ${MONTH_SHORT[m]}`, dow, month: MONTH_SHORT[m] };
}

/** Human label for a bucket that spans several days. */
function spanLabel(doyRaw: number, days: number): string {
  const a = calendarEntry(doyRaw);
  const b = calendarEntry(doyRaw + days - 1);
  return a.month === b.month ? `${a.label} – ${b.label}` : a.label;
}

/* ------------------------------------------------------------------ *
 * Dimensions
 * ------------------------------------------------------------------ */
export type RangeId = "7d" | "30d" | "90d";
export type PlatformId = "all" | "web" | "ios" | "android" | "desktop";
export type PlanId = "all" | "free" | "pro" | "team" | "enterprise";

export interface RangeDef {
  id: RangeId;
  label: string;
  days: number;
  /** how many bars the stacked chart buckets the window into */
  buckets: number;
  /** how the bucket is labelled in the axis */
  bucketDays: number;
}

export const RANGES: RangeDef[] = [
  { id: "7d", label: "7D", days: 7, buckets: 7, bucketDays: 1 },
  { id: "30d", label: "30D", days: 30, buckets: 10, bucketDays: 3 },
  { id: "90d", label: "90D", days: 90, buckets: 12, bucketDays: 8 },
];

export const rangeDef = (id: RangeId): RangeDef => RANGES.find((r) => r.id === id) ?? RANGES[1];

export interface Platform {
  id: PlatformId;
  label: string;
  /** share of sessions, fixed so the stacked bars always total 100% */
  share: number;
  /** multiplier applied to the whole-platform funnel volume */
  weight: number;
}

export const PLATFORMS: Platform[] = [
  { id: "all", label: "All platforms", share: 1, weight: 1 },
  { id: "web", label: "Web", share: 0.38, weight: 1.06 },
  { id: "ios", label: "iOS", share: 0.27, weight: 0.92 },
  { id: "android", label: "Android", share: 0.24, weight: 0.81 },
  { id: "desktop", label: "Desktop app", share: 0.11, weight: 0.58 },
];

export interface Plan {
  id: PlanId;
  label: string;
  share: number;
  /** retention multiplier — enterprise sticks, free churns */
  retention: number;
  /** ARPU in whole dollars, for the revenue ring */
  arpu: number;
}

export const PLANS: Plan[] = [
  { id: "all", label: "All plans", share: 1, retention: 1, arpu: 41 },
  { id: "free", label: "Free", share: 0.54, retention: 0.86, arpu: 0 },
  { id: "pro", label: "Pro", share: 0.28, retention: 1.04, arpu: 29 },
  { id: "team", label: "Team", share: 0.13, retention: 1.16, arpu: 74 },
  { id: "enterprise", label: "Enterprise", share: 0.05, retention: 1.28, arpu: 186 },
];

export const platformOf = (id: PlatformId): Platform => PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
export const planOf = (id: PlanId): Plan => PLANS.find((p) => p.id === id) ?? PLANS[0];

/* ------------------------------------------------------------------ *
 * The daily history — 210 rows, oldest first.
 * ------------------------------------------------------------------ */
export interface DayRecord {
  i: number;
  /** day-of-year, for stable date maths */
  doy: number;
  date: string;
  dow: number;
  activeUsers: number;
  sessions: number;
  signups: number;
  /** share of new users who ran their first query within the day */
  activation: number;
  /** p95 query latency, ms */
  latency: number;
  /** share of queries that errored, % */
  errorRate: number;
  /** sessions split per platform — index-aligned with PLATFORMS[1..] */
  byPlatform: number[];
  /** paid conversion of active users, % */
  paid: number;
}

function buildHistory(): DayRecord[] {
  const rng = mulberry32(0x51694e41); // "SignA"
  const out: DayRecord[] = [];
  const base = 4200;

  for (let i = 0; i < HISTORY; i++) {
    const t = i / (HISTORY - 1);
    const doy = TODAY_DOY - (HISTORY - 1 - i);
    const cal = calendarEntry(doy);
    const weekend = cal.dow >= 5 ? 0.74 : 1;
    // slow growth + a mid-window plateau + gentle weekly ripple
    const trend = 1 + 0.34 * t - 0.06 * Math.max(0, Math.sin((t - 0.35) * 5));
    const ripple = 1 + 0.05 * Math.sin((i / 7) * Math.PI * 2);
    const noise = 0.95 + rng() * 0.1;

    const activeUsers = Math.round(base * trend * weekend * ripple * noise);
    const sessions = Math.round(activeUsers * (1.62 + rng() * 0.3));
    const signups = Math.round(activeUsers * (0.052 + rng() * 0.014));
    const activation = 46 + 9 * t + (rng() - 0.5) * 6;
    const latency = Math.round(214 - 52 * t + (rng() - 0.5) * 26);
    const errorRate = Math.max(0.2, 1.34 - 0.7 * t + (rng() - 0.5) * 0.4);
    const paid = 4.1 + 1.5 * t + (rng() - 0.5) * 0.8;

    // platform split — shares wobble slightly per day but never reorder
    const jitter = PLATFORMS.slice(1).map(() => 0.86 + rng() * 0.28);
    const raw = PLATFORMS.slice(1).map((p, k) => p.share * jitter[k]);
    const sum = raw.reduce((a, b) => a + b, 0);
    const byPlatform = raw.map((v) => Math.round((v / sum) * sessions));

    out.push({
      i,
      doy,
      date: cal.label,
      dow: cal.dow,
      activeUsers,
      sessions,
      signups,
      activation,
      latency,
      errorRate,
      byPlatform,
      paid,
    });
  }
  return out;
}

export const HISTORY_DAYS: DayRecord[] = buildHistory();

export interface Window {
  id: RangeId;
  def: RangeDef;
  /** the selected range, oldest → newest */
  current: DayRecord[];
  /** the immediately preceding window of equal length — the comparison series */
  previous: DayRecord[];
  labels: string[];
  /** how many days each axis bucket covers */
  bucketDays: number;
}

/** Slice the history for a range. Deterministic, and cheap enough to memoise. */
export function windowFor(id: RangeId): Window {
  const def = rangeDef(id);
  const end = HISTORY_DAYS.length;
  const current = HISTORY_DAYS.slice(end - def.days, end);
  const previous = HISTORY_DAYS.slice(Math.max(0, end - def.days * 2), end - def.days);
  const bucketDays = Math.max(1, Math.round(def.days / def.buckets));
  const labels: string[] = [];
  for (let i = 0; i < current.length; i += bucketDays) {
    labels.push(def.bucketDays === 1 ? current[i].date : spanLabel(current[i].doy, bucketDays));
  }
  return { id, def, current, previous, labels, bucketDays };
}

/* ------------------------------------------------------------------ *
 * KPI metrics
 * ------------------------------------------------------------------ */
export type MetricId = "activeUsers" | "sessions" | "signups" | "activation" | "latency";

export interface Metric {
  id: MetricId;
  label: string;
  unit: string;
  /** lower is better — flips the delta's colour */
  inverse?: boolean;
  format: (n: number) => string;
  /** the windowed value, and the change vs the comparison window */
  read: (w: Window) => { value: number; delta: number; spark: number[] };
}

const sum = (rows: DayRecord[], k: "activeUsers" | "sessions" | "signups") =>
  rows.reduce((a, d) => a + d[k], 0);
const avg = (rows: DayRecord[], k: "activation" | "latency" | "errorRate" | "paid") =>
  rows.length ? rows.reduce((a, d) => a + d[k], 0) / rows.length : 0;

const pctChange = (now: number, before: number) => (before === 0 ? 0 : ((now - before) / before) * 100);

export const compact = (n: number): string => {
  const a = Math.abs(n);
  if (a === 0) return "0";
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 10_000) return `${(n / 1000).toFixed(a >= 100_000 ? 0 : 1)}k`;
  if (a >= 1000) return n.toLocaleString("en-US");
  if (a >= 100) return String(Math.round(n));
  if (a >= 10) return n.toFixed(1);
  return n.toFixed(2);
};

export const METRICS: Metric[] = [
  {
    id: "activeUsers",
    label: "Active users",
    unit: "users/day",
    format: compact,
    read: (w) => {
      const value = sum(w.current, "activeUsers") / w.current.length;
      return {
        value,
        delta: pctChange(value, sum(w.previous, "activeUsers") / (w.previous.length || 1)),
        spark: w.current.map((d) => d.activeUsers),
      };
    },
  },
  {
    id: "sessions",
    label: "Sessions",
    unit: "sessions/day",
    format: compact,
    read: (w) => {
      const value = sum(w.current, "sessions") / w.current.length;
      return {
        value,
        delta: pctChange(value, sum(w.previous, "sessions") / (w.previous.length || 1)),
        spark: w.current.map((d) => d.sessions),
      };
    },
  },
  {
    id: "signups",
    label: "New signups",
    unit: "signups/day",
    format: compact,
    read: (w) => {
      const value = sum(w.current, "signups") / w.current.length;
      return {
        value,
        delta: pctChange(value, sum(w.previous, "signups") / (w.previous.length || 1)),
        spark: w.current.map((d) => d.signups),
      };
    },
  },
  {
    id: "activation",
    label: "Activation",
    unit: "% of signups",
    format: (n) => `${n.toFixed(1)}%`,
    read: (w) => {
      const value = avg(w.current, "activation");
      return {
        value,
        delta: pctChange(value, avg(w.previous, "activation")),
        spark: w.current.map((d) => d.activation),
      };
    },
  },
  {
    id: "latency",
    label: "p95 latency",
    unit: "ms",
    inverse: true,
    format: (n) => `${Math.round(n)} ms`,
    read: (w) => {
      const value = avg(w.current, "latency");
      return {
        value,
        delta: pctChange(value, avg(w.previous, "latency")),
        spark: w.current.map((d) => d.latency),
      };
    },
  },
];

export const metricOf = (id: MetricId): Metric => METRICS.find((m) => m.id === id) ?? METRICS[0];

/* ------------------------------------------------------------------ *
 * Stacked series — sessions by platform, bucketed over the window
 * ------------------------------------------------------------------ */
export interface Stack {
  key: PlatformId;
  label: string;
  values: number[];
  total: number;
}

export function stackedSessions(w: Window): { stacks: Stack[]; labels: string[]; totals: number[] } {
  const labels: string[] = [];
  const buckets: DayRecord[][] = [];
  for (let i = 0; i < w.current.length; i += w.bucketDays) {
    buckets.push(w.current.slice(i, i + w.bucketDays));
    const first = w.current[i];
    labels.push(w.def.bucketDays === 1 ? first.date : spanLabel(first.doy, w.bucketDays));
  }
  const stacks: Stack[] = PLATFORMS.slice(1).map((p, k) => {
    const values = buckets.map((b) => b.reduce((a, d) => a + d.byPlatform[k], 0));
    return { key: p.id, label: p.label, values, total: values.reduce((a, b) => a + b, 0) };
  });
  const totals = buckets.map((b) => b.reduce((a, d) => a + d.sessions, 0));
  return { stacks, labels, totals };
}

/* ------------------------------------------------------------------ *
 * Plan mix — the ring. The split is over PAYING USERS, not revenue:
 * free-tier users pay nothing, so a revenue-weighted ring would have a
 * zero-length Free arc (and, worse, arpu is 0 for Free, so any weight of
 * the form share/arpu is Infinity). MRR is then the arpu-weighted sum.
 * ------------------------------------------------------------------ */
export interface Slice {
  key: PlanId;
  label: string;
  /** paying users on this plan */
  users: number;
  /** share of paying users, 0..1 */
  share: number;
  /** monthly recurring revenue contributed */
  mrr: number;
}

export function revenueMix(
  w: Window,
  plan: PlanId
): { slices: Slice[]; mrr: number; customers: number; days: number } {
  const paying = w.current.reduce((a, d) => a + (d.activeUsers * d.paid) / 100, 0);
  const list = PLANS.filter((p) => p.id !== "all" && (plan === "all" || p.id === plan));
  const sumShare = list.reduce((a, p) => a + p.share, 0) || 1;

  const slices: Slice[] = list.map((p) => {
    const users = Math.round(paying * (p.share / sumShare));
    return { key: p.id, label: p.label, users, share: p.share / sumShare, mrr: users * p.arpu };
  });

  return {
    slices,
    mrr: slices.reduce((a, s) => a + s.mrr, 0),
    customers: slices.reduce((a, s) => a + s.users, 0),
    days: w.current.length,
  };
}

/* ------------------------------------------------------------------ *
 * Funnel — activation funnel, per platform segment
 * ------------------------------------------------------------------ */
export interface FunnelStep {
  id: string;
  label: string;
  hint: string;
  users: number;
  /** share of the FIRST step (0..1) */
  ofTop: number;
  /** share of the previous step (0..1) */
  ofPrev: number;
  /** users lost at this step */
  lost: number;
}

export const FUNNEL_STEPS = [
  { id: "visit", label: "Visited pricing", hint: "Landing + docs" },
  { id: "signup", label: "Created workspace", hint: "Email verified" },
  { id: "activate", label: "Ran first query", hint: "Within 24 h" },
  { id: "invite", label: "Invited a teammate", hint: "2+ seats" },
  { id: "paid", label: "Started a paid plan", hint: "Card on file" },
];

/** step-to-step conversion, tuned per platform — iOS converts worse, desktop better */
const FUNNEL_RATIOS: Record<PlatformId, number[]> = {
  all: [0.42, 0.71, 0.38, 0.29],
  web: [0.47, 0.76, 0.44, 0.34],
  ios: [0.36, 0.63, 0.31, 0.22],
  android: [0.33, 0.58, 0.28, 0.19],
  desktop: [0.53, 0.82, 0.51, 0.41],
};

export function funnelFor(w: Window, platform: PlatformId, plan: PlanId): FunnelStep[] {
  const rng = mulberry32(0x0f01e1e1 + w.def.days * 7 + platform.length * 31 + plan.length * 17);
  const volume = w.current.reduce((a, d) => a + d.sessions, 0) * platformOf(platform).weight * 0.185;
  const ratios = FUNNEL_RATIOS[platform];
  const planFactor = plan === "all" ? 1 : 0.45 + planOf(plan).retention * 0.28;

  let prev = Math.round(volume * (0.9 + rng() * 0.2));
  const top = prev;
  return FUNNEL_STEPS.map((s, k) => {
    const users = k === 0 ? prev : Math.round(prev * ratios[k - 1] * (0.97 + rng() * 0.06) * planFactor);
    const lost = k === 0 ? 0 : prev - users;
    prev = users;
    return { ...s, users, ofTop: top ? users / top : 0, ofPrev: k === 0 ? 1 : users / (users + lost), lost };
  });
}

/* ------------------------------------------------------------------ *
 * Retention — weekly cohorts × weeks
 * ------------------------------------------------------------------ */
export interface Cohort {
  id: string;
  /** cohort week, e.g. "W/c 24 Aug" */
  label: string;
  size: number;
  /** weeks 0..7, % of the cohort still active (week 0 is always 100) */
  values: number[];
}

const COHORT_SHAPE = [
  [100, 48, 35, 29, 25, 22, 20, 19],
  [100, 47, 34, 28, 25, 22, 21, 19],
  [100, 45, 33, 27, 24, 21, 20, 18],
  [100, 49, 36, 30, 26, 23, 21, 20],
  [100, 51, 38, 32, 28, 24, 22, 21],
  [100, 53, 40, 33, 29, 25, 23, 22],
  [100, 55, 42, 35, 30, 26, 24, 23],
  [100, 57, 44, 37, 32, 28, 25, 24],
];

export function cohortsFor(plan: PlanId): Cohort[] {
  const rng = mulberry32(0x0c04707e + plan.length * 13);
  const mult = planOf(plan).retention;
  return COHORT_SHAPE.map((shape, k) => {
    // the last two cohorts have not had time to mature — trim their tail
    const age = 7 - k;
    const start = TODAY_DOY - (7 - k) * 7 - 4;
    const cal = calendarEntry(start);
    const values = shape.map((v, w) => {
      if (w > age) return Number.NaN; // not yet observed
      const jitter = w === 0 ? 0 : (rng() - 0.5) * 2.4;
      return Math.max(0, Math.min(100, Math.round(v * mult + jitter)));
    });
    return {
      id: `c${k}`,
      label: `W/c ${cal.label}`,
      size: Math.round(980 * mult * (1 - k * 0.045) * (0.94 + rng() * 0.12)),
      values,
    };
  });
}

/* ------------------------------------------------------------------ *
 * Explore — the event table
 * ------------------------------------------------------------------ */
export type EventCategory = "acquisition" | "activation" | "engagement" | "revenue" | "reliability";
export type SortDir = "asc" | "desc";
export type SortKey = "event" | "category" | "users" | "volume" | "delta" | "trend";

export interface EventRow {
  id: string;
  event: string;
  category: EventCategory;
  users: number;
  volume: number;
  delta: number;
  /** last 14 days, for the in-row sparkline */
  trend: number[];
  /** median dispatch latency, already formatted for the readout */
  p50: string;
  firstSeen: string;
  owner: string;
  platforms: { id: PlatformId; share: number }[];
  properties: { name: string; value: string; share: number }[];
}

const EV: [string, EventCategory, number, number, number, string, string][] = [
  ["session_started", "acquisition", 18420, 61240, 8.4, "41 ms", "24 Aug 2025"],
  ["pricing_viewed", "acquisition", 9310, 24880, 12.1, "88 ms", "02 Sep 2025"],
  ["workspace_created", "activation", 6140, 6140, 6.2, "1.4 s", "12 Aug 2025"],
  ["first_query_run", "activation", 4920, 7310, 17.8, "2.9 s", "12 Aug 2025"],
  ["query_saved", "engagement", 3110, 9840, -3.4, "320 ms", "19 Jul 2025"],
  ["dashboard_created", "engagement", 2740, 4180, 22.6, "1.1 s", "03 Sep 2025"],
  ["teammate_invited", "activation", 1980, 3020, 9.7, "760 ms", "28 Aug 2025"],
  ["plan_upgraded", "revenue", 412, 412, 14.5, "3.2 s", "05 Jun 2025"],
  ["invoice_viewed", "revenue", 986, 2140, -1.8, "410 ms", "05 Jun 2025"],
  ["export_csv", "engagement", 1420, 3890, -6.2, "1.8 s", "21 Jul 2025"],
  ["query_failed", "reliability", 940, 2760, 31.4, "—", "18 Sep 2025"],
  ["rate_limited", "reliability", 386, 1140, -12.7, "12 ms", "30 Aug 2025"],
  ["api_key_created", "activation", 720, 720, 4.1, "540 ms", "09 Sep 2025"],
  ["webhook_registered", "engagement", 512, 688, 2.3, "390 ms", "14 Sep 2025"],
];

function trendFor(i: number, delta: number): number[] {
  const rng = mulberry32(0x7e4d + i * 977);
  const out: number[] = [];
  let v = 100 - delta * 0.9;
  for (let k = 0; k < 14; k++) {
    v += (delta / 13) + (rng() - 0.5) * 9;
    out.push(Math.max(6, v));
  }
  return out;
}

export const EVENTS: EventRow[] = EV.map(([event, category, users, volume, delta, p50, firstSeen], i) => ({
  id: `e-${i}`,
  event,
  category,
  users,
  volume,
  delta,
  trend: trendFor(i, delta),
  p50,
  firstSeen,
  owner: ["Growth", "Core", "Core", "Core", "Core", "Analytics", "Growth", "Billing", "Billing", "Analytics", "Platform", "Platform", "Core", "Core"][i],
  platforms: [
    { id: "web", share: 38 + (i % 5) * 3 },
    { id: "ios", share: 27 - (i % 3) * 2 },
    { id: "android", share: 24 - (i % 4) * 2 },
    { id: "desktop", share: 11 + (i % 2) * 3 },
  ],
  properties: [
    { name: "surface", value: ["web", "ios", "android"][i % 3], share: 46 + (i % 4) * 7 },
    { name: "plan", value: i % 5 === 0 ? "pro" : "free", share: 54 + (i % 3) * 6 },
    { name: "entry", value: ["organic", "referral", "direct"][i % 3], share: 31 + (i % 6) * 5 },
    { name: "country", value: ["GB", "US", "DE", "BR"][i % 4], share: 24 + (i % 5) * 4 },
  ],
}));

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  acquisition: "Acquisition",
  activation: "Activation",
  engagement: "Engagement",
  revenue: "Revenue",
  reliability: "Reliability",
};

export const CATEGORIES: EventCategory[] = ["acquisition", "activation", "engagement", "revenue", "reliability"];

export const eventById = (id: string | null) => EVENTS.find((e) => e.id === id);

/* ------------------------------------------------------------------ *
 * Live activity feed — deterministic, with a fixed "seconds ago" column.
 * ------------------------------------------------------------------ */
export type FeedTone = "ok" | "info" | "warn" | "bad";

export interface FeedItem {
  id: string;
  /** seconds before the pinned "now" */
  at: number;
  event: string;
  detail: string;
  value: string;
  tone: FeedTone;
}

export const FEED: FeedItem[] = [
  { id: "f-1", at: 4, event: "plan_upgraded", detail: "Northwind → Team, 12 seats", value: "+$888", tone: "ok" },
  { id: "f-2", at: 19, event: "query_failed", detail: "rate_limited · eu-west-2", value: "412", tone: "bad" },
  { id: "f-3", at: 37, event: "dashboard_created", detail: "Acme Retail · onboarding-7", value: "1", tone: "info" },
  { id: "f-4", at: 58, event: "teammate_invited", detail: "Halden Group · 3 invites", value: "3", tone: "ok" },
  { id: "f-5", at: 96, event: "export_csv", detail: "Pallas · 12,480 rows", value: "12.5k", tone: "info" },
  { id: "f-6", at: 141, event: "webhook_registered", detail: "Verdan Retail · ingest", value: "1", tone: "info" },
  { id: "f-7", at: 204, event: "pricing_viewed", detail: "Kestrel Labs · /plans/team", value: "7", tone: "info" },
  { id: "f-8", at: 268, event: "query_failed", detail: "timeout · ap-south-1", value: "1.2k", tone: "warn" },
  { id: "f-9", at: 330, event: "api_key_created", detail: "Orchard Co · production", value: "1", tone: "info" },
  { id: "f-10", at: 402, event: "workspace_created", detail: "Northwind · self-serve", value: "1", tone: "ok" },
  { id: "f-11", at: 470, event: "session_started", detail: "Web · 38% of traffic", value: "6.1k", tone: "info" },
  { id: "f-12", at: 545, event: "query_saved", detail: "Quarry Co · shared view", value: "24", tone: "info" },
];

/** "4s" / "3m" / "1h 12m" — from a fixed second count, never from the clock. */
export function ago(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

/* ------------------------------------------------------------------ *
 * Anomalies — the caution list on the overview
 * ------------------------------------------------------------------ */
export interface Anomaly {
  id: string;
  metric: string;
  detail: string;
  change: number;
  tone: "warn" | "bad";
}

export const ANOMALIES: Anomaly[] = [
  { id: "a-1", metric: "query_failed", detail: "eu-west-2 · rate_limited", change: 31.4, tone: "bad" },
  { id: "a-2", metric: "p95 latency", detail: "ap-south-1 · +38 ms", change: 17.9, tone: "warn" },
  { id: "a-3", metric: "iOS activation", detail: "after the 4.2.1 release", change: -9.6, tone: "warn" },
  { id: "a-4", metric: "Android signup", detail: "play store rollout 60%", change: 22.3, tone: "ok" as "warn" },
];

/* ------------------------------------------------------------------ *
 * Formatting helpers shared by every screen
 * ------------------------------------------------------------------ */
export const fmtInt = (n: number): string => Math.round(n).toLocaleString("en-US");

export const fmtMoney = (n: number): string =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;

export const fmtDelta = (n: number): string => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1)}%`;

export const fmtPct = (n: number, digits = 1): string => `${(n * 100).toFixed(digits)}%`;

export const WEEKDAY = WEEKDAY_SHORT;
