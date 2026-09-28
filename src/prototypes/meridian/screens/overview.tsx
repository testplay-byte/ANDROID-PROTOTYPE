"use client";

/**
 * meridian / screens / overview — the portfolio view.
 *
 * Desktop layout: a wide responsive grid (4 KPIs → 2 → 1), a full-width
 * chart, and a two-column band. Nothing here is a phone screen scaled up —
 * the KPI row, the chart legend and the activity list are desktop densities.
 */

import {
  ACTIVITY,
  ATTENTION,
  MILESTONES,
  THROUGHPUT,
  money,
} from "../data";
import { useMeridian } from "../state/meridian-context";
import { CheckIcon, ClockIcon, FlagIcon, TrendIcon } from "../components/icons";

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(...values);
  const step = 100 / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(2)},${(100 - (v / max) * 92).toFixed(2)}`);
  const area = `0,100 ${pts.join(" ")} 100,100`;
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={area} className="mrd-spark__area" />
      <polyline points={pts.join(" ")} className="mrd-spark__line" />
    </svg>
  );
}

export function OverviewScreen() {
  const { counts, go, selectProject, selectedProject, density } = useMeridian();

  const kpis = [
    { label: "Active projects", value: String(counts.total - counts.done), sub: `${counts.done} shipped this quarter`, icon: <FlagIcon size={16} />, tone: "primary" },
    { label: "Portfolio health", value: "84%", sub: "weighted by budget", icon: <TrendIcon size={16} />, tone: "ok" },
    { label: "Needs attention", value: String(counts.atRisk + counts.blocked), sub: `${counts.blocked} blocked`, icon: <ClockIcon size={16} />, tone: counts.blocked ? "bad" : "warn" },
    { label: "Tasks in flight", value: "23", sub: "across 5 people", icon: <CheckIcon size={16} />, tone: "mute" },
  ];

  return (
    <div className="mrd-view" data-density={density}>
      <div className="mrd-kpis">
        {kpis.map((k) => (
          <article className="mrd-kpi" key={k.label} data-tone={k.tone}>
            <span className="mrd-kpi__label">
              <span className="mrd-kpi__icon" aria-hidden="true">{k.icon}</span>
              {k.label}
            </span>
            <strong className="mrd-kpi__value tnum">{k.value}</strong>
            <span className="mrd-kpi__sub">{k.sub}</span>
          </article>
        ))}
      </div>

      <section className="mrd-card mrd-chart-card">
        <header className="mrd-card__head">
          <div>
            <h2>Throughput</h2>
            <p>Tasks completed per week · last 12 weeks</p>
          </div>
          <span className="mrd-chip mrd-chip--ok">+18% vs prior period</span>
        </header>
        <div className="mrd-chart">
          <Sparkline values={THROUGHPUT} className="mrd-spark" />
          <div className="mrd-chart__axis tnum" aria-hidden="true">
            <span>W1</span>
            <span>W4</span>
            <span>W8</span>
            <span>W12</span>
          </div>
        </div>
      </section>

      <div className="mrd-band">
        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Needs attention</h2>
            <button className="mrd-linkbtn" type="button" onClick={() => go("projects")}>
              All projects
            </button>
          </header>
          <ul className="mrd-attention">
            {ATTENTION.map((a) => (
              <li key={a.id} data-severity={a.severity}>
                <span className="mrd-attention__dot" aria-hidden="true" />
                <div>
                  <b>{a.title}</b>
                  <span>{a.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Milestones</h2>
            <span className="mrd-card__meta tnum">{money(PROJECTS_TOTAL())} committed</span>
          </header>
          <ul className="mrd-milestones">
            {MILESTONES.map((m) => (
              <li key={m.id} data-state={m.state}>
                <span className="mrd-milestones__date tnum">{m.date}</span>
                <div>
                  <b>{m.title}</b>
                  <span>{m.project}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mrd-card">
          <header className="mrd-card__head">
            <h2>Recent activity</h2>
          </header>
          <ul className="mrd-activity">
            {ACTIVITY.map((e) => (
              <li key={e.id}>
                <span className="mrd-avatar" aria-hidden="true">
                  {e.who.split(" ").map((n) => n[0]).join("")}
                </span>
                <p>
                  <b>{e.who}</b> {e.what}
                </p>
                <span className="mrd-activity__when">{e.when}</span>
              </li>
            ))}
          </ul>
          {selectedProject && <span className="sr-only">Inspecting {selectedProject}</span>}
        </section>
      </div>
    </div>
  );
}

/* committed budget across the portfolio */
function PROJECTS_TOTAL() {
  return 1876000;
}
