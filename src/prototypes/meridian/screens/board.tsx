"use client";

/**
 * meridian / screens / board — the task board.
 *
 * Desktop-only layout: columns side by side across the full window width,
 * each with its own count and a WIP hint, cards with meta rows. On a phone
 * this pattern would become a single stacked list with a status filter —
 * which is exactly why board and phone are separate prototypes, not one
 * responsive component.
 */

import { PRIORITY_LABEL, TASK_STATUS_LABEL, type TaskStatus } from "../data";
import { useMeridian } from "../state/meridian-context";
import { PlusIcon } from "../components/icons";

const COLUMNS: { id: TaskStatus; wip?: number }[] = [
  { id: "backlog" },
  { id: "in-progress", wip: 4 },
  { id: "review", wip: 3 },
  { id: "done" },
];

const NEXT: Partial<Record<TaskStatus, TaskStatus>> = {
  backlog: "in-progress",
  "in-progress": "review",
  review: "done",
  done: "backlog",
};

export function BoardScreen() {
  const { tasks, moveTask, density, notify } = useMeridian();

  return (
    <div className="mrd-view" data-density={density}>
      <div className="mrd-board">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.id);
          const over = col.wip !== undefined && items.length > col.wip;
          return (
            <section className="mrd-col" key={col.id} data-over={over || undefined}>
              <header className="mrd-col__head">
                <h2>
                  {TASK_STATUS_LABEL[col.id]} <span className="tnum">{items.length}</span>
                </h2>
                {col.wip !== undefined && (
                  <span className="mrd-col__wip tnum" title="Work-in-progress limit">
                    WIP {items.length}/{col.wip}
                  </span>
                )}
                <button className="mrd-iconbtn" type="button" aria-label={`Add task to ${TASK_STATUS_LABEL[col.id]}`} onClick={() => notify(`New task draft for ${TASK_STATUS_LABEL[col.id]}`)}>
                  <PlusIcon size={15} />
                </button>
              </header>

              <div className="mrd-col__cards">
                {items.map((t) => (
                  <article className="mrd-tcard" key={t.id} data-priority={t.priority}>
                    <span className="mrd-tcard__prio">{PRIORITY_LABEL[t.priority]}</span>
                    <b className="mrd-tcard__title">{t.title}</b>
                    <span className="mrd-tcard__project">{t.project}</span>
                    <footer>
                      <span className="mrd-avatar mrd-avatar--sm" aria-hidden="true">
                        {t.assignee.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <span className="mrd-tcard__due tnum">{t.due}</span>
                      <span className="mrd-points tnum">{t.points}</span>
                      <button
                        type="button"
                        className="mrd-taskmove"
                        aria-label={`Move ${t.title}`}
                        onClick={() => moveTask(t.id, NEXT[t.status] ?? "backlog")}
                      >
                        →
                      </button>
                    </footer>
                  </article>
                ))}
                {items.length === 0 && <p className="mrd-col__empty">Nothing here</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
