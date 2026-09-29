"use client";

/**
 * signal / screens / funnel — the activation funnel.
 *
 * One dataset, two real layouts. The desktop view draws the funnel VERTICAL
 * (steps stacked, a full-width rail showing the surviving users, and the drop
 * between steps called out). At `@container surface (max-width: 900px)` the
 * CSS reveals a second, genuinely HORIZONTAL chart — bars left to right
 * against the same numbers — instead of shrinking the vertical one.
 */

import { useState } from "react";
import { PLATFORMS, PLANS, fmtInt } from "../data";
import { funnelFor } from "../data";
import { useSignal } from "../state/signal-context";
import { FunnelChart, PlanBars } from "../components/charts";
import { Delta, Legend, Meter, Panel, PanelHead, Readout } from "../components/atoms";

export function FunnelScreen() {
  const { win, funnel, platform, plan, density, notify } = useSignal();
  const [active, setActive] = useState(-1);

  const top = funnel[0]?.users || 1;
  const last = funnel[funnel.length - 1];
  const overall = last ? last.users / top : 0;

  /* biggest single drop, and the step it happens at */
  let worst = { i: 1, lost: 0 };
  funnel.forEach((s, i) => {
    if (i > 0 && s.lost > worst.lost) worst = { i, lost: s.lost };
  });

  /* segment breakdown: the same funnel recomputed per platform */
  const byPlatform = PLATFORMS.filter((p) => p.id !== "all").map((p) => {
    const f = funnelFor(win, p.id, plan);
    return {
      id: p.id,
      label: p.label,
      steps: f,
      end: f[f.length - 1]?.users ?? 0,
      rate: (f[f.length - 1]?.users ?? 0) / (f[0]?.users || 1),
    };
  });

  /* and the paid step split by plan */
  const byPlan = PLANS.filter((p) => p.id !== "all").map((p, i) => {
    const f = funnelFor(win, platform, p.id);
    const paid = f[f.length - 1]?.users ?? 0;
    return { label: p.label, value: paid, share: 0, plan: p.id, i };
  });
  const planTotal = byPlan.reduce((a, r) => a + r.value, 0) || 1;
  byPlan.forEach((r) => {
    r.share = r.value / planTotal;
  });

  const step = active >= 0 ? funnel[active] : null;

  return (
    <div className="sig-view" data-density={density}>
      <div className="sig-funnelbar">
        <span className="sig-filterbar__label">Segment</span>
        <span className="sig-funnelbar__meta">
          Showing <b>{platform === "all" ? "all platforms" : platform}</b> ·{" "}
          <b>{plan === "all" ? "all plans" : plan}</b> over the {win.def.label} window. Change it in the
          segment bar above — the funnel, the breakdown and the plan bars all re-derive.
        </span>
      </div>

      <div className="sig-grid">
        <Panel className="sig-span-8">
          <PanelHead
            title="Activation funnel"
            unit="users per step"
            sub={`${win.def.label} window · ${platform === "all" ? "all platforms" : platform} · ${plan === "all" ? "all plans" : plan}`}
          />

          {/* desktop: vertical funnel */}
          <div className="sig-funnel sig-funnel--v">
            <FunnelChart steps={funnel} orientation="vertical" active={active} onPick={setActive} />
          </div>
          {/* tablet: the same numbers, drawn horizontally */}
          <div className="sig-funnel sig-funnel--h">
            <FunnelChart steps={funnel} orientation="horizontal" active={active} onPick={setActive} />
          </div>

          <Legend
            items={[
              { label: "Reached step", series: 1, fill: true },
              { label: "Dropped before", fill: true, tone: "mute" },
            ]}
          />
          <Readout
            items={
              step
                ? [
                    { label: step.label, value: fmtInt(step.users) },
                    { label: "From previous", value: `${(step.ofPrev * 100).toFixed(1)}%` },
                    { label: "From top", value: `${(step.ofTop * 100).toFixed(1)}%` },
                    { label: "Dropped here", value: step.lost ? fmtInt(step.lost) : "—" },
                  ]
                : [
                    { label: "Top of funnel", value: fmtInt(top) },
                    { label: "End of funnel", value: fmtInt(last?.users ?? 0) },
                    { label: "Overall conversion", value: `${(overall * 100).toFixed(2)}%` },
                    {
                      label: "Biggest drop",
                      value: `${funnel[worst.i]?.label ?? "—"}`,
                      tone: "bad",
                    },
                  ]
            }
            note={step ? `Step ${active + 1} of ${funnel.length}.` : "Hover a step to read its conversion — the panel follows the pointer."}
          />
        </Panel>

        <div className="sig-column sig-span-4">
          <Panel>
            <PanelHead title="Segment breakdown" unit="end-of-funnel users" sub="The funnel recomputed per platform" />
            <table className="sig-mini">
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col" className="sig-right">Reached paid</th>
                  <th scope="col" className="sig-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {byPlatform.map((p, i) => (
                  <tr key={p.id} data-active={platform === p.id ? "true" : undefined}>
                    <td>
                      <span className="sig-swatch" data-series={i + 1} aria-hidden="true" />
                      {p.label}
                    </td>
                    <td className="sig-right tnum">{fmtInt(p.end)}</td>
                    <td className="sig-right tnum">{(p.rate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="sig-bars">
              {byPlatform.map((p, i) => (
                <li key={p.id}>
                  <span className="sig-bars__label">{p.label}</span>
                  <Meter value={p.rate} tone={p.rate > overall ? "ok" : "warn"} />
                  <b className="tnum">{(p.rate * 100).toFixed(1)}%</b>
                  <span className="sig-bars__ink" data-series={i + 1} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHead title="Paid step by plan" unit="users" sub="Where the last step comes from" />
            <PlanBars rows={byPlan} />
            <div className="sig-note">
              <Delta value={overall * 100 - 4.1} />
              <span>against the 4.10% workspace baseline.</span>
            </div>
            <button className="sig-btn sig-btn--solid" type="button" onClick={() => notify("Funnel report queued for export")}>
              Export funnel report
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
