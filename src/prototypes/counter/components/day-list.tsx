"use client";

/**
 * counter / components / day-list — the schedule at tablet width.
 *
 * NOT a squeezed week grid: at `@container surface (max-width: 900px)` a
 * seven-column time grid cannot survive, so the whole layout changes — the
 * grid is replaced by seven stacked day blocks, each a vertical, time-ordered
 * list of that day's bookings with the hour as a big numeral. Reading order is
 * preserved (Monday first), but the geometry is completely different, which
 * is the point of a real reflow rather than a narrower grid.
 */

import {
  DAY_SHORT,
  TODAY,
  durationLabel,
  hhmm,
  serviceById,
  shortDate,
  staffById,
  weekdayIndex,
} from "../data";
import { useCounter } from "../state/counter-context";
import { StatusPill } from "./booking-detail";

export function DayList({ days }: { days: string[] }) {
  const { bookings, services, selectedId, select, draft } = useCounter();

  return (
    <div className="ctr-days">
      {days.map((day) => {
        const dayBookings = bookings
          .filter((b) => b.day === day && b.status !== "cancelled")
          .sort((a, b) => a.start - b.start);
        return (
          <section key={day} className="ctr-day" data-today={day === TODAY || undefined}>
            <header className="ctr-day__head">
              <b>{DAY_SHORT[weekdayIndex(day)]}</b>
              <span className="ctr-day__date">{shortDate(day)}</span>
              <span className="ctr-day__count tnum">
                {dayBookings.length} {dayBookings.length === 1 ? "booking" : "bookings"}
              </span>
            </header>
            {dayBookings.length === 0 && (
              <p className="ctr-day__empty">Nothing booked — the whole day is free.</p>
            )}
            <ul className="ctr-day__list">
              {dayBookings.map((b) => {
                const service = services.find((s) => s.id === b.serviceId) ?? serviceById(b.serviceId);
                const person = staffById(b.staffId);
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      className="ctr-dayrow"
                      data-selected={selectedId === b.id || undefined}
                      data-picked={draft.day === day && draft.time === hhmm(b.start) ? true : undefined}
                      onClick={() => select(selectedId === b.id ? null : b.id)}
                    >
                      <span className="ctr-dayrow__time tnum">{hhmm(b.start)}</span>
                      <span className="ctr-dayrow__rail" data-tone={person?.tone ?? "a"} aria-hidden="true" />
                      <span className="ctr-dayrow__body">
                        <b>{b.customer}</b>
                        <span>
                          {service?.name} · {durationLabel(service?.duration ?? 30)} ·{" "}
                          {person?.name ?? "—"}
                        </span>
                      </span>
                      <StatusPill status={b.status} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
