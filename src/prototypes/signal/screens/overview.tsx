"use client";

/**
 * signal / screens / overview — the flagship screen.
 *
 * A desktop analytics console at its most typical: a five-card KPI row, one
 * large time series with a comparison series and a drag-to-brush window, a
 * stacked column chart, a revenue ring and a live activity feed. The range
 * selector re-scales everything — the numbers, the sparklines, the stacked
 * buckets and the funnel volume all come from the same sliced window.
 */

import { useState } from "react";
import { ANOMALIES, FEED, RANGES, ago, compact, fmtDelta, fmtInt } from "../data";
import { useSignal, type SeriesId } from "../state/signal-context";
import { Donut, StackedBars, TimeSeriesChart } from "../components/charts";
import { Delta, Empty, Legend, Panel, PanelHead, Readout, Segmented, StatCard } from "../components/atoms";
import { AlertIcon, CloseIcon, PulseIcon } from "../components/icons";

const SERIES: { id: SeriesId; label: string }[] = [
  { id: "activeUsers", label: "Active users" },
  { id: "sessions", label: "Sessions" },
  { id: "signups", label: "Signups" },
];

export function OverviewScreen() {
  const { win, metrics, stacks, mix, range, setRange, series, setSeries, density, notify } = useSignal();
  const [brush, setBrush] = useState<{ a: number; b: number } | null>(null);
  const [bucket, setBucket] = useState(-1);
  const [slice, setSlice] = useState(-1);
  const [feedOffset, setFeedOffset] = useState(0);

  const seriesDef = metrics.find((m) => m.id === series) ?? metrics[0];
  const current = win.current.map((d) => (d[series] as number));
  const previous = win.previous.map((d) => (d[series] as number));
  const dates = win.current.map((d) => d.date);

  /* the live feed is a rotation over a fixed list — deterministic, no clock */
  const feed = FEED.map((f, i) => ({ ...f, at: f.at + ((i + feedOffset * 3) % 5) * 11 })).slice(0, 7);

  return (
    <div className="sig-view" data-density={density}>
      {/* ---- KPI row ---- */}
      <div className="sig-kpis">
        {metrics.map((m, i) => {
          const r = m.read(win);
          return (
            <StatCard
              key={m.id}
              label={m.label}
              unit={m.unit}
              value={m.format(r.value)}
              delta={r.delta}
              spark={r.spark}
              inverse={m.inverse}
              series={(i % 5) + 1}
            />
          );
        })}
      </div>

      <div className="sig-grid">
        {/* ---- the large time series ---- */}
        <Panel className="sig-span-8">
          <PanelHead
            title={seriesDef.label}
            unit={seriesDef.unit}
            sub={`${win.def.days} days · compared with the previous ${win.def.days}`}
            right={
              <>
                <Segmented
                  compact
                  label="Metric"
                  value={series}
                  onChange={(v) => {
                    setSeries(v);
                    setBrush(null);
                  }}
                  options={SERIES.map((s) => ({ id: s.id, label: s.label.split(" ")[0] }))}
                />
                <Segmented
                  compact
                  label="Range"
                  value={range}
                  onChange={(v) => {
                    setRange(v);
                    setBrush(null);
                  }}
                  options={RANGES.map((r) => ({ id: r.id, label: r.label }))}
                />
              </>
            }
          />
          <TimeSeriesChart
            current={current}
            previous={previous}
            dates={dates}
            unit={seriesDef.unit}
            format={seriesDef.format}
            primaryLabel={seriesDef.label}
            comparisonLabel="Previous period"
            brush={brush}
            onBrush={(b) => {
              setBrush(b);
              if (b) notify(`Window: ${dates[b.a]} → ${dates[b.b]}`);
            }}
          />
          {brush && (
            <button className="sig-linkbtn" type="button" onClick={() => setBrush(null)}>
              <CloseIcon size={13} /> Clear brush window
            </button>
          )}
        </Panel>

        {/* ---- revenue ring ---- */}
        <Panel className="sig-span-4">
          <PanelHead
            title="Paying mix"
            unit="paying users by plan"
            sub="The ring splits paying users; MRR is the ARPU-weighted sum"
            right={
              <button className="sig-linkbtn" type="button" onClick={() => notify("Billing export queued")}>
                Export
              </button>
            }
          />
          <Donut
            slices={mix.slices}
            mrr={mix.mrr}
            centreLabel="MRR"
            centreValue={`$${Math.round(mix.mrr).toLocaleString("en-US")}`}
            active={slice}
            onPick={setSlice}
          />
        </Panel>

        {/* ---- stacked columns ---- */}
        <Panel className="sig-span-7">
          <PanelHead
            title="Sessions by platform"
            unit="sessions per bucket"
            sub={`${win.def.days}-day window, bucketed ${win.bucketDays === 1 ? "daily" : `${win.bucketDays} days`}`}
          />
          <StackedBars stacks={stacks.stacks} labels={stacks.labels} totals={stacks.totals} active={bucket} onPick={setBucket} />
        </Panel>

        {/* ---- live feed ---- */}
        <Panel className="sig-span-5">
          <PanelHead
            title="Live activity"
            unit="last 10 minutes"
            right={
              <>
                <span className="sig-live">
                  <i aria-hidden="true" /> LIVE
                </span>
                <button className="sig-linkbtn" type="button" onClick={() => setFeedOffset((o) => o + 1)}>
                  Advance
                </button>
              </>
            }
          />
          <ul className="sig-feed">
            {feed.map((f) => (
              <li key={f.id} data-tone={f.tone}>
                <span className="sig-feed__dot" aria-hidden="true" />
                <div className="sig-feed__body">
                  <b>{f.event}</b>
                  <span>{f.detail}</span>
                </div>
                <span className="sig-feed__value tnum">{f.value}</span>
                <span className="sig-feed__at tnum">{ago(f.at)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ---- anomalies ---- */}
        <Panel className="sig-span-7">
          <PanelHead title="Anomalies" unit="auto-detected" sub="Deviation from the trailing 28-day median" />
          <ul className="sig-anomalies">
            {ANOMALIES.map((a) => (
              <li key={a.id} data-tone={a.tone}>
                <AlertIcon size={14} />
                <div>
                  <b>{a.metric}</b>
                  <span>{a.detail}</span>
                </div>
                <Delta value={a.change} />
              </li>
            ))}
          </ul>
        </Panel>

        {/* ---- summary strip ---- */}
        <Panel className="sig-span-5">
          <PanelHead title="Window summary" unit={win.def.label} sub="Everything above re-derives from this slice" />
          <Readout
            items={[
              { label: "Days in window", value: fmtInt(win.current.length) },
              { label: "Total sessions", value: compact(win.current.reduce((a, d) => a + d.sessions, 0)) },
              { label: "Total signups", value: compact(win.current.reduce((a, d) => a + d.signups, 0)) },
              { label: "Mean error rate", value: `${(win.current.reduce((a, d) => a + d.errorRate, 0) / win.current.length).toFixed(2)}%` },
            ]}
            note={`Comparison window: ${win.previous.length} days ending ${win.previous[0]?.date ?? "—"}.`}
          />
          <Legend
            items={[
              { label: "Signal", series: 1 },
              { label: "Comparison", series: 2 },
              { label: "Caution", tone: "warn" },
              { label: "Failure", tone: "bad" },
            ]}
          />
          {feedOffset > 0 && <Empty>Feed advanced {feedOffset}× from the pinned stream.</Empty>}
        </Panel>
      </div>

      <p className="sig-footnote">
        <PulseIcon size={13} /> Every value is fixed demo data generated from a fixed seed — the console
        reads the same numbers on every load. The clock is pinned to 29 Sep 2026.
      </p>
    </div>
  );
}
