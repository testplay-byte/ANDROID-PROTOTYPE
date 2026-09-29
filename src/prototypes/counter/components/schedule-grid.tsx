"use client";

/**
 * counter / components / schedule-grid — the week view.
 *
 * A desktop-only pattern with no phone equivalent: a real time grid where
 * blocks are positioned by minutes-from-midnight and sized by the service
 * duration.
 *
 *   - an hour gutter down the left (08:00 → 18:00, 38px an hour)
 *   - one ROW per person, one COLUMN per day of the pinned week
 *   - blocks are flat colour planes; the status is the stripe down the left
 *   - clicking empty space snaps that slot into the booking form
 *   - clicking a block selects it — the detail panel opens BESIDE the grid
 *
 * There is no drag-and-drop and no "scroll to now": the week is pinned to a
 * fixed today so the screen looks identical on every load.
 */

import {
  DAY_END,
  DAY_START,
  DAY_SHORT,
  HOUR_PX,
  STAFF,
  TODAY,
  hhmm,
  shortDate,
  weekdayIndex,
  type Booking,
  type Staff,
} from "../data";
import { useCounter } from "../state/counter-context";
import { StatusPill } from "./booking-detail";

const HOURS = Array.from({ length: (DAY_END - DAY_START) / 60 }, (_, i) => DAY_START + i * 60);

/** Snap a click's y-offset to the nearest 15 minutes. */
function snap(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

export function ScheduleGrid({ days }: { days: string[] }) {
  const { bookings, services, selectedId, select, setDraft, draft } = useCounter();

  return (
    <div
      className="ctr-week"
      style={{ gridTemplateColumns: `76px repeat(${days.length}, minmax(0, 1fr))` }}
    >
      <div className="ctr-week__corner">
        <span>Time</span>
      </div>
      {days.map((d) => (
        <div key={d} className="ctr-week__dayhead" data-today={d === TODAY || undefined}>
          <b>{DAY_SHORT[weekdayIndex(d)]}</b>
          <span className="tnum">{shortDate(d)}</span>
        </div>
      ))}

      {STAFF.map((person) => (
        <PersonRow
          key={person.id}
          person={person}
          days={days}
          bookings={bookings}
          services={services}
          selectedId={selectedId}
          draft={draft}
          onSelect={select}
          onPick={setDraft}
        />
      ))}
    </div>
  );
}

function PersonRow({
  person,
  days,
  bookings,
  services,
  selectedId,
  draft,
  onSelect,
  onPick,
}: {
  person: Staff;
  days: string[];
  bookings: Booking[];
  services: { id: string; duration: number }[];
  selectedId: string | null;
  draft: { day: string; time: string };
  onSelect: (id: string | null) => void;
  onPick: (patch: { day: string; time: string }) => void;
}) {
  const durationOf = (id: string) => services.find((s) => s.id === id)?.duration ?? 30;

  return (
    <>
      <div className="ctr-week__who">
        <span className="ctr-avatar" data-tone={person.tone} aria-hidden="true">
          {person.initials}
        </span>
        <b title={person.name}>{person.name.split(" ")[0]}</b>
      </div>
      {days.map((day) => (
        <div
          key={`${person.id}-${day}`}
          className="ctr-week__cell"
          data-today={day === TODAY || undefined}
          onClick={(e) => {
            // click empty space → snap that slot into the booking form
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const minute = snap(DAY_START + (y / HOUR_PX) * 60);
            onPick({ day, time: hhmm(Math.max(DAY_START, Math.min(DAY_END - 15, minute))) });
          }}
        >
          {HOURS.map((h) => (
            <span key={h} className="ctr-week__rowline" style={{ height: HOUR_PX }} />
          ))}
          {bookings
            .filter((b) => b.day === day && b.staffId === person.id && b.status !== "cancelled")
            .map((b) => (
              <Block
                key={b.id}
                booking={b}
                person={person}
                duration={durationOf(b.serviceId)}
                selected={selectedId === b.id}
                picked={draft.day === day && draft.time === hhmm(b.start)}
                onSelect={() => onSelect(selectedId === b.id ? null : b.id)}
              />
            ))}
        </div>
      ))}
    </>
  );
}

function Block({
  booking,
  person,
  duration,
  selected,
  picked,
  onSelect,
}: {
  booking: Booking;
  person: Staff;
  duration: number;
  selected: boolean;
  picked: boolean;
  onSelect: () => void;
}) {
  const top = ((booking.start - DAY_START) / 60) * HOUR_PX;
  const height = (duration / 60) * HOUR_PX;
  /* short services get a compact block so the label never clips */
  const compact = height < 34;
  const first = booking.customer.split(" ")[0];

  return (
    <button
      type="button"
      className="ctr-block"
      data-tone={person.tone}
      data-status={booking.status}
      data-compact={compact || undefined}
      data-selected={selected || picked || undefined}
      style={{ top, height: Math.max(height - 2, 16) }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={`${booking.customer} — ${hhmm(booking.start)} · ${duration} min`}
    >
      <span className="ctr-block__name">{first}</span>
      {!compact && <span className="ctr-block__meta tnum">{hhmm(booking.start)}</span>}
      {selected && <StatusPill status={booking.status} />}
    </button>
  );
}
