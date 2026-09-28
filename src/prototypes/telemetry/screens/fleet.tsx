"use client";

/**
 * telemetry / screens / fleet — the service fleet.
 *
 * The desktop data table, and the densest screen in the console:
 *   - a status summary strip (5 counters, one per state + open incidents)
 *   - a filter toolbar (search + status filter chips, result count)
 *   - a checkbox multi-select with a bulk action bar
 *   - sortable columns (name / tier / state / p50 / error rate / uptime)
 *   - a grid of square status tiles with 30-day uptime bars
 *   - a right-hand detail panel that opens BESIDE the table, never over it
 *   - a density preference that changes row height app-wide
 */

import { TIER_LABEL, fmtPct, type ServiceState } from "../data";
import { useTelemetry, type SortKey, type StatusFilter } from "../state/telemetry-context";
import { Sparkline, UptimeStrip } from "../components/charts";
import { Chip, StatusSquare, Tag } from "../components/controls";
import { ServicePanel } from "../components/service-panel";
import { ChevronIcon, SearchIcon } from "../components/icons";

const FILTERS: StatusFilter[] = ["all", "healthy", "degraded", "down"];

const FILTER_LABEL: Record<StatusFilter, string> = {
  all: "All",
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

/** Sortable columns; `cls` marks the ones that drop out when narrow. */
const COLUMNS: { key: SortKey; label: string; num?: boolean; cls?: string }[] = [
  { key: "name", label: "Service" },
  { key: "tier", label: "Tier", cls: "tel-col-tier" },
  { key: "state", label: "State" },
  { key: "p50", label: "p50", num: true },
  { key: "errorRate", label: "Err %", num: true },
  { key: "uptime", label: "Uptime", num: true },
];

/** Visual-only trailing column (no sort key of its own). */
const LOAD_COL = "Load";

const STATE_TONE: Record<ServiceState, "red" | "amber" | "green"> = {
  healthy: "green",
  degraded: "amber",
  down: "red",
};

export function FleetScreen() {
  const {
    services,
    counts,
    filtered,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sort,
    toggleSort,
    checked,
    toggleChecked,
    clearChecked,
    allVisibleChecked,
    selectedService,
    selectService,
    density,
    pollStamp,
    notify,
  } = useTelemetry();

  const countFor = (f: StatusFilter) =>
    f === "all" ? services.length : services.filter((s) => s.state === f).length;

  return (
    <div className="tel-view tel-split" data-density={density}>
      <div>
        {/* ---- status summary strip ---- */}
        <section className="tel-strip" aria-label="Fleet status summary">
          <div className="tel-strip__cell">
            <div className="tel-strip__text">
              <b>Services</b>
              <span>across 4 tiers</span>
            </div>
            <strong className="tel-strip__num">{counts.total}</strong>
          </div>
          <div className="tel-strip__cell" data-tone="ok">
            <StatusSquare state="healthy" />
            <div className="tel-strip__text">
              <b>Healthy</b>
              <span>meeting SLO</span>
            </div>
            <strong className="tel-strip__num">{counts.healthy}</strong>
          </div>
          <div className="tel-strip__cell" data-tone="warn">
            <StatusSquare state="degraded" />
            <div className="tel-strip__text">
              <b>Degraded</b>
              <span>latency above SLO</span>
            </div>
            <strong className="tel-strip__num">{counts.degraded}</strong>
          </div>
          <div className="tel-strip__cell" data-tone="bad">
            <StatusSquare state="down" />
            <div className="tel-strip__text">
              <b>Down</b>
              <span>failing probes</span>
            </div>
            <strong className="tel-strip__num">{counts.down}</strong>
          </div>
          <div className="tel-strip__cell">
            <div className="tel-strip__text">
              <b>Open incidents</b>
              <span className="tnum">polled {pollStamp}</span>
            </div>
            <strong className="tel-strip__num">{counts.open}</strong>
          </div>
        </section>

        {/* ---- square status tiles with 30-day uptime bars ---- */}
        <section className="tel-tiles" aria-label="Service status tiles">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              className="tel-tile"
              data-state={s.state}
              data-selected={selectedService === s.id || undefined}
              aria-label={`${s.name}, ${s.state}. Open details.`}
              onClick={() => selectService(selectedService === s.id ? null : s.id)}
            >
              <span className="tel-tile__top">
                <StatusSquare state={s.state} small />
                <span className="tel-tile__name">{s.name}</span>
              </span>
              <UptimeStrip
                bars={s.bars}
                state={s.state}
                label={`${s.name} 30 day uptime, ${fmtPct(s.uptime)} percent`}
              />
              <span className="tel-tile__meta">
                <span className="tel-tile__region">{TIER_LABEL[s.tier]} · {s.region}</span>
                <span className="tel-tile__pct">{fmtPct(s.uptime)}</span>
              </span>
            </button>
          ))}
        </section>

        {/* ---- filter toolbar ---- */}
        <div className="tel-toolbar">
          <label className="tel-search">
            <SearchIcon size={15} />
            <input
              type="search"
              value={search}
              placeholder="Search services, tiers, regions, teams"
              aria-label="Search services"
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="tel-kbd">/</span>
          </label>
          <div className="tel-toolbar__chips" role="group" aria-label="Filter by state">
            {FILTERS.map((f) => (
              <Chip
                key={f}
                label={FILTER_LABEL[f]}
                count={countFor(f)}
                on={statusFilter === f}
                onClick={() => setStatusFilter(f)}
              />
            ))}
          </div>
          <span className="tel-toolbar__count tnum">
            {filtered.length} of {services.length} services
          </span>
        </div>

        {/* ---- bulk action bar ---- */}
        {checked.length > 0 && (
          <div className="tel-bulkbar" role="status">
            <b className="tnum">{checked.length}</b>
            <span>selected</span>
            <span className="tel-bulkbar__sep" />
            <button type="button" onClick={() => notify(`Probe dispatched to ${checked.length} services`)}>
              Run probe
            </button>
            <button type="button" onClick={() => notify(`Drain queued for ${checked.length} services`)}>
              Drain
            </button>
            <button type="button" onClick={() => notify("Silence window set for 30 minutes")}>
              Silence 30m
            </button>
            <button type="button" className="tel-bulkbar__clear" onClick={clearChecked}>
              Clear
            </button>
          </div>
        )}

        {/* ---- the table ---- */}
        <table className="tel-table">
          <colgroup>
            <col className="tel-c-check" />
            <col />
            <col className="tel-c-tier" />
            <col className="tel-c-state" />
            <col className="tel-c-num" />
            <col className="tel-c-num" />
            <col className="tel-c-up" />
            <col className="tel-c-load" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  checked={allVisibleChecked}
                  aria-label="Select all visible services"
                  onChange={() => {
                    if (allVisibleChecked) {
                      clearChecked();
                    } else {
                      for (const s of filtered) if (!checked.includes(s.id)) toggleChecked(s.id);
                    }
                  }}
                />
              </th>
              {COLUMNS.map((c) => {
                const isSorted = sort.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={[c.num ? "is-num" : "", c.cls ?? ""].join(" ").trim() || undefined}
                    aria-sort={isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button
                      type="button"
                      className={`tel-th${c.num ? " is-num" : ""}${isSorted ? " is-sorted" : ""}`}
                      data-dir={isSorted ? sort.dir : undefined}
                      onClick={() => toggleSort(c.key)}
                    >
                      {c.label}
                      <span className="tel-sort" aria-hidden="true">
                        {isSorted && <ChevronIcon size={11} />}
                      </span>
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="tel-col-load">
                <span className="tel-th">{LOAD_COL}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isChecked = checked.includes(s.id);
              return (
                <tr
                  key={s.id}
                  data-selected={selectedService === s.id || undefined}
                  data-checked={isChecked || undefined}
                  onClick={() => selectService(selectedService === s.id ? null : s.id)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={`Select ${s.name}`}
                      onChange={() => toggleChecked(s.id)}
                    />
                  </td>
                  <td>
                    <span className="tel-td__name">
                      <b>{s.name}</b>
                      <span className="tel-td__sub">{s.team} · {s.nodes} nodes</span>
                    </span>
                  </td>
                  <td className="tel-col-tier">{TIER_LABEL[s.tier]}</td>
                  <td>
                    <Tag tone={STATE_TONE[s.state]}>
                      <StatusSquare state={s.state} small />
                      {s.state}
                    </Tag>
                  </td>
                  <td className="is-num">{s.liveP50} ms</td>
                  <td className="is-num">{s.errorRate.toFixed(2)}</td>
                  <td className="is-num">{fmtPct(s.uptime)}</td>
                  <td className="tel-col-load">
                    <Sparkline points={s.load} state={s.state} width={68} height={18} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="tel-table__empty">
                  No services match “{search}”. Clear the search or pick another state.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="tel-tablefoot">
          <span>Showing {filtered.length} of {services.length} services</span>
          <span>
            Sorted by {COLUMNS.find((c) => c.key === sort.key)?.label ?? sort.key} · {sort.dir}
          </span>
          <span>Click a row or tile to open the detail panel on the right</span>
        </footer>
      </div>

      {selectedService && <ServicePanel />}
    </div>
  );
}
