"use client";

/**
 * signal / screens / retention — weekly cohort retention.
 *
 * The heat grid is the point of the screen: cohorts down, weeks across, every
 * cell an inline-SVG rect tinted from `--chart-series-1` with a
 * `color-mix` ramp, and every cell hoverable into a readout. The retention
 * curve beside it is the same data as lines, so the shape and the numbers can
 * be read together.
 */

import { useState } from "react";
import { fmtInt } from "../data";
import type { Cohort } from "../data";
import { cohortSummary, useSignal } from "../state/signal-context";
import { HeatGrid, HeatLegend, RetentionCurve } from "../components/charts";
import { Delta, Legend, Meter, Panel, PanelHead, Readout } from "../components/atoms";

const WEEKS = 8;

export function RetentionScreen() {
  const { cohorts, plan, density, notify } = useSignal();
  const [cell, setCell] = useState<{ c: number; w: number; v: number; cohort: Cohort } | null>(null);
  const [week, setWeek] = useState<number | null>(null);

  const sum = cohortSummary(cohorts);
  const sizes = cohorts.map((c) => c.size);
  const hovered = cell ? cell.cohort : null;

  /* week-on-week change for the most recent mature cohort */
  const mature = cohorts.filter((c) => c.values.filter((v) => !Number.isNaN(v)).length >= 4);
  const latest = mature[mature.length - 1];
  const w1 = latest?.values[1] ?? 0;
  const prevCohort = mature[mature.length - 2];
  const change = prevCohort ? w1 - (prevCohort.values[1] ?? w1) : 0;

  return (
    <div className="sig-view" data-density={density}>
      <div className="sig-funnelbar">
        <span className="sig-filterbar__label">Cohorts</span>
        <span className="sig-funnelbar__meta">
          {fmtInt(sum.users)} users across {cohorts.length} weekly cohorts ·{" "}
          <b>{plan === "all" ? "all plans" : plan}</b> · retention is measured from each cohort&apos;s own
          week 0
        </span>
      </div>

      <div className="sig-grid">
        <Panel className="sig-span-8">
          <PanelHead
            title="Cohort retention"
            unit="% of cohort still active"
            sub="Rows are signup weeks · columns are weeks since signup · grey cells are weeks that have not happened yet"
          />
          <HeatGrid cohorts={cohorts} weeks={WEEKS} hover={cell} onHover={setCell} />
          <HeatLegend min={Math.min(...sizes)} max={Math.max(...sizes)} />
        </Panel>

        <div className="sig-column sig-span-4">
          <Panel>
            <PanelHead
              title="Curve"
              unit="retention %"
              sub="Every other cohort, plus the newest"
            />
            <RetentionCurve cohorts={cohorts} hover={week} onHover={setWeek} />
          </Panel>

          <Panel>
            <PanelHead
              title={cell ? `Week ${cell.w} · ${cell.cohort.label}` : "Summary"}
              unit={cell ? `${cell.v}% retained` : "8-week view"}
              right={
                cell ? (
                  <span className="sig-badge">{fmtInt(Math.round((cell.v / 100) * cell.cohort.size))} users</span>
                ) : undefined
              }
            />
            <Readout
              items={
                cell
                  ? [
                      { label: "Cohort size", value: fmtInt(cell.cohort.size) },
                      { label: "Retained at W0", value: "100%" },
                      { label: `Retained at W${cell.w}`, value: `${cell.v}%`, series: 1 },
                      { label: "Still active", value: fmtInt(Math.round((cell.v / 100) * cell.cohort.size)) },
                    ]
                  : [
                      { label: "Mean W1 retention", value: `${sum.w1.toFixed(1)}%` },
                      { label: "Mean W4 retention", value: `${sum.w4.toFixed(1)}%` },
                      { label: "Best cohort", value: sum.best?.label.replace("W/c ", "") ?? "—" },
                      { label: "Users tracked", value: fmtInt(sum.users) },
                    ]
              }
              note={
                cell
                  ? "Hover another cell to move the readout — the whole grid stays visible."
                  : "Hover any cell in the grid to read that cohort/week here."
              }
            />
            <div className="sig-retmeter">
              <div className="sig-retmeter__row">
                <span>W1</span>
                <Meter value={sum.w1 / 100} tone="ok" />
                <b className="tnum">{sum.w1.toFixed(1)}%</b>
              </div>
              <div className="sig-retmeter__row">
                <span>W4</span>
                <Meter value={sum.w4 / 100} tone="warn" />
                <b className="tnum">{sum.w4.toFixed(1)}%</b>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Week-on-week" unit="W1 retention, latest mature cohort" />
            <div className="sig-note">
              <Delta value={change} suffix=" pts" />
              <span>
                {latest?.label ?? "—"} vs {prevCohort?.label ?? "—"}.
              </span>
            </div>
            <Legend
              items={[
                { label: "Strong (55%+)", fill: true, tone: "ok" },
                { label: "Holding (40–55%)", fill: true, tone: "ok" },
                { label: "At risk (<25%)", fill: true, tone: "bad" },
                { label: "Not yet observed", fill: true, tone: "mute" },
              ]}
            />
            <button className="sig-btn sig-btn--solid" type="button" onClick={() => notify("Retention cohort CSV queued")}>
              Export cohorts
            </button>
            {hovered && <p className="sig-footnote">Reading {hovered.label} · {fmtInt(hovered.size)} users at signup.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}
