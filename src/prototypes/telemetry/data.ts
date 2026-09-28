/* telemetry / data — static mock data + deterministic generators.

   Same contract as the phone sibling (pulse/lib/data.ts): every "random"
   value comes from hash01(seed, index), a pure integer hash, so charts,
   sparklines and uptime bars are byte-identical on every render, remount
   and refresh. There is NO Math.random and NO Date anywhere in this file —
   timestamps are literal strings, not clocks. */

/* ------------------------------ types ------------------------------ */

export type ServiceState = "healthy" | "degraded" | "down";
export type Severity = "sev-1" | "sev-2" | "sev-3";
export type IncidentState = "open" | "acknowledged" | "resolved";
export type MetricId = "cpu" | "mem" | "lat";
export type RangeId = "1h" | "6h" | "12h" | "24h";
export type Tier = "edge" | "compute" | "data" | "platform";

export interface Service {
  id: string;
  name: string;
  /** Infrastructure tier — the group heading on the Fleet tiles. */
  tier: Tier;
  /** Region / availability-zone group the service runs in. */
  region: string;
  /** Owning team (on-call rota is separate, see ONCALL). */
  team: string;
  /** Nodes currently reporting in. */
  nodes: number;
  /** Baseline p50 request latency in ms when healthy. */
  p50: number;
  /** 5xx + timeout rate, percent. */
  errorRate: number;
  /** 30-day uptime, percent. */
  uptime: number;
  /** SLO target for this service, percent. */
  slo: number;
}

export interface IncidentEvent {
  /** Wall-clock label from the alert, or "—" for a pending step. */
  time: string;
  label: string;
}

export interface Incident {
  id: string;
  serviceId: string;
  severity: Severity;
  title: string;
  /** Human age, e.g. "1h 48m" — fixed strings, never a live clock. */
  age: string;
  opened: string;
  commander: string;
  channel: string;
  summary: string;
  events: IncidentEvent[];
}

export interface OnCall {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Rotation window label, e.g. "Primary · 08:00–20:00 UTC". */
  shift: string;
  pages: number;
}

export interface RangeDef {
  id: RangeId;
  label: string;
  /** How many points of the 288-point (5-minute) master series the window covers. */
  span: number;
  /** Human window label used in captions. */
  window: string;
  labels: string[];
}

export interface MetricMeta {
  id: MetricId;
  label: string;
  caption: string;
  unit: "%" | "ms";
  /** Hard axis ceiling for the metric. */
  hi: number;
  /** Service-level objective shown in the chart's stat strip. */
  slo: string;
  kind: "line" | "bar";
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
  { id: "edge", name: "Edge Gateway", tier: "edge", region: "global", team: "Traffic", nodes: 24, p50: 46, errorRate: 0.04, uptime: 99.94, slo: 99.9 },
  { id: "cdn", name: "CDN Edge", tier: "edge", region: "global", team: "Traffic", nodes: 38, p50: 28, errorRate: 0.02, uptime: 99.99, slo: 99.95 },
  { id: "router", name: "API Router", tier: "compute", region: "us-east-1", team: "Core Services", nodes: 18, p50: 62, errorRate: 0.06, uptime: 99.97, slo: 99.9 },
  { id: "auth", name: "Auth Service", tier: "compute", region: "us-east-1", team: "Identity", nodes: 12, p50: 88, errorRate: 0.05, uptime: 99.98, slo: 99.95 },
  { id: "ledger", name: "Ledger Core", tier: "compute", region: "eu-west-2", team: "Payments", nodes: 14, p50: 214, errorRate: 0.09, uptime: 99.91, slo: 99.9 },
  { id: "worker", name: "Queue Worker", tier: "compute", region: "eu-west-2", team: "Async", nodes: 16, p50: 54, errorRate: 0.11, uptime: 99.86, slo: 99.5 },
  { id: "index", name: "Search Index", tier: "data", region: "us-west-1", team: "Discovery", nodes: 9, p50: 176, errorRate: 0.08, uptime: 99.95, slo: 99.9 },
  { id: "bridge", name: "Kafka Bridge", tier: "data", region: "us-east-1", team: "Streaming", nodes: 11, p50: 71, errorRate: 0.14, uptime: 99.72, slo: 99.5 },
  { id: "metrics", name: "Metrics Store", tier: "data", region: "us-east-1", team: "Observability", nodes: 8, p50: 132, errorRate: 0.07, uptime: 99.88, slo: 99.5 },
  { id: "objects", name: "Object Store", tier: "data", region: "multi", team: "Storage", nodes: 21, p50: 39, errorRate: 0.03, uptime: 99.99, slo: 99.95 },
  { id: "config", name: "Config Service", tier: "platform", region: "multi", team: "Platform", nodes: 6, p50: 12, errorRate: 0.01, uptime: 100, slo: 99.99 },
  { id: "relay", name: "Mail Relay", tier: "platform", region: "us-west-1", team: "Messaging", nodes: 7, p50: 208, errorRate: 0.12, uptime: 99.89, slo: 99.5 },
];

