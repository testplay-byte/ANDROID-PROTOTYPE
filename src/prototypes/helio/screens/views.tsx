"use client";

/**
 * helio / screens — analytics, sites and live.
 *
 * Kept in one file because each is a single panel: the board-style detail
 * beside a table, the load-band timeline with its crosshair, and the live
 * view with the site map.
 */

import { useMemo, useState } from "react";
import {
  ALERTS,
  FREQUENCY,
  HEALTH,
  LOAD_STEPS,
  MIX,
  SITES,
  STATUS_LABEL,
  STORAGE,
  WEEKS,
  WEEK_AVG,
  fmt,
  type SiteStatus,
} from "../data";
import { useHelio } from "../state/helio-context";
import {
  AreaLine,
  ChartCard,
  ColumnChart,
  ComboChart,
  RankBars,
  SegmentedProgress,
  SiteMap,
  Sparkline,
  StepTimeline,
  StackedBar,
} from "../components/charts";
import { BatteryIcon, LayersIcon, SignalIcon, SiteIcon } from "../components/icons";

/* ================================================================== */
/* analytics                                                           */
/* ================================================================== */
export function AnalyticsScreen() {
  const { density, notify } = useHelio();
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const scale = range === "7d" ? 1 : range === "30d" ? 4.1 : 11.6;
  const weekly = useMemo(
    () => WEEKS.map((w) => ({ ...w, value: Math.round(w.value * scale) })),
    [scale]
  );
  const avg = Math.round((WEEK_AVG * scale) / 1) ;

  return (
    <div className="hl-view" data-density={density}>
      <div className="hl-subbar">
        <div className="hl-segment" role="radiogroup" aria-label="Range">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={range === r}
              className="hl-segment__btn"
              data-on={range === r || undefined}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="hl-subbar__meta tnum">avg {fmt(avg)} MW / day</span>
      </div>

      <div className="hl-grid">
        <ChartCard
          title={`Daily output · ${range.toUpperCase()}`}
          tall
          icon={<LayersIcon size={16} />}
          legend={[
            { label: "Actual", color: "var(--chart-series-1)" },
            { label: "Forecast", color: "var(--chart-series-2)" },
          ]}
        >
          <ColumnChart
            data={weekly}
            selected={weekly.length - 1}
            avg={avg}
            avgLabel={`${fmt(avg)} AVG`}
            height={230}
          />
        </ChartCard>

        <ChartCard title="Load bands · today" icon={<SignalIcon size={16} />} aside={<span className="hl-tag">96 steps</span>}>
          <StepTimeline steps={LOAD_STEPS} labels="00:00" height={210} />
          <ul className="hl-keylist">
            <li>
              <i style={{ background: "var(--chart-series-3)" }} /> Peak
            </li>
            <li>
              <i style={{ background: "var(--chart-series-1)" }} /> Base
            </li>
            <li>
              <i style={{ background: "var(--chart-series-4)" }} /> Off-peak
            </li>
          </ul>
        </ChartCard>

        <ChartCard title="Mix by day" icon={<BatteryIcon size={16} />}>
          <div className="hl-mixdays">
            {MIX.map((m, i) => (
              <div className="hl-mixday" key={m.day} data-on={i === 1 || undefined}>
                <span>{m.day}</span>
                <div className="hl-mixday__bar">
                  {(["solar", "wind", "grid", "battery"] as const).map((k) => (
                    <i
                      key={k}
                      style={{
                        width: `${m[k]}%`,
                        background:
                          k === "solar"
                            ? "var(--chart-series-3)"
                            : k === "wind"
                              ? "var(--chart-series-4)"
                              : k === "grid"
                                ? "var(--chart-series-1)"
                                : "var(--chart-series-2)",
                      }}
                    />
                  ))}
                </div>
                <b className="tnum">{m.solar + m.wind + m.grid + m.battery}%</b>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Storage trajectory" icon={<BatteryIcon size={16} />}>
          <AreaLine
            values={[22, 26, 31, 38, 44, 49, 53, 57, 60, 61, 60, 58, 55, 51, 47, 44]}
            labels={["00", "06", "12", "18", "24"]}
            color="var(--chart-series-2)"
          />
          <SegmentedProgress
            value={Math.round((STORAGE.usedMwh / STORAGE.capacityMwh) * 100)}
            segments={12}
            color="var(--chart-series-2)"
          />
        </ChartCard>
      </div>
    </div>
  );
}

/* ================================================================== */
/* sites                                                              */
/* ================================================================== */
const FILTERS: (SiteStatus | "all")[] = ["all", "online", "curtailed", "offline", "maintenance"];

export function SitesScreen() {
  const { density, query, setQuery, selectSite, siteId, notify } = useHelio();
  const [filter, setFilter] = useState<SiteStatus | "all">("all");
  const [sort, setSort] = useState<"output" | "name">("output");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SITES.filter(
      (s) =>
        (filter === "all" || s.status === filter) &&
        (!q || s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.outputMw - a.outputMw
    );
  }, [query, filter, sort]);

  return (
    <div className="hl-view" data-density={density}>
      <div className="hl-subbar">
        <label className="hl-search">
          <input
            value={query}
            placeholder="Search sites or regions"
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search sites"
          />
        </label>
        <div className="hl-filters" role="group" aria-label="Status filter">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="hl-filter"
              data-on={filter === f || undefined}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
        <button
          className="hl-select"
          type="button"
          onClick={() => setSort(sort === "output" ? "name" : "output")}
        >
          Sort: {sort === "output" ? "Output" : "Name"} <span aria-hidden="true">▾</span>
        </button>
      </div>

      <div className="hl-split">
        <section className="hl-card hl-card--flush">
          <table className="hl-table">
            <thead>
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Region</th>
                <th scope="col" className="hl-ta-r">Output</th>
                <th scope="col" className="hl-ta-r">Capacity</th>
                <th scope="col" className="hl-ta-r">Eff.</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.id}
                  data-on={siteId === s.id || undefined}
                  onClick={() => selectSite(siteId === s.id ? null : s.id)}
                >
                  <td>
                    <b>{s.name}</b>
                  </td>
                  <td>{s.region}</td>
                  <td className="hl-ta-r tnum">{fmt(s.outputMw)}</td>
                  <td className="hl-ta-r tnum">{fmt(s.capacityMw)}</td>
                  <td className="hl-ta-r tnum">{s.efficiency.toFixed(1)}%</td>
                  <td>
                    <span className="hl-pill" data-status={s.status}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="hl-table__empty">
                    No sites match “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {siteId && <SiteDetail onClose={() => selectSite(null)} onAct={notify} />}
      </div>
    </div>
  );
}

function SiteDetail({ onClose, onAct }: { onClose: () => void; onAct: (m: string) => void }) {
  const { siteId } = useHelio();
  const site = SITES.find((s) => s.id === siteId);
  if (!site) return null;
  const load = Math.round((site.outputMw / site.capacityMw) * 100);
  return (
    <aside className="hl-card hl-detail" aria-label={`${site.name} detail`}>
      <header className="hl-detail__head">
        <div>
          <h3>{site.name}</h3>
          <p>{site.region} region</p>
        </div>
        <button className="hl-dots" type="button" onClick={onClose} aria-label="Close detail">
          ✕
        </button>
      </header>
      <div className="hl-stat">
        <strong className="tnum">{load}%</strong>
        <span className="hl-badge" data-status={site.status}>
          {STATUS_LABEL[site.status]}
        </span>
      </div>
      <SegmentedProgress value={load} segments={10} color="var(--chart-series-1)" />
      <Sparkline values={[40, 46, 52, 61, 58, 66, 72, 69, 77, 84, site.outputMw / site.capacityMw * 100]} color="var(--chart-series-1)" smooth area label={`${site.name} output today`} />
      <dl className="hl-facts">
        <div>
          <dt>Capacity</dt>
          <dd className="tnum">{fmt(site.capacityMw)} MW</dd>
        </div>
        <div>
          <dt>Output</dt>
          <dd className="tnum">{fmt(site.outputMw)} MW</dd>
        </div>
        <div>
          <dt>Efficiency</dt>
          <dd className="tnum">{site.efficiency.toFixed(1)}%</dd>
        </div>
      </dl>
      <button className="hl-btn" type="button" onClick={() => onAct(`Dispatched a technician to ${site.name}`) }>
        Dispatch technician
      </button>
    </aside>
  );
}

/* ================================================================== */
/* live                                                               */
/* ================================================================== */
export function TrackerScreen() {
  const { density, live, toggleLive, notify } = useHelio();
  return (
    <div className="hl-view" data-density={density}>
      <div className="hl-grid hl-grid--two">
        <ChartCard
          title="Frequency · now"
          tall
          icon={<SignalIcon size={16} />}
          aside={
            <button className="hl-select" type="button" onClick={toggleLive} aria-pressed={live}>
              {live ? "Streaming" : "Held"} <span aria-hidden="true">▾</span>
            </button>
          }
        >
          <div className="hl-headline">
            <strong className="tnum">50.01</strong>
            <span>Hz nominal</span>
            <b className="hl-delta tnum">±0.03</b>
          </div>
          <Sparkline values={FREQUENCY} color="var(--chart-series-5)" height={92} label="Grid frequency, last hour" />
          <Sparkline values={FREQUENCY.slice().reverse()} color="var(--chart-series-2)" height={92} label="Grid frequency, previous hour" />
        </ChartCard>

        <ChartCard
          title="Network"
          icon={<SiteIcon size={16} />}
          aside={<span className="hl-tag">{SITES.length} sites</span>}
        >
          <SiteMap points={SITES.map((s, i) => ({ x: 40 + ((i * 67) % 330), y: 44 + ((i * 43) % 190), hot: s.status === "online" }))} />
          <button className="hl-btn" type="button" onClick={() => notify("Opening the network map") }>
            Open network map
          </button>
        </ChartCard>

        <ChartCard title="Output by hour" icon={<LayersIcon size={16} />} tall>
          <ComboChart
            values={MIX.map((m) => m.solar + m.wind + m.battery)}
            labels={MIX.map((m) => m.day)}
            highlight={1}
            valueFmt={(v) => String(Math.round(v))}
            height={200}
          />
        </ChartCard>

        <ChartCard title="Recent events" icon={<SignalIcon size={16} />} aside={<span className="hl-tag">{ALERTS.length}</span>}>
          <ul className="hl-alerts">
            {ALERTS.map((a) => (
              <li key={a.id} data-sev={a.severity}>
                <i />
                <div>
                  <b>{a.text}</b>
                  <span>{a.when}</span>
                </div>
              </li>
            ))}
          </ul>
          <RankBars rows={MIX.map((m) => ({ label: m.day, value: m.wind }))} format={(v) => String(v)} />
        </ChartCard>
      </div>
      <p className="hl-footnote tnum">
        Health {HEALTH.score}% · storage {STORAGE.usedMwh} MWh · stream {live ? "on" : "paused"}
      </p>
    </div>
  );
}
