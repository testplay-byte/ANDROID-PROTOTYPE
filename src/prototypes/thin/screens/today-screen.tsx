"use client";

/**
 * thin / screens / today — one quiet list, and the day's note.
 *
 * The whole point of the Today view is that it is ONE column of words. There
 * is no card per task, no coloured left rail, no progress ring, no date
 * picker. A task is a line of text you can click to tick; the metadata beside
 * it is small and grey and never competes with the title.
 *
 * Two things sit beside the list: a project filter (text, not chips) and the
 * plain-text daily note, which saves on every keystroke. Overdue work from
 * earlier days is folded into the same list — a second "overdue" screen would
 * be a worse way to answer "what is left".
 */

import { TODAY, longDate, onTodayList, shortDate } from "../data";
import { useThin } from "../state/thin-context";
import { BulkBar, TaskRow } from "../components/task-row";
import { NoteIcon } from "../components/icons";

export function TodayScreen() {
  const {
    projects,
    tasks,
    todayTasks,
    todayTotal,
    filter,
    setFilter,
    note,
    setNote,
    noteSaved,
    prefs,
    setPrefs,
  } = useThin();

  /* The header describes the DAY, not the filter: "N left" always means the
     whole of today plus anything still open from earlier, so filtering the
     list below never changes what the title claims. */
  const openCount = tasks.filter((t) => onTodayList(t) && !t.done).length;
  const doneToday = tasks.filter((t) => !t.archived && t.day === TODAY && t.done).length;

  /* filter counts are computed from the same live array the list reads, so a
     tick immediately moves the numbers under the filter */
  const buckets = [
    { id: "all", label: "Everything", n: tasks.filter(onTodayList).length },
    ...projects.map((p) => ({
      id: p.id,
      label: p.name,
      n: tasks.filter((t) => onTodayList(t) && t.projectId === p.id).length,
    })),
    {
      id: "inbox",
      label: "Unfiled",
      n: tasks.filter((t) => onTodayList(t) && t.projectId === null).length,
    },
  ].filter((b) => b.n > 0 || b.id === filter || b.id === "all");

  return (
    <div className="tn-view tn-today">
      <div className="tn-today__head">
        <div>
          <p className="tn-eyebrow">{longDate(TODAY)}</p>
          <h2 className="tn-view__title">
            {openCount === 0 ? "Nothing left for today" : `${openCount} left today`}
          </h2>
        </div>
        <p className="tn-today__stat tnum">
          {doneToday} of {todayTotal} done
        </p>
      </div>

      <div className="tn-today__body">
        <div className="tn-today__list">
          <nav className="tn-filter" aria-label="Filter the day by project">
            {buckets.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`tn-filter__btn ${filter === b.id ? "is-on" : ""}`}
                aria-pressed={filter === b.id}
                onClick={() => setFilter(b.id)}
              >
                {b.label}
                <span className="tn-filter__n tnum">{b.n}</span>
              </button>
            ))}
          </nav>

          <BulkBar />

          <ul className="tn-rows">
            {todayTasks
              .filter((t) => prefs.showDone || !t.done)
              .map((t) => (
                <TaskRow
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  projectId={t.projectId}
                  day={t.day}
                  done={t.done}
                  est={t.est}
                />
              ))}
            {todayTasks.filter((t) => prefs.showDone || !t.done).length === 0 && (
              <li className="tn-empty">
                Nothing here. Everything with this filter is finished —{" "}
                <button type="button" className="tn-link" onClick={() => setPrefs({ showDone: true })}>
                  show what is done
                </button>
                .
              </li>
            )}
          </ul>

          <footer className="tn-foot">
            <span>Click a title to tick it. Tick the box on the left to select several.</span>
            <label className="tn-check-inline">
              <input
                type="checkbox"
                checked={prefs.showDone}
                onChange={(e) => setPrefs({ showDone: e.target.checked })}
              />
              Show what is done
            </label>
          </footer>
        </div>

        <aside className="tn-note" aria-label="Daily note">
          <header className="tn-note__head">
            <span className="tn-note__label">
              <NoteIcon size={14} /> Note for {shortDate(TODAY)}
            </span>
            {noteSaved && <span className="tn-note__saved">Saved</span>}
          </header>
          <textarea
            className="tn-note__area"
            value={note}
            spellCheck
            placeholder="Plain text. It saves as you type — there is nothing to press."
            onChange={(e) => setNote(e.target.value)}
            aria-label="Daily note"
          />
          <p className="tn-note__foot tnum">
            {note.trim() === "" ? "Empty" : `${note.trim().split(/\s+/).length} words`} · stored
            locally as thin-notes-v1
          </p>
        </aside>
      </div>
    </div>
  );
}
