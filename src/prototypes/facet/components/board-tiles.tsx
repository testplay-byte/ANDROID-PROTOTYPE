"use client";

/**
 * facet / components / board-tiles — the nine jobs on the bento board.
 *
 * Each component is ONE tile: it reads the live span from the context, wires
 * the span cycle control, and renders its content centred. Nothing here
 * scrolls — a tile that outgrows itself is a tile with the wrong content.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { Tile, TileCenter } from "./tile";
import { useFacet } from "../state/facet-context";
import {
  CLOCK,
  DAY_SHORT,
  FOCUS,
  HABIT_STREAK,
  MONTH_SHORT,
  SIGNAL,
  TODAY,
  TODAY_MONTH,
  TODAY_YEAR,
  TILE_BY_ID,
  WEATHER,
  daysInMonth,
  hhmm,
  iso,
  longDate,
  shortDate,
  monthAt,
  weekdayOf,
} from "../data";
import {
  CalendarIcon,
  CloudIcon,
  InboxIcon,
  NoteIcon,
  PartIcon,
  PlusIcon,
  RainIcon,
  RightIcon,
  SunIcon,
} from "./icons";

/** Shared shell: every tile knows its definition, its live span and the
 *  span cycle control. The small dot in the head marks the tile that the
 *  `[` `]` keyboard shortcuts act on. */
