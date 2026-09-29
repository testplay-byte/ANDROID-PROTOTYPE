"use client";

/**
 * thin / components / task-row — the only list row in the app.
 *
 * One row, used by Today, Projects and Inbox. Minimalism is mostly the
 * discipline to stop adding components: a row is a checkbox, a title, a
 * project name in grey and an estimate in grey. There is no icon per state,
 * no badge, no menu, and the completed state is a strike-through and a
 * quieter colour — nothing else changes.
 */

import type { ReactNode } from "react";
import { estLabel, projectById, shortDate, TODAY } from "../data";
import { useThin } from "../state/thin-context";
import { ArchiveIcon } from "./icons";

export interface TaskRowProps {
  id: string;
  title: string;
  projectId: string | null;
  day: string | null;
  done: boolean;
  est: number;
  /** a slot for the row's own extra controls (Inbox triage) */
  trailing?: ReactNode;
  /** hide the project name when the list is already inside one project */
  showProject?: boolean;
}

export function TaskRow({ id, title, projectId, day, done, est, trailing, showProject = true }: TaskRowProps) {
  const { checked, toggleChecked, toggleDone } = useThin();
  const project = projectById(projectId);
  const isChecked = checked.includes(id);
  const late = !done && day !== null && day < TODAY;

  return (
    <li className="tn-row" data-checked={isChecked || undefined} data-done={done || undefined}>
      <input
        type="checkbox"
        className="tn-row__check"
        checked={isChecked}
        aria-label={`Select ${title}`}
        onChange={() => toggleChecked(id)}
      />
      <button type="button" className="tn-row__main" onClick={() => toggleDone([id])}>
        <span className="tn-row__title">{title}</span>
        <span className="tn-row__meta">
          {showProject && project && <span className="tn-row__proj">{project.name}</span>}
          {!showProject && !project && <span className="tn-row__proj">Unfiled</span>}
          {late && day && <span className="tn-row__late">from {shortDate(day)}</span>}
          <span className="tn-row__est tnum">{estLabel(est)}</span>
        </span>
      </button>
      {trailing && <span className="tn-row__trailing">{trailing}</span>}
    </li>
  );
}

/**
 * BulkBar — the desktop multi-select affordance.
 *
 * It appears only when something is ticked and it reads as one line of text
 * with a hairline rule, not a floating toolbar. Two actions: tick (which
 * reopens if everything ticked is already done) and archive.
 */
export function BulkBar({ noun = "task" }: { noun?: string }) {
  const { checked, clearChecked, toggleDone, archive, checkedHas } = useThin();
  if (checked.length === 0) return null;
  const allDone = checkedHas("done");

  return (
    <div className="tn-bulk" role="status">
      <span className="tn-bulk__n tnum">{checked.length}</span>
      <span className="tn-bulk__word">
        {checked.length === 1 ? noun : `${noun}s`} selected
      </span>
      <span className="tn-bulk__rule" aria-hidden="true" />
      <button type="button" onClick={() => toggleDone(checked)} disabled={allDone}>
        {allDone ? "Reopen" : "Tick"}
      </button>
      <button type="button" onClick={() => archive(checked)}>
        <ArchiveIcon size={14} /> Archive
      </button>
      <button type="button" className="tn-bulk__clear" onClick={clearChecked}>
        Clear
      </button>
    </div>
  );
}
