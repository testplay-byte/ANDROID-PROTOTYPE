/* pulse / lib/data — static mock data + deterministic generators.

   All "random" values come from hash01(seed, index): a pure function, so
   sparklines and metric series are identical on every render — no RNG
   drift between screens, remounts or refreshes. */

/* ------------------------------ types ------------------------------ */

export type ServiceState = "operational" | "degraded" | "down";
export type Severity = "sev-1" | "sev-2" | "sev-3";
export type IncidentState = "open" | "acknowledged" | "resolved";
export type MetricId = "cpu" | "mem" | "lat";
export type RangeId = "1h" | "6h" | "12h" | "24h";

export interface Service {
  id: string;
  name: string;
  zone: string;
  /** Base p50 response time in ms when operational. */
  p50: number;
  /** 30-day uptime, percent. */
  uptime: number;
}

export interface IncidentEvent {
  time: string;
  label: string;
}

export interface Incident {
  id: string;
  serviceId: string;
  severity: Severity;
  title: string;
  opened: string;
  duration: string;
  events: IncidentEvent[];
}

export interface RangeDef {
  id: RangeId;
  label: string;
  /** Point stride through the 288-point (5-min) master series. */
  stride: number;
  labels: string[];
}

/* ---------------------------- determinism --------------------------- */

