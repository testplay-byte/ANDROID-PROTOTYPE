"use client";

/**
 * signal / screens / explore — the event table.
 *
 * This is the desktop-data screen: multi-column sortable headers, a search
 * box, category filter chips, checkbox multi-select with a bulk bar, an
 * in-row sparkline column, and a detail INSPECTOR that opens BESIDE the table
 * (never over it). Below 1000px the inspector drops under the table instead of
 * squeezing it.
 */

import { CATEGORIES, CATEGORY_LABEL, PLATFORMS, fmtInt, type EventCategory } from "../data";
import { useSignal, type SortKey } from "../state/signal-context";
import { Sparkline } from "../components/charts";
import { Chip, Delta, Meter, Readout } from "../components/atoms";
import { CheckIcon, CloseIcon, SearchIcon, TableIcon } from "../components/icons";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "event", label: "Event" },
  { key: "category", label: "Category" },
  { key: "users", label: "Users", align: "right" },
  { key: "volume", label: "Volume", align: "right" },
  { key: "delta", label: "Δ 30d", align: "right" },
  { key: "trend", label: "14-day trend" },
];

export function ExploreScreen() {
  const {
    filteredEvents,
    search,
    setSearch,
    categories,
    toggleCategory,
    sort,
    toggleSort,
    checked,
    toggleChecked,
    clearChecked,
    selected,
    selectEvent,
    density,
    notify,
  } = useSignal();

  const allChecked = filteredEvents.length > 0 && checked.length === filteredEvents.length;

  return (
    <div className="sig-view sig-view--split" data-density={density}>
      <div className="sig-tablewrap">
        <div className="sig-toolbar">
          <label className="sig-search">
            <SearchIcon size={15} />
            <input
              type="search"
              value={search}
              placeholder="Search events or owners"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
            />
            <kbd className="sig-kbd">/</kbd>
          </label>
          <div className="sig-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((c: EventCategory) => (
              <Chip key={c} on={categories.includes(c)} onClick={() => toggleCategory(c)}>
                {CATEGORY_LABEL[c]}
              </Chip>
            ))}
          </div>
        </div>

        {checked.length > 0 && (
          <div className="sig-bulkbar" role="status">
            <b className="tnum">{checked.length}</b> selected
            <span className="sig-bulkbar__sep" />
            <button type="button" onClick={() => notify(`${checked.length} events added to a board`)}>
              Add to board
            </button>
            <button type="button" onClick={() => notify("Funnel step created from selection")}>
              Create funnel step
            </button>
            <button type="button" onClick={() => notify("Selection exported as CSV")}>
              Export
            </button>
            <button type="button" className="sig-bulkbar__clear" onClick={clearChecked}>
              Clear
            </button>
          </div>
        )}

        <table className="sig-table">
          <thead>
            <tr>
              <th scope="col" className="sig-table__check">
                <input
                  type="checkbox"
                  checked={allChecked}
                  aria-label="Select all rows"
                  onChange={() => {
                    if (allChecked) clearChecked();
                    else filteredEvents.forEach((e) => toggleChecked(e.id));
                  }}
                />
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={c.align === "right" ? "sig-right" : undefined}
                  aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button type="button" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    <span className={`sig-sort ${sort.key === c.key ? "is-on" : ""}`} aria-hidden="true">
                      {sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : "▼"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e) => {
              const isChecked = checked.includes(e.id);
              return (
                <tr
                  key={e.id}
                  data-selected={selected?.id === e.id ? "true" : undefined}
                  data-checked={isChecked ? "true" : undefined}
                  onClick={() => selectEvent(selected?.id === e.id ? null : e.id)}
                >
                  <td className="sig-table__check" onClick={(ev) => ev.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={`Select ${e.event}`}
                      onChange={() => toggleChecked(e.id)}
                    />
                  </td>
                  <td>
                    <b className="sig-mono">{e.event}</b>
                    <span className="sig-table__sub">{e.owner} · first seen {e.firstSeen}</span>
                  </td>
                  <td>
                    <span className={`sig-tag sig-tag--${e.category}`}>{CATEGORY_LABEL[e.category]}</span>
                  </td>
                  <td className="sig-right tnum">{fmtInt(e.users)}</td>
                  <td className="sig-right tnum">{fmtInt(e.volume)}</td>
                  <td className="sig-right">
                    <Delta value={e.delta} />
                  </td>
                  <td className="sig-table__spark">
                    <Sparkline values={e.trend} series={e.delta >= 0 ? 1 : 2} height={22} />
                  </td>
                </tr>
              );
            })}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={7} className="sig-table__empty">
                  No events match. Clear the search or drop a category filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="sig-tablefoot">
          <span className="tnum">
            {filteredEvents.length} of 14 events
          </span>
          <span className="sig-tablefoot__hint">
            <TableIcon size={13} /> Click a row to open the inspector beside the table
          </span>
        </footer>
      </div>

      {selected && <EventInspector />}
    </div>
  );
}

