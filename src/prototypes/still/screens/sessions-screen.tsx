"use client";

/* still / screens / sessions — the library.
   A soft segmented length filter (the active segment sits in a carved
   well), then sessions grouped by program: each row has an extruded
   play disc (pressing it sinks the disc and completes the session —
   a checkmark pops in), title, meta line and duration. Completion is
   persisted through StillProvider; finishing credits quiet-minutes. */

import { useState } from "react";
import type { CSSProperties } from "react";
import { useStill } from "../state/still-context";
import {
  LENGTH_FILTERS,
  PROGRAMS,
  matchesLength,
  sessionsOfProgram,
} from "../lib/data";
import type { LengthFilter, Session } from "../lib/data";
import { CheckIcon, PlayIcon } from "../components/icons";

export function SessionsScreen() {
  const { isCompleted, toggleComplete, addQuietMinutes, showToast } = useStill();
  const [filter, setFilter] = useState<LengthFilter>("all");

  function play(session: Session) {
    const done = isCompleted(session.id);
    toggleComplete(session.id);
    if (!done) {
      addQuietMinutes(session.durationMin);
      showToast(`${session.title} completed`, "check");
    }
  }

  let cardIndex = 0;

  return (
    <section className="st-screen" aria-label="Sessions">
      <div className="st-content">
        <header className="st-head st-head--small" style={({ ["--stagger" as string]: "0ms" } as CSSProperties)}>
          <span className="st-head__label">Sessions</span>
        </header>

        {/* segmented length filter — the row lives in a carved trough */}
        <div
          className="st-seg"
          style={({ ["--stagger" as string]: "70ms" } as CSSProperties)}
          role="group"
          aria-label="Filter by length"
        >
          {LENGTH_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`st-seg__item${f.id === filter ? " st-seg__item--on" : ""}`}
              aria-pressed={f.id === filter}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {PROGRAMS.map((prog) => {
          const rows = sessionsOfProgram(prog.id).filter((s) => matchesLength(s, filter));
          if (rows.length === 0) return null;
          return (
            <div
              key={prog.id}
              className="st-prog"
              style={{ ["--stagger" as string]: `${130 + cardIndex * 40}ms` } as CSSProperties}
            >
              <h2 className="st-prog__head">
                <span>{prog.name}</span>
                <em>{prog.line}</em>
              </h2>
              <ul className="st-rows">
                {rows.map((s) => {
                  const stagger = 170 + cardIndex * 45;
                  cardIndex += 1;
                  const done = isCompleted(s.id);
                  return (
                    <li
                      key={s.id}
                      className="st-row"
                      style={{ ["--stagger" as string]: `${stagger}ms` } as CSSProperties}
                    >
                      <span className="st-row__text">
                        <b>{s.title}</b>
                        <span>
                          {s.mood} · {s.durationMin} min
                        </span>
                      </span>
                      {done ? (
                        <span className="st-row__check" aria-label="Completed">
                          <CheckIcon size={15} />
                        </span>
                      ) : null}
                      <button
                        type="button"
                        className={`st-disc${done ? " st-disc--done" : ""}`}
                        onClick={() => play(s)}
                        aria-label={done ? `Mark ${s.title} unfinished` : `Complete ${s.title}`}
                      >
                        {done ? <CheckIcon size={16} /> : <PlayIcon size={16} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {cardIndex === 0 ? (
          <p className="st-empty">Nothing at this length. Widen the filter.</p>
        ) : null}
      </div>
    </section>
  );
}
