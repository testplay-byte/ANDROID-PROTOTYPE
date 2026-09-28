"use client";

/* pulse / screens/overview-screen — the fleet at a glance:
   - active-incident banner (when any open incident exists, worst severity)
   - dense service status grid: 12 square status tiles + uptime,
     1px-bordered cells on the layer ladder
   - health ring + counters strip
   - Carbon data table of the top services by traffic: hover row tint,
     sortable header cells, sparkline + p50 columns, density from prefs */

import { useMemo, useState } from "react";
import { usePulse } from "../state/pulse-context";
import {
  STATUS_LABEL,
  fmtMs,
  fmtPct,
  serviceP50,
  sparkline,
  type ServiceState,
} from "../lib/data";
import { Sparkline } from "../components/sparkline";
import { HealthRing } from "../components/charts";
import { StatusSquare, StateTag, ActionButton } from "../components/controls";
import { AlertIcon, ChevronIcon } from "../components/icons";

const STATE_TONE: Record<ServiceState, "green" | "amber" | "red"> = {
  operational: "green",
  degraded: "amber",
  down: "red",
};

type SortKey = "name" | "p50" | "uptime";

export function OverviewScreen({ onGoIncidents }: { onGoIncidents: () => void }) {
  const { services, incidents, acks, resolved, counts, refreshTick, prefs } = usePulse();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "p50", dir: 1 });

  const openIncidents = useMemo(
    () =>
      incidents.filter((i) => {
        const st = resolved.includes(i.id) ? "resolved" : acks.includes(i.id) ? "ack" : "open";
        return st !== "resolved";
      }),
    [incidents, acks, resolved]
  );

  const worst = openIncidents.some((i) => i.severity === "sev-1")
    ? "sev-1"
    : openIncidents.some((i) => i.severity === "sev-2")
      ? "sev-2"
      : "sev-3";

  const rows = useMemo(() => {
    const copy = [...services];
    copy.sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name) * sort.dir;
      if (sort.key === "uptime") return (a.uptime - b.uptime) * sort.dir;
      return (serviceP50(a, a.state) - serviceP50(b, b.state)) * sort.dir;
    });
    return copy.slice(0, 6);
  }, [services, sort]);

  const okCount = services.length - counts.down - counts.degraded;

  return (
    <div className="plu-screen plu-screen--overview">
      {/* scroll region (header/tab strip live in the shell) */}
      <div className="plu-scroll">
        {/* incident banner */}
        {openIncidents.length > 0 ? (
          <div className={`plu-banner plu-banner--${worst}`} role="alert">
            <span className="plu-banner__icon">
              <AlertIcon size={18} />
            </span>
            <div className="plu-banner__body">
              <p className="plu-banner__title">
                {openIncidents.length} active incident{openIncidents.length > 1 ? "s" : ""}
                {" — "}
                {openIncidents[0].title}
              </p>
              <p className="plu-banner__meta tnum">
                {openIncidents[0].id} · {openIncidents[0].severity.toUpperCase()} · opened {openIncidents[0].opened}
              </p>
            </div>
            <ActionButton kind="ghost" onClick={onGoIncidents}>
              View <ChevronIcon size={14} />
            </ActionButton>
          </div>
        ) : (
          <div className="plu-banner plu-banner--ok">
            <StatusSquare state="operational" />
            <p className="plu-banner__title">No active incidents — all {services.length} services operational.</p>
          </div>
        )}

        {/* health strip */}
        <section className="plu-panel plu-health">
          <HealthRing ok={okCount} total={services.length} />
          <div className="plu-health__stats">
            <div className="plu-stat">
              <span className="plu-stat__num tnum">{services.length}</span>
              <span className="plu-stat__label">Services</span>
            </div>
            <div className="plu-stat">
              <span className={`plu-stat__num tnum ${counts.down ? "plu-stat__num--red" : ""}`}>{counts.down}</span>
              <span className="plu-stat__label">Down</span>
            </div>
            <div className="plu-stat">
              <span className={`plu-stat__num tnum ${counts.degraded ? "plu-stat__num--amber" : ""}`}>{counts.degraded}</span>
              <span className="plu-stat__label">Degraded</span>
            </div>
            <div className="plu-stat">
              <span className="plu-stat__num tnum">{counts.open}</span>
              <span className="plu-stat__label">Incidents</span>
            </div>
          </div>
        </section>

        {/* status grid */}
        <section className="plu-panel">
          <h2 className="plu-sechead">Service status</h2>
          <div className="plu-grid">
            {services.map((s) => (
              <div key={s.id} className={`plu-cell plu-cell--${s.state}`} title={`${s.name} — ${STATUS_LABEL[s.state]}`}>
                <StatusSquare state={s.state} />
                <div className="plu-cell__txt">
                  <span className="plu-cell__name">{s.name}</span>
                  <span className="plu-cell__up tnum">{fmtPct(s.uptime)}% · 30d</span>
                </div>
              </div>
            ))}
          </div>
          <p className="plu-foot-note tnum" key={refreshTick}>
            Last refreshed <b>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b> · probe cadence {prefs.refreshSec}s
          </p>
        </section>

        {/* top services table */}
        <section className="plu-panel plu-panel--flush">
          <div className="plu-table-head-row">
            <h2 className="plu-sechead">Top services</h2>
            <span className="plu-table-head-note">by request volume</span>
          </div>
          <table className="plu-table">
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className={`plu-th ${sort.key === "name" ? "plu-th--active" : ""}`}
                    onClick={() => setSort((p) => ({ key: "name", dir: p.key === "name" ? (p.dir === 1 ? -1 : 1) : 1 }))}
                  >
                    Service {sort.key === "name" ? (sort.dir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th>Status</th>
                <th>
                  <button
                    type="button"
                    className={`plu-th ${sort.key === "p50" ? "plu-th--active" : ""}`}
                    onClick={() => setSort((p) => ({ key: "p50", dir: p.key === "p50" ? (p.dir === 1 ? -1 : 1) : 1 }))}
                  >
                    p50 {sort.key === "p50" ? (sort.dir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    className={`plu-th ${sort.key === "uptime" ? "plu-th--active" : ""}`}
                    onClick={() => setSort((p) => ({ key: "uptime", dir: p.key === "uptime" ? (p.dir === 1 ? -1 : 1) : 1 }))}
                  >
                    Uptime {sort.key === "uptime" ? (sort.dir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="plu-th--trend">Trend 60m</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, idx) => (
                <tr key={s.id} className="plu-tr">
                  <td className="plu-td-name">
                    <span className="plu-td-idx tnum">{String(idx + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="plu-td-name-txt">{s.name}</span>
                      <span className="plu-td-zone">{s.zone}</span>
                    </span>
                  </td>
                  <td>
                    <StateTag tone={STATE_TONE[s.state]} compact>{STATUS_LABEL[s.state]}</StateTag>
                  </td>
                  <td className="plu-td-num tnum">{fmtMs(serviceP50(s, s.state))}</td>
                  <td className="plu-td-num tnum">{fmtPct(s.uptime)}%</td>
                  <td className="plu-td-spark">
                    <Sparkline points={sparkline(idx + 3, s.state)} status={s.state} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
