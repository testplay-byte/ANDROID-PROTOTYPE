"use client";

/* pulse / screens/metrics-screen — fleet metrics over time:
   - time-range segmented control (1H/6H/12H/24H) re-scales every chart
     from the deterministic seeded master series
   - CPU area line chart, memory bar chart (peak bar in IBM blue),
     p95 latency line chart, each in an outlined panel with a header row
   - current / peak / avg stat triple per chart, tabular-nums */

import { useState } from "react";
import { METRICS, RANGES, seriesFor, type MetricId, type RangeId } from "../lib/data";
import { BarChart, LineChart } from "../components/charts";
import { Segmented } from "../components/controls";

function statsFor(metric: MetricId, range: RangeId) {
  const s = seriesFor(metric, range);
  const avg = s.reduce((a, b) => a + b, 0) / s.length;
  return {
    current: s[s.length - 1],
    peak: Math.max(...s),
    avg,
  };
}

interface ChartSpec {
  id: MetricId;
  caption: string;
  color: string;
  kind: "line" | "bar";
  /** Axis ceiling passed to the chart (data max is honoured above this). */
  ceiling: number;
}

const CHARTS: ChartSpec[] = [
  { id: "cpu", caption: "fleet-wide, 3-second sample", color: "var(--color-primary)", kind: "line", ceiling: 100 },
  { id: "mem", caption: "container working-set", color: "var(--color-tertiary)", kind: "bar", ceiling: 100 },
  { id: "lat", caption: "edge-measured, all regions", color: "var(--color-warn)", kind: "line", ceiling: 320 },
];

function fmt(v: number, unit: string): string {
  return unit === "ms" ? `${Math.round(v)} ms` : `${v.toFixed(1)} %`;
}

export function MetricsScreen() {
  const [range, setRange] = useState<RangeId>("24h");
  const rangeDef = RANGES.find((r) => r.id === range)!;

  return (
    <div className="plu-screen plu-screen--metrics">
      <div className="plu-scroll">
        <div className="plu-metric-filter">
          <span className="plu-sechead">Time range</span>
          <Segmented
            ariaLabel="Time range"
            options={RANGES.map((r) => ({ id: r.id, label: r.label }))}
            value={range}
            onSelect={(id) => setRange(id as RangeId)}
          />
        </div>

        {CHARTS.map((c) => {
          const meta = METRICS[c.id];
          const pts = seriesFor(c.id, range);
          const st = statsFor(c.id, range);
          const Chart = c.kind === "bar" ? BarChart : LineChart;
          // axis ceiling: data peak rounded up to a clean step, capped per chart
          const axisHi = Math.min(
            c.ceiling,
            Math.max(20, Math.ceil((st.peak * 1.15) / 20) * 20)
          );
          return (
            <section key={c.id} className="plu-panel plu-chartcard">
              <div className="plu-chartcard__head">
                <div>
                  <h2 className="plu-chartcard__title">{meta.label}</h2>
                  <p className="plu-chartcard__caption">{c.caption} · {rangeDef.label.replace("H", " hour")} window</p>
                </div>
                <span className="plu-chartcard__current tnum">{fmt(st.current, meta.unit)}</span>
              </div>

              <div className="plu-chartcard__chart" key={`${c.id}-${range}`}>
                <Chart points={pts} color={c.color} unit={meta.unit} hi={axisHi} range={rangeDef} />
              </div>

              <div className="plu-chartcard__stats">
                <div className="plu-ministat">
                  <span className="plu-ministat__label">PEAK</span>
                  <span className="plu-ministat__num tnum">{fmt(st.peak, meta.unit)}</span>
                </div>
                <div className="plu-ministat">
                  <span className="plu-ministat__label">AVG</span>
                  <span className="plu-ministat__num tnum">{fmt(st.avg, meta.unit)}</span>
                </div>
                <div className="plu-ministat">
                  <span className="plu-ministat__label">SLO</span>
                  <span className="plu-ministat__num tnum">
                    {c.id === "lat" ? "250 ms" : c.id === "mem" ? "85 %" : "80 %"}
                  </span>
                </div>
              </div>
            </section>
          );
        })}

        <p className="plu-foot-note">
          Deterministic seeded series — no jitter between renders.
          {" "}Peak of the window is highlighted in <span className="plu-blue">IBM blue</span>.
        </p>
      </div>
    </div>
  );
}