function BoardTile({
  def,
  action,
  children,
  className = "",
}: {
  def: (typeof TILE_BY_ID)[string];
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { spans, cycleSpan, activeTile, setActiveTile } = useFacet();
  return (
    <Tile
      id={def.id}
      job={def.job}
      span={spans[def.id] ?? def.span}
      tone={def.tone}
      active={activeTile === def.id}
      onCycleSpan={() => cycleSpan(def.id)}
      action={
        action ?? (
          <button
            type="button"
            className="fc-tile__tool"
            onClick={() => setActiveTile(activeTile === def.id ? null : def.id)}
            title="Select this tile for the [ ] size shortcuts"
            aria-label={`Select the ${def.job} tile`}
          >
            <span className="fc-dotpick" aria-hidden="true" />
          </button>
        )
      }
      className={className}
    >
      {children}
    </Tile>
  );
}

function WeatherGlyph({ kind, size = 22 }: { kind: string; size?: number }) {
  if (kind === "rain") return <RainIcon size={size} />;
  if (kind === "cloud") return <CloudIcon size={size} />;
  if (kind === "part") return <PartIcon size={size} />;
  return <SunIcon size={size} />;
}

/* ---------- clock: the one thing you check two hundred times a day ------ */
export function ClockTile() {
  return (
    <BoardTile def={TILE_BY_ID.clock}>
      <div className="fc-clock">
        <div className="fc-clock__now">
          <span className="fc-clock__time tnum">{CLOCK.time}</span>
          <span className="fc-clock__sec tnum">:{String(CLOCK.seconds).padStart(2, "0")}</span>
        </div>
        <div className="fc-clock__side">
          <span className="fc-clock__greet">{CLOCK.greeting}</span>
          <span className="fc-clock__date">
            {shortDate(TODAY)} · {CLOCK.timezone}
          </span>
          <span className="fc-clock__day">
            <span className="fc-clock__daybar" style={{ width: `${CLOCK.elapsedPct}%` }} />
          </span>
          <span className="fc-clock__count tnum">
            {CLOCK.doneToday} of {CLOCK.totalToday} done today
          </span>
        </div>
      </div>
    </BoardTile>
  );
}

/* ---------- weather: pinned, never fetched ------------------------------ */
export function WeatherTile() {
  return (
    <BoardTile def={TILE_BY_ID.weather}>
      <div className="fc-wx">
        <div className="fc-wx__row">
          <span className="fc-wx__glyph">
            <WeatherGlyph kind={WEATHER.kind} size={26} />
          </span>
          <span className="fc-wx__temp tnum">{WEATHER.temp}°</span>
          <span className="fc-wx__meta">
            <span className="fc-wx__place">{WEATHER.place}</span>
            <span className="fc-wx__sum">{WEATHER.summary}</span>
            <span className="fc-wx__hl tnum">
              H {WEATHER.high}° · L {WEATHER.low}°
            </span>
          </span>
        </div>
        <div className="fc-wx__hours">
          {WEATHER.hours.map((h) => (
            <span className="fc-wx__hour" key={h.time}>
              <span className="fc-wx__hlabel tnum">{h.time}</span>
              <span className="fc-wx__hourglyph">
                <WeatherGlyph kind={h.kind} size={13} />
              </span>
              <span className="tnum">{h.temp}°</span>
            </span>
          ))}
        </div>
      </div>
    </BoardTile>
  );
}

/* ---------- agenda: the selected day, shared with the calendar ---------- */
export function AgendaTile() {
  const { selectedDay, eventsFor, go } = useFacet();
  const events = eventsFor(selectedDay);
  return (
    <BoardTile
      def={TILE_BY_ID.agenda}
      action={
        <button
          type="button"
          className="fc-tile__tool fc-tile__tool--label"
          onClick={() => go("calendar")}
          title="Open the calendar"
        >
          Open <RightIcon size={13} />
        </button>
      }
    >
      <div className="fc-agenda">
        <div className="fc-agenda__head">
          <span className="fc-agenda__day">{longDate(selectedDay)}</span>
          <span className="fc-agenda__count tnum">
            {events.length} {events.length === 1 ? "item" : "items"}
          </span>
        </div>
        <ul className="fc-agenda__list">
          {events.map((e) => (
            <li className="fc-agenda__row" key={e.id} data-tone={e.tone}>
              <span className="fc-agenda__time tnum">{hhmm(e.start)}</span>
              <span className="fc-agenda__text">
                <b>{e.title}</b>
                <span>{e.where}</span>
              </span>
            </li>
          ))}
          {events.length === 0 && (
            <li className="fc-agenda__empty">
              Nothing booked — the capture tile is the fastest way to fix that.
            </li>
          )}
        </ul>
      </div>
    </BoardTile>
  );
}

/* ---------- capture: really appends to the inbox ------------------------ */
export function CaptureTile() {
  const { captureDraft, setCaptureDraft, addCapture, captures, captureFocus, activeTile } =
    useFacet();
  const inputRef = useRef<HTMLInputElement>(null);
  const open = captures.filter((c) => !c.done).length;

  useEffect(() => {
    if (captureFocus > 0) inputRef.current?.focus();
  }, [captureFocus]);

  return (
    <BoardTile
      def={TILE_BY_ID.capture}
      className="fc-capture"
      action={
        <span className="fc-capture__count tnum">
          <InboxIcon size={13} /> {open}
        </span>
      }
    >
      <div className="fc-cap">
        <span className="fc-cap__hint">
          {activeTile === "capture" ? "Selected — [ ] resizes it" : "Type, then Enter"}
        </span>
        <div className="fc-cap__row">
          <input
            ref={inputRef}
            className="fc-cap__input"
            value={captureDraft}
            placeholder="What's on your mind?"
            aria-label="Quick capture"
            onChange={(e) => setCaptureDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCapture();
              }
            }}
          />
          <button
            type="button"
            className="fc-cap__add"
            onClick={addCapture}
            aria-label="Add to the capture inbox"
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>
    </BoardTile>
  );
}

/* ---------- habits: the ring, live -------------------------------------- */
export function HabitsTile() {
  const { habits, habitsDone, toggleHabit } = useFacet();
  const total = habits.length;
  const pct = total === 0 ? 0 : habitsDone / total;
  const R = 21.5;
  const C = 2 * Math.PI * R;

  return (
    <BoardTile def={TILE_BY_ID.habits}>
      <div className="fc-habits">
        <span className="fc-ring" role="img" aria-label={`${habitsDone} of ${total} habits done`}>
          <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
            <circle className="fc-ring__track" cx="30" cy="30" r={R} />
            <circle
              className="fc-ring__value"
              cx="30"
              cy="30"
              r={R}
              strokeDasharray={`${(C * pct).toFixed(2)} ${C.toFixed(2)}`}
            />
          </svg>
          <span className="fc-ring__num tnum">
            {habitsDone}
            <i>/{total}</i>
          </span>
        </span>
        <ul className="fc-habits__list">
          {habits.slice(0, 3).map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className="fc-habits__item"
                data-done={h.done || undefined}
                onClick={() => toggleHabit(h.id)}
                aria-pressed={h.done}
              >
                {h.name}
              </button>
            </li>
          ))}
        </ul>
        <span className="fc-habits__streak tnum">{HABIT_STREAK}-day streak</span>
      </div>
    </BoardTile>
  );
}