/* The inspector: a desktop-only pattern — persistent, beside the data. */
function EventInspector() {
  const { selected, selectEvent, notify } = useSignal();
  if (!selected) return null;
  const growth = ((selected.trend[13] - selected.trend[0]) / selected.trend[0]) * 100;

  return (
    <aside className="sig-inspector" aria-label={`${selected.event} details`}>
      <header className="sig-inspector__head">
        <div>
          <h2 className="sig-mono">{selected.event}</h2>
          <p>
            <span className={`sig-tag sig-tag--${selected.category}`}>{CATEGORY_LABEL[selected.category]}</span>{" "}
            owned by {selected.owner}
          </p>
        </div>
        <button className="sig-iconbtn" type="button" onClick={() => selectEvent(null)} aria-label="Close inspector">
          <CloseIcon size={15} />
        </button>
      </header>

      <Readout
        items={[
          { label: "Users (30d)", value: fmtInt(selected.users) },
          { label: "Events (30d)", value: fmtInt(selected.volume) },
          { label: "p50 latency", value: selected.p50 },
          { label: "14-day growth", value: `${growth >= 0 ? "+" : "−"}${Math.abs(growth).toFixed(1)}%`, tone: growth >= 0 ? "ok" : "bad" },
        ]}
      />

      <h3 className="sig-inspector__section">14-day volume</h3>
      <div className="sig-inspector__spark">
        <Sparkline values={selected.trend} series={1} height={54} />
      </div>
      <div className="sig-note">
        <Delta value={selected.delta} />
        <span>against the previous 30 days.</span>
      </div>

      <h3 className="sig-inspector__section">Platform split</h3>
      <ul className="sig-bars">
        {selected.platforms.map((p, i) => (
          <li key={p.id}>
            <span className="sig-bars__label">{PLATFORMS.find((x) => x.id === p.id)?.label ?? p.id}</span>
            <Meter value={p.share / 100} />
            <b className="tnum">{p.share}%</b>
            <span className="sig-bars__ink" data-series={i + 1} aria-hidden="true" />
          </li>
        ))}
      </ul>

      <h3 className="sig-inspector__section">Top properties</h3>
      <table className="sig-mini">
        <tbody>
          {selected.properties.map((p) => (
            <tr key={p.name}>
              <td className="sig-mono">{p.name}</td>
              <td>{p.value}</td>
              <td className="sig-right tnum">{p.share}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sig-inspector__actions">
        <button className="sig-btn sig-btn--solid" type="button" onClick={() => notify(`${selected.event} added to a dashboard`)}>
          <CheckIcon size={14} /> Add to dashboard
        </button>
        <button className="sig-btn" type="button" onClick={() => notify("Funnel step created from this event")}>
          Funnel step
        </button>
      </div>
    </aside>
  );
}