export const TIER_LABEL: Record<Tier, string> = {
  edge: "Edge",
  compute: "Compute",
  data: "Data",
  platform: "Platform",
};


/* ------------------------- 30-day uptime bars ------------------------ */

/**
 * 30 daily uptime percentages, oldest first. Degraded services dip in the
 * last three days, a down service blanks the last day — the bar strip tells
 * the same story as the incident queue.
 */
export function uptimeBars(index: number, state: ServiceState): number[] {
  const seed = 101 + index * 17;
  const out: number[] = [];
  for (let d = 0; d < 30; d++) {
    let v = 100 - hash01(seed, d) * 0.6;
    if (state === "degraded" && d >= 27) v = 97.2 - hash01(seed + 1, d) * 1.9;
    if (state === "down" && d === 29) v = 91.4;
    else if (state === "down" && d === 28) v = 96.1;
    out.push(Math.round(v * 10) / 10);
  }
  return out;
}

/** 20-point request-rate sparkline, shifted by the current state. */
export function sparkline(index: number, state: ServiceState): number[] {
  const seed = 30 + index * 9 + (state === "down" ? 5 : state === "degraded" ? 3 : 0);
  const out: number[] = [];
  for (let i = 0; i < 20; i++) {
    let v = 52 + 20 * Math.sin(i / 2.2 + seed * 0.13);
    if (state === "degraded" && i > 14) v = 66 + hash01(seed, i) * 20;
    if (state === "down" && i > 16) v = 90 - (19 - i) * 9;
    out.push(clamp(v + hash01(seed, i) * 12, 3, 99));
  }
  return out;
}

/** Effective p50 under load: degraded +45 %, down +260 %. */
export function effectiveP50(service: Service, state: ServiceState): number {
  if (state === "down") return Math.round(service.p50 * 3.6);
  if (state === "degraded") return Math.round(service.p50 * 1.45);
  return service.p50;
}

/* ----------------------------- incidents ----------------------------- */

