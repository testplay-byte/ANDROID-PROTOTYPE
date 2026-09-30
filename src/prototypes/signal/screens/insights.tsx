"use client";

/**
 * signal / screens / insights — the visual-vocabulary view.
 *
 * Signal is a product-analytics console, so this screen answers "what does
 * the data look like" with a different technique on every card: a heat map
 * (when), a tree map (what), a radar (how balanced), radial bars (how much
 * of a whole), and a radial gauge (a single headline number). The marks come
 * from the shared design system (`@/proto-kit/charts`), so they follow
 * whatever design language and theme the prototype is in.
 */

import {
  ChartCard,
  CountUp,
  HeatMap,
  RadialBars,
  RadialGauge,
  RadarChart,
  Sparkline,
  TreeMap,
} from "@/proto-kit/charts";
import { fmtInt } from "../data";
import { useSignal } from "../state/signal-context";

/* --- demo series for the shared marks (deterministic, per SPEC §8.6) --- */
const heat = (r: number, c: number) => 8 + 72 * Math.abs(Math.sin((r + 1) * 1.7 + c * 1.1));

const HEAT_ROWS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEAT_COLS = ["0h", "4h", "8h", "12h", "16h", "20h"];
const HEAT = HEAT_ROWS.map((_, r) => HEAT_COLS.map((__, c) => Math.round(heat(r, c))));

const TREE = [
  { label: "Search", value: 28, color: "var(--color-primary)", fg: "var(--color-primary-fg)" },
  { label: "Feed", value: 21, color: "var(--color-secondary)", fg: "var(--color-secondary-fg)" },
  { label: "Checkout", value: 17, color: "var(--color-tertiary)", fg: "var(--color-tertiary-fg)" },
  { label: "Onboarding", value: 13, color: "var(--color-error)", fg: "var(--color-error-fg)" },
  { label: "Settings", value: 8, color: "var(--color-success)", fg: "var(--color-success-fg)" },
  { label: "Other", value: 6, color: "var(--color-surface-4)", fg: "var(--color-text)" },
];

const RADAR_AXES = ["Reach", "Depth", "Return", "Value", "Speed"];
const RADAR = [86, 64, 78, 52, 91];

const RADIAL = [
  { label: "Activation", value: 68, max: 100, color: "var(--color-primary)" },
  { label: "Retention", value: 54, max: 100, color: "var(--color-secondary)" },
  { label: "Referral", value: 37, max: 100, color: "var(--color-tertiary)" },
  { label: "Revenue", value: 81, max: 100, color: "var(--color-error)" },
];

export function InsightsScreen() {
  const { density, notify } = useSignal();

  return (
    <div className="sig-view" data-density={density}>
      <div className="sig-bento">
        <ChartCard
          title="Engagement heat map"
          area={{ col: 6, row: 2 }}
          aside={<span className="sig-tag">sessions / 1k</span>}
        >
          <div className="sig-figure">
            <strong className="tnum">
              <CountUp value={1842} />
            </strong>
            <span>sessions per 1k users at peak</span>
          </div>
          <HeatMap
            rows={HEAT_ROWS}
            cols={HEAT_COLS}
            values={HEAT}
            color="var(--color-primary)"
            format={(v) => `${fmtInt(v)} sessions`}
          />
        </ChartCard>

        <ChartCard
          title="Revenue by surface"
          area={{ col: 3, row: 2 }}
          aside={<span className="sig-tag">share</span>}
        >
          <TreeMap nodes={TREE} height={230} />
        </ChartCard>

        <ChartCard
          title="Experience balance"
          area={{ col: 3, row: 2 }}
          aside={<span className="sig-tag">index</span>}
        >
          <RadarChart axes={RADAR_AXES} series={RADAR} size={236} color="var(--color-primary)" max={100} />
          <p className="sig-note">Depth and value lag reach — the funnel view breaks it down.</p>
        </ChartCard>

        <ChartCard
          title="Lifecycle mix"
          area={{ col: 3, row: 2 }}
          aside={<span className="sig-tag">%</span>}
        >
          <RadialBars rows={RADIAL} size={216} />
        </ChartCard>

        <ChartCard
          title="Activation"
          area={{ col: 3, row: 2 }}
          aside={<span className="sig-tag">30-day</span>}
        >
          <RadialGauge
            pct={68}
            centre="68%"
            sub="activation rate"
            size={214}
            color="var(--color-primary)"
          />
          <button className="sig-btn" type="button" onClick={() => notify("Cohort drill-down opened") }>
            Drill into cohort
          </button>
        </ChartCard>

        <ChartCard
          title="Weekly active users"
          area={{ col: 6, row: 2 }}
          aside={
            <button className="sig-select" type="button" onClick={() => notify("Range: 12 weeks") }>
              12W <span aria-hidden="true">▾</span>
            </button>
          }
        >
          <div className="sig-figure">
            <strong className="tnum">
              <CountUp value={42.8} decimals={1} suffix="k" />
            </strong>
            <span>weekly active users</span>
            <b className="sig-delta tnum">+9.4%</b>
          </div>
          <Sparkline
            values={[28, 29, 31, 30, 33, 35, 34, 37, 38, 40, 41, 42.8]}
            color="var(--color-primary)"
            area
            smooth
            height={96}
            label="Weekly active users"
          />
          <Sparkline
            values={[26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]}
            color="var(--color-secondary)"
            smooth
            height={64}
            label="Previous period"
          />
        </ChartCard>
      </div>
    </div>
  );
}
