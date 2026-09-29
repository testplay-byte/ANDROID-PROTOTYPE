"use client";

/**
 * thin / screens / projects — the master–detail view.
 *
 * This is the pattern that makes it a desktop app: a list of projects that
 * STAYS put while the selected project's work opens beside it, so you can
 * click through projects without ever losing your place.
 *
 * The add row, the tick and the archive all write to the same task array the
 * Today and Inbox views read, so a change here is visible everywhere at once.
 *
 * Tablet: `@container surface (max-width: 900px)` turns the two columns into
 * one. The detail column then takes the whole surface and a back affordance
 * appears at the top of it — the master list is not squeezed, it is swapped.
 */

import { useState } from "react";
import { TODAY, longDate } from "../data";
import { useThin } from "../state/thin-context";
import { BulkBar, TaskRow } from "../components/task-row";
import { BackIcon, PlusIcon } from "../components/icons";

export function ProjectsScreen() {
  const {
    projects,
    tasks,
    projectId,
    selectProject,
    projectTasks,
    projectOpen,
    projectDone,
    addTask,
  } = useThin();

  /* which pane the narrow surface is showing — the desktop layout ignores it
     entirely, it only exists for the single-column reflow */
  const [pane, setPane] = useState<"list" | "detail">("list");
  const [draft, setDraft] = useState("");
  const [forToday, setForToday] = useState(true);

  const current = projects.find((p) => p.id === projectId) ?? projects[0];

  const open = (id: string) => {
    selectProject(id);
    setPane("detail");
  };

  const submit = () => {
    if (!draft.trim()) return;
    addTask({ title: draft, projectId: current.id, day: forToday ? TODAY : null });
    setDraft("");
  };

  return (
    <div className="tn-view tn-split" data-pane={pane}>
      {/* ---- master ---- */}
      <div className="tn-split__list">
        <p className="tn-eyebrow">{projects.length} projects</p>
        <ul className="tn-master">
          {projects.map((p) => {
            const openN = tasks.filter((t) => !t.archived && t.projectId === p.id && !t.done).length;
            const total = tasks.filter((t) => !t.archived && t.projectId === p.id).length;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`tn-master__item ${p.id === projectId ? "is-on" : ""}`}
                  aria-current={p.id === projectId ? "true" : undefined}
                  onClick={() => open(p.id)}
                >
                  <span className="tn-master__name">{p.name}</span>
                  <span className="tn-master__meta">
                    {p.area}
                    <span className="tn-master__n tnum">
                      {openN === 0 ? `${total} done` : `${openN} open`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="tn-split__hint">
          The list stays put while the work opens beside it. On a tablet it becomes one column,
          with a back link.
        </p>
      </div>

      {/* ---- detail ---- */}
      <div className="tn-split__detail">
        <button type="button" className="tn-back" onClick={() => setPane("list")}>
          <BackIcon size={15} /> All projects
        </button>

        <header className="tn-detail__head">
          <div>
            <p className="tn-eyebrow">{current.area}</p>
            <h2 className="tn-view__title">{current.name}</h2>
            <p className="tn-detail__note">{current.note}</p>
          </div>
          <p className="tn-detail__stat tnum">
            {projectOpen} open
            <span className="tn-detail__sep" aria-hidden="true" />
            {projectDone} done
          </p>
        </header>

        <div className="tn-add">
          <input
            className="tn-input"
            value={draft}
            placeholder={`Add a task to ${current.name}`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            aria-label={`New task for ${current.name}`}
          />
          <label className="tn-check-inline">
            <input
              type="checkbox"
              checked={forToday}
              onChange={(e) => setForToday(e.target.checked)}
            />
            for today
          </label>
          <button
            type="button"
            className="tn-btn"
            onClick={submit}
            disabled={!draft.trim()}
            aria-label="Add the task"
          >
            <PlusIcon size={14} /> Add
          </button>
        </div>

        <BulkBar />

        <ul className="tn-rows">
          {projectTasks.map((t) => (
            <TaskRow
              key={t.id}
              id={t.id}
              title={t.title}
              projectId={t.projectId}
              day={t.day}
              done={t.done}
              est={t.est}
              showProject={false}
            />
          ))}
          {projectTasks.length === 0 && (
            <li className="tn-empty">
              Nothing here yet. Add the first task with the field above, or press ⌘K and search
              for it.
            </li>
          )}
        </ul>

        <footer className="tn-foot">
          <span>Tick a box to select several, then archive them in one go.</span>
          <span className="tn-foot__date">{longDate(TODAY)}</span>
        </footer>
      </div>
    </div>
  );
}
