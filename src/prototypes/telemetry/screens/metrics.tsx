"use client";

/**
 * telemetry / screens / metrics — fleet metrics over time.
 *
 * A 1H / 6H / 12H / 24H segmented range re-scales all three charts out of a
 * single deterministic 288-point master series, so the same second of the
 * demo world is the same number at every zoom. The peak of each window is
 * drawn in IBM blue, and every chart carries its own SLO in the stat strip
 * below it — the two numbers an on-call actually compares.
 */

import { useState } from "react";
import {
  METRIC_ORDER,
  METRICS,
  RANGES,
  fmtUnit,
  seriesFor,
  statsFor,
  type MetricId,
  type RangeDef,
  type RangeId,
} from "../data";
import { useTelemetry } from "../state/telemetry-context";
import { BarChart, LineChart } from "../components/charts";
import { Segmented } from "../components/controls";

export function MetricsScreen() {
  const { density, pollStamp } = useTelemetry();
  const [range, setRange] = useState<RangeId>("24h");
  const rangeDef = RANGES.find((r) => r.id === range) ?? RANGES[RANGES.length - 1];

  return (
    <div className="tel-view" data-density={density}>
      <div className="tel-metricbar">
        <span className="tel-micro tel-micro--muted">Time range</span>
        <Segmented
          ariaLabel="Time range"
          options={RANGES.map((r) => ({ id: r.id, label: r.label }))}
          value={range}
          onSelect={(id) => setRange(id as RangeId)}
        />
        <p className="tel-metricbar__note tnum">
          {rangeDef.window} window · polled {pollStamp}
        </p>
      </div>

      <div className="tel-charts">
        {METRIC_ORDER.map((id) => (
          <ChartCard key={id} id={id} range={range} rangeDef={rangeDef} />
        ))}
      </div>

      <p className="tel-foot-note">
        Deterministic seeded series — the same window always plots the same points, with no jitter
        between renders. The peak of each window is highlighted in <span className="tel-blue">IBM blue</span>.
      </p>
    </div>
  );
}

/** One chart card. `key` on the plot re-mounts it on range change so the
 *  re-scale transition replays, exactly like the phone sibling does. */
function ChartCard({
  id,
  range,
  rangeDef,
}: {
  id: MetricId;
  range: RangeId;
  rangeDef: RangeDef;
}) {
  const meta = METRICS[id];
  const st = statsFor(id, range);
  const points = seriesFor(id, range);
  const Chart = meta.kind === "bar" ? BarChart : LineChart;

  return (
    <section className={`tel-chartcard${id === "cpu" ? " tel-chartcard--wide" : ""}`}>
      <header className="tel-chartcard__head">
        <div>
          <h2>{meta.label}</h2>
          <p>
            {meta.caption} · {rangeDef.window}
          </p>
        </div>
        <span className="tel-chartcard__now">
          <b>{fmtUnit(st.current, meta.unit)}</b>
          <span>current</span>
        </span>
      </header>

      <div className="tel-chartcard__plot" key={`${id}-${range}`}>
        <Chart points={points} hi={st.axisHi} unit={meta.unit} range={rangeDef} name={meta.label} />
      </div>

      <div className="tel-ministats">
        <div className="tel-ministat" data-peak>
          <b>Peak</b>
          <span>{fmtUnit(st.peak, meta.unit)}</span>
        </div>
        <div className="tel-ministat">
          <b>Average</b>
          <span>{fmtUnit(st.avg, meta.unit)}</span>
        </div>
        <div className="tel-ministat">
          <b>SLO</b>
          <span>{meta.slo}</span>
        </div>
      </div>
    </section>
  );
}