export const INCIDENTS: Incident[] = [
  {
    id: "INC-2201",
    serviceId: "edge",
    severity: "sev-1",
    title: "Edge Gateway shedding 40% of eu-west-2 traffic",
    age: "1h 48m",
    opened: "13:12",
    commander: "A. Okonjo",
    channel: "#inc-edge-euw2",
    summary:
      "Upstream health checks fail on 9 of 24 edge nodes. The gateway is shedding load to the eu-west-1 pool and p50 is 4× baseline.",
    events: [
      { time: "13:12", label: "Synthetic probe from 3 regions failed 12/12 — alert fired" },
      { time: "13:14", label: "Primary on-call paged from the eu-west-2 rota" },
      { time: "13:26", label: "9 nodes confirmed in a failed readiness cycle" },
      { time: "13:48", label: "Traffic shifted to the eu-west-1 pool, shedding reduced to 12%" },
      { time: "—", label: "Rolling drain of the failed nodes in progress" },
    ],
  },
  {
    id: "INC-2198",
    serviceId: "bridge",
    severity: "sev-2",
    title: "Kafka Bridge consumer lag above 120k messages",
    age: "3h 05m",
    opened: "11:07",
    commander: "R. Delacroix",
    channel: "#inc-streaming",
    summary:
      "The search-index consumer group has fallen 120k messages behind. No data loss, but index freshness is now 6 minutes.",
    events: [
      { time: "11:07", label: "Consumer lag crossed the 120k SLO for 5 minutes" },
      { time: "11:12", label: "Acknowledged by the streaming on-call" },
      { time: "11:44", label: "Partition 7 rebalanced — lag flat at 96k" },
      { time: "13:20", label: "Lag recovering at 18k messages per minute" },
      { time: "—", label: "Holding until lag stays under 20k for 15 minutes" },
    ],
  },
  {
    id: "INC-2194",
    serviceId: "metrics",
    severity: "sev-2",
    title: "Metrics Store compaction backlog on shard 3",
    age: "52m",
    opened: "13:08",
    commander: "S. Nakamura",
    channel: "#inc-observability",
    summary:
      "Compaction is 4× behind on shard 3 after the 12:40 schema rollout. Dashboards still serve, but recent-series writes are delayed by up to 4 minutes.",
    events: [
      { time: "13:08", label: "Compaction queue depth crossed 90% on shard 3" },
      { time: "13:15", label: "Acknowledged — writer pods scaled from 4 to 9" },
      { time: "13:31", label: "Queue depth back under 55%, no write errors observed" },
      { time: "—", label: "Watching for the next 30 minutes before standing down" },
    ],
  },
  {
    id: "INC-2191",
    serviceId: "worker",
    severity: "sev-3",
    title: "Queue Worker dead-letter rate above 0.4%",
    age: "26m",
    opened: "13:34",
    commander: "M. Haddad",
    channel: "#inc-async",
    summary:
      "A poison message shape introduced in v24.9.2 is landing in the dead-letter queue. Throughput is unaffected.",
    events: [
      { time: "13:34", label: "Dead-letter rate crossed 0.4% for 10 minutes" },
      { time: "13:41", label: "Triaged — v24.9.2 added a required `tenant_id` field" },
      { time: "13:52", label: "Backfill worker started draining 1.2k messages" },
      { time: "—", label: "Backfill at 62%, dead-letter rate down to 0.11%" },
    ],
  },
  {
    id: "INC-2186",
    serviceId: "relay",
    severity: "sev-3",
    title: "Mail Relay pool B timing out to the upstream provider",
    age: "1d 06h · resolved",
    opened: "Sep 26 21:48",
    commander: "T. Bergström",
    channel: "#inc-messaging",
    summary:
      "Outbound SMTP handshakes to the primary provider timed out from one pool. Failed over to pool A after 47 minutes.",
    events: [
      { time: "21:48", label: "Handshake timeouts on outbound pool B" },
      { time: "22:05", label: "Provider status page confirmed a degraded route" },
      { time: "22:35", label: "Failover to pool A completed, delivery latency normal" },
      { time: "Sep 27 04:02", label: "Resolved — backlog drained, pool B returned to rotation" },
    ],
  },
  {
    id: "INC-2179",
    serviceId: "index",
    severity: "sev-2",
    title: "Search Index replica drift after snapshot restore",
    age: "2d 03h · resolved",
    opened: "Sep 25 10:20",
    commander: "A. Okonjo",
    channel: "#inc-discovery",
    summary:
      "A restored snapshot left two replicas 40 minutes behind the primary. Rebuilt from the primary and reindexed the affected shard.",
    events: [
      { time: "10:20", label: "Replica lag alarm on shard 5" },
      { time: "10:44", label: "Snapshot restore confirmed as the common cause" },
      { time: "11:30", label: "Replica rebuilt from the primary" },
      { time: "13:35", label: "Resolved — lag at zero, shard 5 reindexed" },
    ],
  },
];

/** Seeded incident state so the demo opens mid-incident, not empty. */
export const DEFAULT_ACKS = ["INC-2194"];
export const DEFAULT_RESOLVED = ["INC-2186", "INC-2179"];

/* ----------------------------- on-call ------------------------------- */

export const ONCALL: OnCall[] = [
  { id: "okonjo", name: "Ama Okonjo", initials: "AO", role: "Incident commander", shift: "Primary · 08:00–20:00 UTC", pages: 3 },
  { id: "delacroix", name: "Renaud Delacroix", initials: "RD", role: "Streaming on-call", shift: "Secondary · 20:00–08:00 UTC", pages: 1 },
  { id: "nakamura", name: "Sora Nakamura", initials: "SN", role: "Data on-call", shift: "Primary · 08:00–20:00 UTC", pages: 2 },
  { id: "haddad", name: "Maya Haddad", initials: "MH", role: "Async on-call", shift: "Primary · 08:00–20:00 UTC", pages: 1 },
  { id: "bergstrom", name: "Tove Bergström", initials: "TB", role: "Platform lead", shift: "Escalation · pager", pages: 0 },
];

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

/** A live sev-1 takes a service down; sev-2/3 degrade it. Resolved ones don't count. */
export function serviceStateOf(
  service: Service,
  incidents: Incident[],
  acks: string[],
  resolved: string[]
): ServiceState {
  let state: ServiceState = "healthy";
  for (const inc of incidents) {
    if (inc.serviceId !== service.id) continue;
    if (incidentStateOf(inc, acks, resolved) === "resolved") continue;
    if (inc.severity === "sev-1") return "down";
    state = "degraded";
  }
  return state;
}

export function serviceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function onCallById(id: string): OnCall | undefined {
  return ONCALL.find((p) => p.id === id);
}

/* ------------------------------ metrics ------------------------------ */

