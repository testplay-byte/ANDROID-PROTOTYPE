"use client";

/**
 * thin / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: one modal that jumps to a view, a project or a
 * task, and runs an action on the current selection. Phones have no
 * equivalent — they get search screens — which is one more reason the desktop
 * app is its own prototype.
 *
 * Every row is a real action on the context; nothing here is a dead end.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { projectById, shortDate } from "../data";
import { VIEWS, useThin, type ViewId } from "../state/thin-context";
import { SearchIcon } from "./icons";

type Kind = "Go" | "Project" | "Task" | "Do";

const ACTIONS = [
  { id: "do-tick", label: "Tick the selection", hint: "Mark the selected tasks done" },
  { id: "do-archive", label: "Archive the selection", hint: "Move the selected tasks out of the way" },
  { id: "do-capture", label: "Capture a task", hint: "Go to the inbox and start typing" },
] as const;

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    view,
    go,
    tasks,
    projects,
    selectProject,
    checked,
    todayTasks,
    projectTasks,
    toggleDone,
    archive,
    focusCapture,
  } = useThin();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const hit = (s: string) => !term || s.toLowerCase().includes(term);

    const views = VIEWS.filter((v) => hit(v.label)).map((v) => ({
      kind: "Go" as const,
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));

    const projs = projects.filter((p) => hit(p.name)).map((p) => ({
      kind: "Project" as const,
      id: p.id,
      label: p.name,
      hint: p.area,
    }));

    const found = tasks
      .filter((t) => !t.archived && hit(t.title))
      .slice(0, term ? 7 : 5)
      .map((t) => ({
        kind: "Task" as const,
        id: t.id,
        label: t.title,
        hint: `${projectById(t.projectId)?.name ?? "Inbox"}${t.day ? ` · ${shortDate(t.day)}` : ""}`,
      }));

    const acts = ACTIONS.filter((a) => hit(a.label)).map((a) => ({
      kind: "Do" as const,
      ...a,
    }));

    return [...views, ...projs, ...found, ...acts].slice(0, 11);
  }, [projects, q, tasks]);

  if (!paletteOpen) return null;

  const run = (kind: Kind, id: string) => {
    setPaletteOpen(false);

    if (kind === "Go") {
      go(id as ViewId);
      return;
    }

    if (kind === "Project") {
      go("projects");
      selectProject(id);
      return;
    }

    if (kind === "Task") {
      const task = tasks.find((t) => t.id === id);
      if (task?.projectId) {
        go("projects");
        selectProject(task.projectId);
      } else {
        go("inbox");
      }
      return;
    }

    if (id === "do-capture") {
      focusCapture();
      return;
    }

    /* An action with no explicit selection works on the list the user is
       already looking at, and the toast says how many it touched. */
    const targets =
      checked.length > 0
        ? checked
        : view === "projects"
          ? projectTasks.map((t) => t.id)
          : view === "inbox"
            ? []
            : todayTasks.filter((t) => !t.done).map((t) => t.id);
    if (targets.length === 0) return;
    if (id === "do-tick") toggleDone(targets);
    else archive(targets);
  };

  return (
    <div
      className="tn-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="tn-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="tn-palette__input">
          <SearchIcon size={15} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, project or task…"
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && results[cursor]) {
                run(results[cursor].kind, results[cursor].id);
              }
            }}
            aria-label="Command palette search"
          />
          <kbd>Esc</kbd>
        </label>
        <ul className="tn-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r.kind, r.id)}
              >
                <span className="tn-palette__kind">{r.kind}</span>
                <span className="tn-palette__label">{r.label}</span>
                <span className="tn-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="tn-palette__empty">Nothing matches “{q}”</li>}
        </ul>
        <p className="tn-palette__foot">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> run
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </p>
      </div>
    </div>
  );
}