/* ---------- focus: one number, well set --------------------------------- */
export function FocusTile() {
  const pct = Math.round((FOCUS.hours / FOCUS.goal) * 100);
  return (
    <BoardTile def={TILE_BY_ID.focus}>
      <TileCenter>
        <span className="fc-focus__num tnum">{FOCUS.hours}h</span>
        <span className="fc-focus__label">deep work this week</span>
        <span className="fc-meter">
          <span className="fc-meter__fill" style={{ width: `${Math.min(100, pct)}%` }} />
        </span>
        <span className="fc-focus__delta">{FOCUS.delta}</span>
      </TileCenter>
    </BoardTile>
  );
}

/* ---------- notes: the newest note, one line of it --------------------- */
export function NotesTile() {
  const { notes, go, selectNote } = useFacet();
  const latest = notes[0];
  return (
    <BoardTile
      def={TILE_BY_ID.notes}
      action={
        <button
          type="button"
          className="fc-tile__tool"
          onClick={() => {
            selectNote(latest.id);
            go("notes");
          }}
          title="Open the note"
          aria-label="Open the note"
        >
          <NoteIcon size={14} />
        </button>
      }
    >
      <div className="fc-note">
        <span className="fc-note__tag">{latest.tag}</span>
        <span className="fc-note__title">{latest.title}</span>
        <span className="fc-note__body">{latest.body.split("\n")[0]}</span>
        <span className="fc-note__count tnum">
          {notes.length} notes in the drawer
        </span>
      </div>
    </BoardTile>
  );
}

/* ---------- month: the same grid as #calendar, in miniature ------------- */
export function MonthTile() {
  const { selectedDay, selectDay, go, monthOffset } = useFacet();
  const view = monthAt(TODAY_YEAR, TODAY_MONTH, monthOffset);
  const first = weekdayOf(view.year, view.month, 1);
  const total = daysInMonth(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  return (
    <BoardTile
      def={TILE_BY_ID.month}
      action={
        <button
          type="button"
          className="fc-tile__tool"
          onClick={() => go("calendar")}
          title="Open the calendar"
          aria-label="Open the calendar"
        >
          <CalendarIcon size={14} />
        </button>
      }
    >
      <div className="fc-mini">
        <div className="fc-mini__head">
          <span className="fc-mini__month">
            {MONTH_SHORT[view.month - 1]} {view.year}
          </span>
          <span className="fc-mini__dows">
            {DAY_SHORT.map((d) => (
              <span key={d}>{d[0]}</span>
            ))}
          </span>
        </div>
        <div className="fc-mini__grid">
          {cells.map((d, i) =>
            d === null ? (
              <span className="fc-mini__cell is-blank" key={`b${i}`} />
            ) : (
              <button
                type="button"
                key={d}
                className="fc-mini__cell tnum"
                data-today={iso(view.year, view.month, d) === TODAY || undefined}
                data-selected={iso(view.year, view.month, d) === selectedDay || undefined}
                onClick={() => {
                  selectDay(iso(view.year, view.month, d));
                  go("calendar");
                }}
              >
                {d}
              </button>
            )
          )}
        </div>
      </div>
    </BoardTile>
  );
}

/* ---------- signal: the week's numbers in a row ------------------------ */
export function SignalTile() {
  const max = Math.max(...FOCUS.week);
  return (
    <BoardTile def={TILE_BY_ID.signal}>
      <div className="fc-signal">
        <div className="fc-signal__stats">
          {SIGNAL.map((s) => (
            <div className="fc-signal__stat" key={s.id}>
              <span className="fc-signal__label">{s.label}</span>
              <span className="fc-signal__value tnum">{s.value}</span>
              <span className="fc-signal__unit tnum">{s.unit}</span>
              <span className="fc-meter">
                <span className="fc-meter__fill" style={{ width: `${s.pct}%` }} />
              </span>
            </div>
          ))}
        </div>
        <div className="fc-signal__week" aria-hidden="true">
          {FOCUS.week.map((h, i) => (
            <span className="fc-signal__bar" key={i}>
              <span style={{ height: `${Math.round((h / max) * 100)}%` }} />
            </span>
          ))}
        </div>
      </div>
    </BoardTile>
  );
}