/** 288-point master series (5-minute resolution across 24h) per metric. */
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
  // Fleet CPU % — the edge-gateway sev-1 spike lands around 13:12 (i ≈ 248).
  cpu: genMaster(17, 34, 9, 1.5, 8, 7, { center: 248, width: 12, height: 38 }, 100),
  // Fleet memory % — slow crawl with the 03:00 cache-eviction sawtooth.
  mem: genMaster(29, 57, 5, 0.8, 4, 10, { center: 154, width: 9, height: -11 }, 100),
  // p95 latency ms — tracks the same window, wider.
  lat: genMaster(41, 88, 15, 2.0, 30, 14, { center: 249, width: 16, height: 174 }, 500),
};

export const METRICS: Record<MetricId, MetricMeta> = {
  cpu: {
    id: "cpu",
    label: "CPU utilisation",
    caption: "fleet-wide, all tiers, 5-minute mean",
    unit: "%",
    hi: 100,
    slo: "80 %",
    kind: "line",
  },
  mem: {
    id: "mem",
    label: "Memory pressure",
    caption: "container working set, RSS/limit",
    unit: "%",
    hi: 100,
    slo: "85 %",
    kind: "bar",
  },
  lat: {
    id: "lat",
    label: "p95 latency",
    caption: "edge-measured, all regions",
    unit: "ms",
    hi: 500,
    slo: "250 ms",
    kind: "line",
  },
};

export const METRIC_ORDER: MetricId[] = ["cpu", "mem", "lat"];

export const RANGES: RangeDef[] = [
  { id: "1h", label: "1H", span: 12, window: "1 hour", labels: ["−60m", "−45m", "−30m", "−15m", "now"] },
  { id: "6h", label: "6H", span: 72, window: "6 hours", labels: ["−6h", "−4.5h", "−3h", "−1.5h", "now"] },
  { id: "12h", label: "12H", span: 144, window: "12 hours", labels: ["−12h", "−9h", "−6h", "−3h", "now"] },
  { id: "24h", label: "24H", span: 287, window: "24 hours", labels: ["−24h", "−18h", "−12h", "−6h", "now"] },
];

/** 24 sampled points for a metric over a range — one world, four zooms.
 *  Indices are interpolated across the window so 1H reads the same master
 *  series at fine resolution and 24H at coarse, never off its ends. */
export function seriesFor(metric: MetricId, range: RangeId): number[] {
  const span = RANGES.find((r) => r.id === range)?.span ?? 287;
  const master = MASTER[metric];
  const n = 24;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round(287 - ((n - 1 - i) * span) / (n - 1));
    out.push(master[clamp(idx, 0, 287)]);
  }
  return out;
}

export interface SeriesStats {
  current: number;
  peak: number;
  avg: number;
  /** Clean axis ceiling: the data peak rounded up to a 20-unit step. */
  axisHi: number;
}

export function statsFor(metric: MetricId, range: RangeId): SeriesStats {
  const s = seriesFor(metric, range);
  const peak = Math.max(...s);
  return {
    current: s[s.length - 1],
    peak,
    avg: s.reduce((a, b) => a + b, 0) / s.length,
    axisHi: Math.min(METRICS[metric].hi, Math.max(20, Math.ceil((peak * 1.15) / 20) * 20)),
  };
}

/* ------------------------------ formatting --------------------------- */

export function fmtUnit(v: number, unit: "%" | "ms"): string {
  return unit === "ms" ? `${Math.round(v)} ms` : `${v.toFixed(1)} %`;
}

export function fmtPct(v: number): string {
  return v === 100 ? "100.000" : v.toFixed(v >= 99.99 ? 3 : 2);
}

export const STATE_LABEL: Record<ServiceState, string> = {
  healthy: "HEALTHY",
  degraded: "DEGRADED",
  down: "DOWN",
};

export const INCIDENT_STATE_LABEL: Record<IncidentState, string> = {
  open: "OPEN",
  acknowledged: "ACKNOWLEDGED",
  resolved: "RESOLVED",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  "sev-1": "SEV-1",
  "sev-2": "SEV-2",
  "sev-3": "SEV-3",
};

/**
 * Deterministic "last poll" stamp. Derived from the refresh counter, never
 * from Date.now(), so a reload always replays the same sequence.
 */
const BASE_POLL_SECONDS = 9 * 3600 + 41 * 60; // 09:41 UTC, the demo "now"
export function pollStamp(tick: number, refreshSec: number): string {
  const total = BASE_POLL_SECONDS + tick * refreshSec;
  const hh = String(Math.floor(total / 3600) % 24).padStart(2, "0");
  const mm = String(Math.floor(total / 60) % 60).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}
