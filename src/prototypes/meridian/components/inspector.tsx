"use client";

/**
 * meridian / components / inspector — the right-hand detail panel.
 *
 * A desktop pattern with no phone equivalent: a persistent side panel that
 * opens BESIDE the data (never over it), so the table stays visible and the
 * user keeps their context. Closing it (×, or Esc) returns the full width.
 */

import { STATUS_LABEL, money, personByName, projectById } from "../data";
import { useMeridian } from "../state/meridian-context";
import { CheckIcon } from "./icons";

export function Inspector() {
  const { selectedProject, selectProject, tasks, moveTask, notify } = useMeridian();
  const project = projectById(selectedProject ?? "");
  if (!project) return null;

  const owner = personByName(project.owner);
  const projectTasks = tasks.filter((t) => t.project === project.name);
  const budgetPct = Math.round((project.spent / project.budget) * 100);

  return (
    <aside className="mrd-inspector" aria-label={`${project.name} details`}>
      <header className="mrd-inspector__head">
        <div>
          <h2>{project.name}</h2>
          <p>{project.client}</p>
        </div>
        <button className="mrd-iconbtn" type="button" onClick={() => selectProject(null)} aria-label="Close inspector">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      <div className="mrd-inspector__body">
        <span className="mrd-status mrd-status--lg" data-status={project.status}>
          <i aria-hidden="true" />
          {STATUS_LABEL[project.status]}
        </span>

        <dl className="mrd-facts">
          <div>
            <dt>Owner</dt>
            <dd>
              {owner && (
                <span className="mrd-avatar mrd-avatar--sm" aria-hidden="true">
                  {owner.initials}
                </span>
              )}
              {project.owner}
              {owner && <span className="mrd-facts__load tnum">{owner.load}% load</span>}
            </dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd className="tnum">{project.due}</dd>
          </div>
          <div>
            <dt>Tasks</dt>
            <dd className="tnum">
              {project.tasksDone} / {project.tasksTotal} done
            </dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd className="tnum">
              {money(project.spent)} of {money(project.budget)} ({budgetPct}%)
            </dd>
          </div>
        </dl>

        <div className="mrd-meter" aria-hidden="true">
          <span className="mrd-meter__fill" style={{ width: `${project.progress}%` }} data-status={project.status} />
        </div>

        <h3 className="mrd-inspector__section">Open tasks</h3>
        <ul className="mrd-inspector__tasks">
          {projectTasks.map((t) => (
            <li key={t.id} data-priority={t.priority}>
              <button
                type="button"
                className="mrd-taskmove"
                onClick={() => moveTask(t.id, t.status === "done" ? "in-progress" : "done")}
                title={t.status === "done" ? "Reopen" : "Mark done"}
              >
                <CheckIcon size={13} />
              </button>
              <div>
                <b>{t.title}</b>
                <span>
                  {t.assignee} · due {t.due}
                </span>
              </div>
              <span className="mrd-points tnum">{t.points}</span>
            </li>
          ))}
          {projectTasks.length === 0 && <li className="mrd-inspector__empty">No open tasks on this project.</li>}
        </ul>

        <button className="mrd-btn mrd-btn--filled" type="button" onClick={() => notify(`Opened the full report for ${project.name}`)}>
          Open full report
        </button>
      </div>
    </aside>
  );
}
