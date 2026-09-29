"use client";

/**
 * counter / screens / bookings — the desktop data table.
 *
 * What makes this a DESKTOP table, not a phone list:
 *   - multi-column sortable headers (click to toggle asc/desc)
 *   - a filter toolbar (search + status chips + a person filter) above the data
 *   - checkbox multi-select driving a bulk status bar
 *   - a detail panel that opens BESIDE the table, never over it
 *
 * At tablet width the container query turns the split into a column, so the
 * detail panel becomes a full-width block UNDER the table.
 */

import {
  DAY_SHORT,
  STAFF,
  STATUS_FLOW,
  STATUS_LABEL,
  durationLabel,
  hhmm,
  money,
  serviceById,
  shortDate,
  staffById,
  weekdayIndex,
  type BookingStatus,
} from "../data";
import { useCounter, type SortKey } from "../state/counter-context";
import { BookingDetail, StatusPill } from "../components/booking-detail";
import { CheckIcon, SearchIcon } from "../components/icons";

const FILTERS: (BookingStatus | "all")[] = ["all", ...STATUS_FLOW];

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "customer", label: "Customer" },
  { key: "day", label: "When" },
  { key: "staff", label: "With" },
  { key: "price", label: "Price", align: "right" },
];

export function BookingsScreen() {
  const {
    visibleBookings,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    staffFilter,
    setStaffFilter,
    sort,
    toggleSort,
    selectedId,
    select,
    checked,
    toggleChecked,
    setCheckedAll,
    clearChecked,
    setStatus,
    services,
    counts,
  } = useCounter();

  const allSelected =
    visibleBookings.length > 0 && visibleBookings.every((b) => checked.includes(b.id));

  const bulk = (status: BookingStatus) => {
    setStatus(checked, status);
    clearChecked();
  };

  return (
    <div className="ctr-view ctr-split">
      <div className="ctr-split__main">
        <div className="ctr-toolbar">
          <label className="ctr-search">
            <SearchIcon size={16} />
            <input
              type="search"
              value={search}
              placeholder="Search customer, service or status"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search bookings"
            />
            <kbd>/</kbd>
          </label>
          <label className="ctr-select">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              aria-label="Filter by person"
            >
              <option value="all">Everyone</option>
              {STAFF.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="ctr-filters" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`ctr-filter ${statusFilter === f ? "is-on" : ""}`}
              aria-pressed={statusFilter === f}
              onClick={() => setStatusFilter(f)}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]}
              <span className="ctr-filter__n tnum">{counts[f]}</span>
            </button>
          ))}
        </div>

        {checked.length > 0 && (
          <div className="ctr-bulkbar" role="status">
            <b className="tnum">{checked.length}</b> selected
            <span className="ctr-bulkbar__sep" />
            <button type="button" onClick={() => bulk("confirmed")}>
              Confirm
            </button>
            <button type="button" onClick={() => bulk("checked-in")}>
              Check in
            </button>
            <button type="button" onClick={() => bulk("completed")}>
              Complete
            </button>
            <button type="button" onClick={() => bulk("cancelled")}>
              Cancel
            </button>
            <button type="button" className="ctr-bulkbar__clear" onClick={clearChecked}>
              Clear
            </button>
          </div>
        )}

        <table className="ctr-table">
          <thead>
            <tr>
              <th scope="col" className="ctr-table__check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  aria-label="Select every visible booking"
                  onChange={() => setCheckedAll(allSelected ? [] : visibleBookings.map((b) => b.id))}
                />
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.align === "right" ? { textAlign: "right" } : undefined}
                  aria-sort={
                    sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
                  }
                >
                  <button type="button" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    <span className={`ctr-sort ${sort.key === c.key ? "is-on" : ""}`} aria-hidden="true">
                      {sort.key === c.key && sort.dir === "asc" ? "▲" : "▼"}
                    </span>
                  </button>
                </th>
              ))}
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleBookings.map((b) => {
              const service = services.find((s) => s.id === b.serviceId) ?? serviceById(b.serviceId);
              const person = staffById(b.staffId);
              const isChecked = checked.includes(b.id);
              return (
                <tr
                  key={b.id}
                  data-selected={selectedId === b.id || undefined}
                  data-checked={isChecked || undefined}
                  onClick={() => select(selectedId === b.id ? null : b.id)}
                >
                  <td className="ctr-table__check" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={`Select ${b.customer}`}
                      onChange={() => toggleChecked(b.id)}
                    />
                  </td>
                  <td>
                    <b>{b.customer}</b>
                    <span className="ctr-table__sub">
                      {service?.name ?? "—"} · {durationLabel(service?.duration ?? 30)}
                    </span>
                  </td>
                  <td className="tnum">
                    <b>
                      {DAY_SHORT[weekdayIndex(b.day)]} {shortDate(b.day)}
                    </b>
                    <span className="ctr-table__sub tnum">
                      {hhmm(b.start)}–{hhmm(b.start + (service?.duration ?? 30))}
                    </span>
                  </td>
                  <td>
                    <span className="ctr-person">
                      <span
                        className="ctr-avatar ctr-avatar--sm"
                        data-tone={person?.tone ?? "a"}
                        aria-hidden="true"
                      >
                        {person?.initials ?? "—"}
                      </span>
                      {person?.name.split(" ")[0] ?? "—"}
                    </span>
                  </td>
                  <td className="tnum" style={{ textAlign: "right" }}>
                    {money(service?.price ?? 0)}
                  </td>
                  <td>
                    <StatusPill status={b.status} />
                  </td>
                </tr>
              );
            })}
            {visibleBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="ctr-table__empty">
                  No bookings match “{search}”. Clear the search or widen the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="ctr-tablefoot">
          <span className="tnum">
            {visibleBookings.length} of {counts.all} bookings
          </span>
          <span className="ctr-tablefoot__hint">
            <CheckIcon size={13} /> Click a row to open its detail beside the table
          </span>
        </footer>
      </div>

      {selectedId && <BookingDetail />}
    </div>
  );
}
