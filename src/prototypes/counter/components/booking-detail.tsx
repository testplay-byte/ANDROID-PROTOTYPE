"use client";

/**
 * counter / components / booking-detail — the right-hand detail panel.
 *
 * A desktop pattern with no phone equivalent: a persistent side panel that
 * opens BESIDE the data (never over it), so the table or the schedule stays
 * visible and the user keeps their context. At tablet width the container
 * query drops it into a full-width block BELOW the table instead — a real
 * layout change, not a squeezed sidebar.
 *
 * The status buttons ARE the transitions: each one writes straight back to
 * the bookings list, so both the schedule blocks and the table re-render.
 */

import {
  DAY_LONG,
  STATUS_FLOW,
  STATUS_LABEL,
  durationLabel,
  hhmm,
  money,
  serviceById,
  staffById,
  weekdayIndex,
  type BookingStatus,
} from "../data";
import { useCounter } from "../state/counter-context";
import { CloseIcon } from "./icons";

export function BookingDetail() {
  const { bookings, selectedId, select, setStatus, services, notify } = useCounter();
  const booking = bookings.find((b) => b.id === selectedId);
  if (!booking) return null;

  const service = services.find((s) => s.id === booking.serviceId) ?? serviceById(booking.serviceId);
  const staff = staffById(booking.staffId);
  const end = booking.start + (service?.duration ?? 30);

  return (
    <aside className="ctr-detail" aria-label={`${booking.customer} details`}>
      <header className="ctr-detail__head">
        <div>
          <h2>{booking.customer}</h2>
          <p>
            {DAY_LONG[weekdayIndex(booking.day)]} · {hhmm(booking.start)}–{hhmm(end)}
          </p>
        </div>
        <button
          className="ctr-iconbtn"
          type="button"
          onClick={() => select(null)}
          aria-label="Close detail panel"
          title="Close (Esc)"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="ctr-detail__body">
        <span className="ctr-tag" data-status={booking.status}>
          {STATUS_LABEL[booking.status]}
        </span>

        <dl className="ctr-facts">
          <div>
            <dt>Service</dt>
            <dd>{service?.name ?? "—"}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd className="tnum">{durationLabel(service?.duration ?? 30)}</dd>
          </div>
          <div>
            <dt>With</dt>
            <dd>
              {staff && (
                <span className="ctr-avatar" data-tone={staff.tone} aria-hidden="true">
                  {staff.initials}
                </span>
              )}
              {staff?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd className="tnum">{money(service?.price ?? 0)}</dd>
          </div>
        </dl>

        <p className="ctr-detail__note">
          {booking.note ? booking.note : "No note on this booking."}
        </p>

        <h3 className="ctr-detail__label">Move to</h3>
        <div className="ctr-detail__actions">
          {STATUS_FLOW.filter((s) => s !== booking.status).map((s) => (
            <button
              key={s}
              type="button"
              className="ctr-btn ctr-btn--sm"
              onClick={() => setStatus([booking.id], s)}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <button
          className="ctr-btn ctr-btn--ghost"
          type="button"
          onClick={() => notify(`Receipt queued for ${booking.customer}`)}
        >
          Send receipt
        </button>
      </div>
    </aside>
  );
}

/** The shared "status" pill, reused by the table and the day list. */
export function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span className="ctr-tag" data-status={status}>
      {STATUS_LABEL[status]}
    </span>
  );
}
