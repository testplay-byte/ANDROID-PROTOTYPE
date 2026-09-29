"use client";

/**
 * facet / screens / calendar-screen — the desktop pattern: a real month grid
 * with the selected day's detail BESIDE it, never over it.
 *
 * The month arithmetic is pure integer work (daysFromCivil in data.ts), so
 * the grid, the weekday columns and "is this day today" all agree with the
 * board's mini month tile without a single Date object.
 */

import {
  DAY_SHORT,
  MONTH_LONG,
  TODAY,
  TODAY_MONTH,
  TODAY_YEAR,
  daysInMonth,
  hhmm,
  iso,
  longDate,
  monthAt,
  weekdayOf,
} from "../data";
import { LeftIcon, RightIcon } from "../components/icons";
import { useFacet } from "../state/facet-context";

export function CalendarScreen() {
  const { selectedDay, selectDay, monthOffset, shiftMonth, eventsFor, habits, toggleHabit } =
    useFacet();

  const view = monthAt(TODAY_YEAR, TODAY_MONTH, monthOffset);
  const lead = weekdayOf(view.year, view.month, 1);
  const total = daysInMonth(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const monthEvents = new Map<string, number>();
  for (let d = 1; d <= total; d += 1) {
    const key = iso(view.year, view.month, d);
    monthEvents.set(key, eventsFor(key).length);
  }

  const selectedEvents = eventsFor(selectedDay);
  const isThisMonth =
    selectedDay.slice(0, 7) === `${view.year}-${String(view.month).padStart(2, "0")}`;

  return (
    <div className="fc-view">
      <div className="fc-split">
        {/* ---------- the month ---------- */}
        <div className="fc-split__main">
          <div className="fc-month">
            <div className="fc-month__bar">
              <h2 className="fc-month__title">
                {MONTH_LONG[view.month - 1]} {view.year}
              </h2>
              <div className="fc-month__nav">
                <button
                  type="button"
                  className="fc-iconbtn"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                >
                  <LeftIcon />
                </button>
                <button
                  type="button"
                  className="fc-btn fc-btn--sm"
                  onClick={() => {
                    shiftMonth(-monthOffset);
                    selectDay(TODAY);
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="fc-iconbtn"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                >
                  <RightIcon />
                </button>
              </div>
            </div>

            <div className="fc-month__dows">
              {DAY_SHORT.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="fc-month__grid" data-cols="7">
              {cells.map((d, i) => {
                if (d === null) return <span className="fc-month__cell is-blank" key={`b${i}`} />;
                const key = iso(view.year, view.month, d);
                const count = monthEvents.get(key) ?? 0;
                return (
                  <button
                    type="button"
                    key={key}
                    className="fc-month__cell tnum"
                    data-today={key === TODAY || undefined}
                    data-selected={key === selectedDay || undefined}
                    onClick={() => selectDay(key)}
                    aria-label={`${longDate(key)}${count ? `, ${count} events` : ""}`}
                    aria-current={key === selectedDay ? "date" : undefined}
                  >
                    <span className="fc-month__num">{d}</span>
                    <span className="fc-month__dots" data-count={Math.min(3, count) || undefined}>
                      {count > 0 && <i />}
                      {count > 1 && <i />}
                      {count > 2 && <i />}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="fc-month__foot">
              {cells.filter((c) => c !== null).length} days ·{" "}
              {Array.from(monthEvents.values()).reduce((a, b) => a + b, 0)} events ·{" "}
              {monthOffset === 0 ? "showing the pinned month" : `${Math.abs(monthOffset)} month${Math.abs(monthOffset) === 1 ? "" : "s"} from the pinned month`}
            </p>
          </div>
        </div>

        {/* ---------- the day detail, BESIDE the grid ---------- */}
        <aside className="fc-split__side">
          <div className="fc-daydetail">
            <span className="fc-daydetail__label">Selected day</span>
            <h3 className="fc-daydetail__title">{longDate(selectedDay)}</h3>
            {!isThisMonth && (
              <p className="fc-daydetail__note">
                {selectedDay} is outside {MONTH_LONG[view.month - 1]} — the grid highlights it as soon
                as you navigate back.
              </p>
            )}

            <ul className="fc-events">
              {selectedEvents.map((e) => (
                <li className="fc-event" key={e.id} data-tone={e.tone}>
                  <span className="fc-event__time tnum">{hhmm(e.start)}</span>
                  <span className="fc-event__text">
                    <b>{e.title}</b>
                    <span>{e.where}</span>
                  </span>
                </li>
              ))}
              {selectedEvents.length === 0 && (
                <li className="fc-events__empty">Nothing booked. A free day is a feature.</li>
              )}
            </ul>
          </div>

          <div className="fc-daydetail">
            <span className="fc-daydetail__label">Habits on this day</span>
            <ul className="fc-checklist">
              {habits.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    className="fc-checklist__item"
                    data-done={h.done || undefined}
                    onClick={() => toggleHabit(h.id)}
                    aria-pressed={h.done}
                  >
                    <span className="fc-checklist__box" aria-hidden="true" />
                    {h.name}
                    <span className="fc-checklist__target tnum">{h.target}×</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