/** Stable pseudo-random in [0,1) from two integers — pure, drift-free. */
export function hash01(a: number, b: number): number {
  let t = (a * 374761393 + b * 668265263) | 0;
  t = ((t ^ (t >>> 13)) * 1274126177) | 0;
  t = t ^ (t >>> 16);
  return (t >>> 0) / 4294967295;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/* ----------------------------- services ----------------------------- */

export const SERVICES: Service[] = [
  { id: "api", name: "API Gateway", zone: "us-east-1", p50: 118, uptime: 99.98 },
  { id: "auth", name: "Auth Service", zone: "us-east-1", p50: 96, uptime: 99.99 },
  { id: "payments", name: "Payments Core", zone: "eu-west-2", p50: 412, uptime: 99.92 },
  { id: "console", name: "Web Console", zone: "global", p50: 240, uptime: 99.97 },
  { id: "search", name: "Search Index", zone: "us-west-1", p50: 188, uptime: 99.95 },
  { id: "pg", name: "Postgres Primary", zone: "us-east-1", p50: 24, uptime: 99.999 },
  { id: "redis", name: "Redis Cache", zone: "us-east-1", p50: 4, uptime: 100.0 },
  { id: "queue", name: "Queue Worker", zone: "eu-west-2", p50: 61, uptime: 99.96 },
  { id: "cdn", name: "CDN Edge", zone: "global", p50: 32, uptime: 99.99 },
  { id: "mail", name: "Mail Relay", zone: "us-west-1", p50: 305, uptime: 99.89 },
  { id: "objects", name: "Object Store", zone: "multi", p50: 44, uptime: 99.99 },
  { id: "push", name: "Push Notifier", zone: "us-east-1", p50: 77, uptime: 99.94 },
];

/* ----------------------------- incidents ----------------------------- */

export const INCIDENTS: Incident[] = [
  {
    id: "INC-1042",
    serviceId: "payments",
    severity: "sev-1",
    title: "Payments Core returning 5xx on checkout",
    opened: "09:41",
    duration: "4h 12m",
    events: [
      { time: "09:41", label: "Synthetic checkout probe failed 6/6 — alert fired" },
      { time: "09:43", label: "On-call paged (eu-west-2 rotation)" },
      { time: "09:58", label: "Elevated 5xx confirmed at the load balancer" },
      { time: "10:02", label: "Rolling restart of payment pods started" },
      { time: "—", label: "Awaiting error-rate decay to baseline" },
    ],
  },
  {
    id: "INC-1039",
    serviceId: "search",
    severity: "sev-2",
    title: "Search index replication lag above 90s",
    opened: "07:18",
    duration: "6h 35m",
    events: [
      { time: "07:18", label: "Replication lag metric crossed 90s SLO" },
      { time: "07:26", label: "Acknowledged by platform on-call" },
      { time: "08:05", label: "Lag steady at 120s — indexer shard 3 hot" },
      { time: "—", label: "Reindex scheduled off-peak, monitoring lag" },
    ],
  },
  {
    id: "INC-1036",
    serviceId: "mail",
    severity: "sev-3",
    title: "Mail relay SMTP timeouts (us-west-1)",
    opened: "Sep 25, 22:04",
    duration: "51m · resolved",
    events: [
      { time: "22:04", label: "Timeouts on outbound relay pool B" },
      { time: "22:19", label: "Upstream provider confirmed degraded route" },
      { time: "22:55", label: "Failover to pool A completed" },
      { time: "22:55", label: "Resolved — backlog drained by 23:40" },
    ],
  },
  {
    id: "INC-1031",
    serviceId: "queue",
    severity: "sev-2",
    title: "Queue worker retry backlog after deploy",
    opened: "Sep 24, 14:32",
    duration: "1h 47m · resolved",
    events: [
      { time: "14:32", label: "Dead-letter rate spiked after v24.9.2 rollout" },
      { time: "14:47", label: "Deploy rollback initiated" },
      { time: "15:20", label: "Backlog consuming at 3× rate" },
      { time: "16:19", label: "Resolved — DLQ rate back to zero" },
    ],
  },
];

/** Incidents acknowledged by default (seeded "known issue" state). */
export const DEFAULT_ACKS = ["INC-1039"];
/** Incidents resolved by default. */
export const DEFAULT_RESOLVED = ["INC-1036", "INC-1031"];

/* ------------------------- derived statuses -------------------------- */

export function incidentStateOf(
  incident: Incident,
  acks: string[],
  resolved: string[]
): IncidentState {
  if (resolved.includes(incident.id)) return "resolved";
  if (acks.includes(incident.id)) return "acknowledged";
  return "open";
}

/** A sev-1 drives a service red; sev-2/3 amber. Resolved incidents don't affect status. */
export function serviceStatusOf(
  service: Service,
  incidents: Incident[],
  acks: string[],
  resolved: string[]
): ServiceState {
  let status: ServiceState = "operational";
  for (const inc of incidents) {
    if (inc.serviceId !== service.id) continue;
    if (incidentStateOf(inc, acks, resolved) === "resolved") continue;
    if (inc.severity === "sev-1") return "down";
    status = "degraded";
  }
  return status;
}

/** Effective p50: degraded +45 %, down +260 % (matches the incident fiction). */
export function serviceP50(service: Service, status: ServiceState): number {
  if (status === "down") return Math.round(service.p50 * 3.6);
  if (status === "degraded") return Math.round(service.p50 * 1.45);
  return service.p50;
}

/** 16-point sparkline for a service — deterministic, shifted by status. */
export function sparkline(serviceIndex: number, status: ServiceState): number[] {
  const seed = 10 + serviceIndex * 7 + (status === "down" ? 3 : status === "degraded" ? 2 : 0);
  const out: number[] = [];
  for (let i = 0; i < 16; i++) {
    let base = 50 + 18 * Math.sin(i / 2.6 + seed);
    if (status === "down" && i > 10) base = 88 - (15 - i) * 2;
    if (status === "degraded" && i > 11) base = 72 + hash01(seed, i) * 18;
    out.push(clamp(base + hash01(seed, i) * 16, 4, 96));
  }
  return out;
}

/* ------------------------------ metrics ------------------------------ */

/** 288-point master series (5-min resolution over 24h) per metric. */
function genMaster(
  seed: number,
  base: number,
  amp: number,
  wave: number,
  noise: number,
  trend: number,
  spike: { center: number; width: number; height: number } | null,
  hi: number
): number[] {
  const out: number[] = [];
  for (let i = 0; i < 288; i++) {
    let v =
      base +
      amp * Math.sin((i / 288) * Math.PI * 2 * wave + seed) +
      hash01(seed, i) * noise +
      (i / 288) * trend;
    if (spike) {
      v += spike.height * Math.exp(-((i - spike.center) ** 2) / (2 * spike.width * spike.width));
    }
    out.push(Math.round(clamp(v, 0, hi) * 10) / 10);
  }
  return out;
}

const MASTER: Record<MetricId, number[]> = {
  // Fleet CPU % — morning payment-incident spike around 09:40 (i ≈ 200).
  cpu: genMaster(11, 36, 10, 1.6, 9, 6, { center: 200, width: 14, height: 34 }, 100),
  // Fleet memory % — slow crawl, sawtooth of the 03:00 cache eviction.
  mem: genMaster(23, 58, 4, 0.9, 5, 9, { center: 141, width: 10, height: -12 }, 100),
  // p95 latency ms — spikes with the sev-1 window.
  lat: genMaster(37, 92, 16, 2.1, 34, 12, { center: 202, width: 18, height: 168 }, 500),
};

export const METRICS: Record<MetricId, { label: string; unit: string; hi: number }> = {
  cpu: { label: "CPU utilization", unit: "%", hi: 100 },
  mem: { label: "Memory pressure", unit: "%", hi: 100 },
  lat: { label: "p95 latency", unit: "ms", hi: 500 },
};

export const RANGES: RangeDef[] = [
  { id: "1h", label: "1H", stride: 1, labels: ["−60m", "−45m", "−30m", "−15m", "now"] },
  { id: "6h", label: "6H", stride: 6, labels: ["−6h", "−4.5h", "−3h", "−1.5h", "now"] },
  { id: "12h", label: "12H", stride: 12, labels: ["−12h", "−9h", "−6h", "−3h", "now"] },
  { id: "24h", label: "24H", stride: 24, labels: ["−24h", "−18h", "−12h", "−6h", "now"] },
];

/** 12 sampled points for a metric over a range — same world, different zoom. */
export function seriesFor(metric: MetricId, range: RangeId): number[] {
  const stride = RANGES.find((r) => r.id === range)?.stride ?? 24;
  const master = MASTER[metric];
  const out: number[] = [];
  for (let i = 0; i < 12; i++) {
    out.push(master[Math.min(287, 287 - (11 - i) * stride)]);
  }
  return out;
}

/** Peak of a series (for the chart's y-ceiling). */
export function peakOf(metric: MetricId, range: RangeId): number {
  const s = seriesFor(metric, range);
  return Math.max(...s);
}

/* ------------------------------ formatting ---------------------------- */

export function fmtMs(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`;
}

export function fmtPct(v: number): string {
  return v === 100 ? "100.00" : v.toFixed(v >= 99.99 ? 3 : 2);
}

export const STATUS_LABEL: Record<ServiceState, string> = {
  operational: "OPERATIONAL",
  degraded: "DEGRADED",
  down: "DOWN",
};
