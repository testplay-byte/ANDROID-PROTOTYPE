"use client";

/**
 * counter / screens / calendar — the schedule and the booking form.
 *
 * Two desktop halves side by side:
 *   · the week grid (or, at tablet width, the day list)
 *   · the booking form, which writes real bookings into the same list
 *
 * The form is the demo's proof of behaviour: pick a slot that is already
 * taken and the conflict names the booking that owns it; pick a free slot and
 * the booking appears in the grid immediately. Duration and price come from
 * #services, so editing a service there changes what the form quotes here.
 */

import { useEffect, useRef } from "react";
import {
  DAY_LONG,
  STAFF,
  TODAY,
  WEEK_MON_FIRST,
  durationLabel,
  hhmm,
  money,
  shortDate,
  weekdayIndex,
} from "../data";
import { useCounter, VIEWS } from "../state/counter-context";
import { BookingDetail } from "../components/booking-detail";
import { DayList } from "../components/day-list";
import { ScheduleGrid } from "../components/schedule-grid";
import { PlusIcon, WarnIcon } from "../components/icons";

export function CalendarScreen() {
  const {
    bookings,
    services,
    selectedId,
    draft,
    setDraft,
    conflict,
    submitDraft,
    draftFocus,
    prefs,
    go,
  } = useCounter();

  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (draftFocus > 0) window.setTimeout(() => nameRef.current?.focus(), 60);
  }, [draftFocus]);

  /* the week-start preference reorders the same seven days */
  const days = prefs.weekStart === "sun" ? [...WEEK_MON_FIRST.slice(1), WEEK_MON_FIRST[0]] : WEEK_MON_FIRST;

  const active = services.filter((s) => s.active);
  const chosen = services.find((s) => s.id === draft.serviceId) ?? active[0];
  const [hh, mm] = draft.time.split(":").map((n) => parseInt(n, 10));
  const end = (hh || 0) * 60 + (mm || 0) + (chosen?.duration ?? 30);
  const weekBookings = bookings.filter((b) => days.includes(b.day) && b.status !== "cancelled");
  const todayCount = bookings.filter((b) => b.day === TODAY && b.status !== "cancelled").length;

  return (
    <div className="ctr-view ctr-split">
      <div className="ctr-split__main">
        <div className="ctr-statrow">
          <StatBlock tone="a" label="This week" value={weekBookings.length} note="bookings in 7 days" />
          <StatBlock tone="b" label="Today" value={todayCount} note={`${shortDate(TODAY)} · ${DAY_LONG[weekdayIndex(TODAY)]}`} />
          <StatBlock
            tone="c"
            label="Pending"
            value={bookings.filter((b) => b.status === "pending").length}
            note="awaiting confirmation"
          />
          <StatBlock
            tone="d"
            label="Taken"
            value={`${Math.round(
              (bookings.filter((b) => b.status !== "cancelled").length /
                Math.max(1, days.length * STAFF.length * 10)) * 100
            )}%`}
            note="of bookable capacity"
          />
        </div>

        <div className="ctr-weekwrap">
          <div className="ctr-weekview">
            <ScheduleGrid days={days} />
          </div>
          <div className="ctr-dayview">
            <DayList days={days} />
          </div>
        </div>
      </div>

      <div className="ctr-split__side">
        <form
          className="ctr-panel"
          onSubmit={(e) => {
            e.preventDefault();
            submitDraft();
          }}
        >
          <header className="ctr-panel__head">
            <h2>New booking</h2>
            <span className="ctr-panel__meta tnum">
              {draft.time}–{hhmm(end)}
            </span>
          </header>

          <label className="ctr-input">
            <span>Customer</span>
            <input
              ref={nameRef}
              type="text"
              value={draft.customer}
              placeholder="Name"
              onChange={(e) => setDraft({ customer: e.target.value })}
            />
          </label>

          <div className="ctr-input-row">
            <label className="ctr-input">
              <span>Service</span>
              <select
                value={draft.serviceId}
                onChange={(e) => setDraft({ serviceId: e.target.value })}
              >
                {active.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {durationLabel(s.duration)}
                  </option>
                ))}
              </select>
            </label>
            <label className="ctr-input">
              <span>With</span>
              <select value={draft.staffId} onChange={(e) => setDraft({ staffId: e.target.value })}>
                {STAFF.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ctr-input-row">
            <label className="ctr-input">
              <span>Day</span>
              <select value={draft.day} onChange={(e) => setDraft({ day: e.target.value })}>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {DAY_LONG[weekdayIndex(d)]} {shortDate(d)}
                  </option>
                ))}
              </select>
            </label>
            <label className="ctr-input">
              <span>Time</span>
              <input
                type="time"
                value={draft.time}
                step={900}
                onChange={(e) => setDraft({ time: e.target.value || "09:00" })}
              />
            </label>
          </div>

          <div className="ctr-quote">
            <span>{chosen?.name ?? "—"}</span>
            <b className="tnum">
              {durationLabel(chosen?.duration ?? 0)} · {money(chosen?.price ?? 0)}
            </b>
          </div>

          {conflict && (
            <p className="ctr-conflict" data-empty={!conflict.id || undefined} role="alert">
              <WarnIcon size={15} />
              <span>
                <b>{conflict.label}</b>
                {conflict.who}
              </span>
            </p>
          )}

          <button className="ctr-btn ctr-btn--solid ctr-btn--wide" type="submit">
            <PlusIcon size={15} /> Add booking
          </button>

          <p className="ctr-panel__hint">
            Click an empty slot on the grid to fill the time in, or click a block to inspect it.
          </p>

          <hr className="ctr-rule" />

          <div className="ctr-panel__links">
            {VIEWS.filter((v) => v.id !== "calendar").map((v) => (
              <button key={v.id} type="button" className="ctr-linkbtn" onClick={() => go(v.id)}>
                {v.label}
                <span>{v.hint}</span>
              </button>
            ))}
          </div>
        </form>

        {selectedId && <BookingDetail />}
      </div>
    </div>
  );
}

function StatBlock({
  tone,
  label,
  value,
  note,
}: {
  tone: string;
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="ctr-stat" data-tone={tone}>
      <span className="ctr-stat__label">{label}</span>
      <b className="ctr-stat__value tnum">{value}</b>
      <span className="ctr-stat__note">{note}</span>
    </div>
  );
}
