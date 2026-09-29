"use client";

/**
 * thin / screens / inbox — capture first, decide later.
 *
 * The field at the top really prepends: pressing Enter inserts the task at
 * the top of the list below and clears the field, so you can brain-dump
 * without thinking about where things go. Everything under it is triage —
 * schedule it, file it under a project, or archive it — and every one of
 * those actions removes it from the inbox for real.
 */

import { useEffect, useRef, useState } from "react";
import { TODAY } from "../data";
import { useThin } from "../state/thin-context";
import { TaskRow } from "../components/task-row";
import { ArchiveIcon, PlusIcon } from "../components/icons";

export function InboxScreen() {
  const { inbox, projects, addTask, triage, captureTick, setPaletteOpen } = useThin();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* the shell's "N" shortcut and ⌘K both bump captureTick to focus this */
  useEffect(() => {
    if (captureTick > 0) window.setTimeout(() => inputRef.current?.focus(), 30);
  }, [captureTick]);

  const capture = () => {
    const title = text.trim();
    if (!title) return;
    /* no project, no day → it lands at the top of the inbox, which is the
       honest place for something you have not decided about yet */
    addTask({ title, projectId: "", day: null });
    setText("");
  };

  return (
    <div className="tn-view tn-inbox">
      <div className="tn-inbox__head">
        <div>
          <p className="tn-eyebrow">Capture</p>
          <h2 className="tn-view__title">Type it down. Decide later.</h2>
        </div>
        <p className="tn-today__stat tnum">{inbox.length} waiting</p>
      </div>

      <div className="tn-add tn-add--wide">
        <input
          ref={inputRef}
          className="tn-input"
          value={text}
          placeholder="Something you do not want to forget…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              capture();
            }
          }}
          aria-label="Capture a task"
        />
        <button type="button" className="tn-btn" onClick={capture} disabled={!text.trim()}>
          <PlusIcon size={14} /> Capture
        </button>
      </div>
      <p className="tn-inbox__hint">
        Enter captures. The task goes to the top of the list below — press{" "}
        <button type="button" className="tn-link" onClick={() => setPaletteOpen(true)}>
          ⌘K
        </button>{" "}
        to find it again.
      </p>

      <ul className="tn-rows">
        {inbox.map((t) => (
          <TaskRow
            key={t.id}
            id={t.id}
            title={t.title}
            projectId={t.projectId}
            day={t.day}
            done={t.done}
            est={t.est}
            showProject={false}
            trailing={
              <span className="tn-triage">
                <button type="button" className="tn-triage__btn" onClick={() => triage(t.id, { day: TODAY })}>
                  Today
                </button>
                <label className="tn-triage__pick">
                  <span className="tn-sr">File {t.title} under</span>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) triage(t.id, { projectId: e.target.value });
                    }}
                    aria-label={`File ${t.title} under a project`}
                  >
                    <option value="">File under…</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="tn-triage__btn"
                  onClick={() => triage(t.id, { archive: true })}
                  aria-label={`Archive ${t.title}`}
                  title="Archive"
                >
                  <ArchiveIcon size={15} />
                </button>
              </span>
            }
          />
        ))}
        {inbox.length === 0 && (
          <li className="tn-empty">
            The inbox is empty. That is the whole ambition of this screen — everything has a
            project and a day.
          </li>
        )}
      </ul>
    </div>
  );
}
