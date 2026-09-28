"use client";

/**
 * quill / screens / search — the desktop search window.
 *
 * Left rail = the query, the scope filter and a result summary. Right side =
 * the results, GROUPED by where the match landed (Title / Checklist / Note /
 * Code) with the matched span wrapped in a <mark>.
 *
 * Keyboard-first: the field takes focus on mount, ↑/↓ walk the results, Enter
 * opens the note in the editor, Esc clears the query (handled in the provider,
 * which owns the Escape behaviour for every view).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SCOPES,
  SCOPE_LABEL,
  groupByKind,
  hitLines,
  relativeTime,
  titleOf,
  wordCount,
  type SearchScope,
} from "../data";
import { useQuill } from "../state/quill-context";
import { Highlight } from "../components/highlight";
import {
  ChecklistIcon,
  CodeIcon,
  InfoIcon,
  NoteIcon,
  SearchIcon,
  SparkIcon,
} from "../components/icons";

export function SearchScreen() {
  const { hits, query, setQuery, scope, setScope, openNote, notes } = useQuill();
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setCursor(0);
  }, [query, scope]);

  /* one row per note, in ranked order — this is what ↑/↓ walks */
  const rows = useMemo(() => {
    const seen: string[] = [];
    for (const h of hits) if (!seen.includes(h.note.id)) seen.push(h.note.id);
    return seen.map((id) => notes.find((n) => n.id === id)).filter((n): n is NonNullable<typeof n> => !!n);
  }, [hits, notes]);

  const groups = useMemo(() => groupByKind(hits), [hits]);
  const noteCount = rows.length;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && rows[cursor]) {
      e.preventDefault();
      openNote(rows[cursor].id);
    }
  };

  return (
    <div className="ql-split ql-split--search">
      <aside className="ql-pane ql-pane--query" aria-label="Search controls">
        <label className="ql-query">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Search every note…"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            aria-label="Search every note"
          />
        </label>

        <div className="ql-scope" role="group" aria-label="Limit search to">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`ql-chip ${scope === s.id ? "is-on" : ""}`}
              aria-pressed={scope === s.id}
              onClick={() => setScope(s.id as SearchScope)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ql-summary">
          {query.trim() ? (
            <>
              <p className="tnum">
                <b>{noteCount}</b> note{noteCount === 1 ? "" : "s"} · <b>{hits.length}</b> match
                {hits.length === 1 ? "" : "es"}
              </p>
              <ul className="ql-summary__list">
                {groups.map((g) => (
                  <li key={g.kind}>
                    <span>{SCOPE_LABEL[g.kind]}</span>
                    <span className="tnum">{g.hits.length}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="ql-summary__idle">
              <InfoIcon size={15} /> Type a word, a tag, or a phrase. Titles rank above checklist
              items, which rank above body text.
            </p>
          )}
        </div>

        <div className="ql-queryhint">
          <kbd>↑</kbd>
          <kbd>↓</kbd> move · <kbd>↵</kbd> open · <kbd>Esc</kbd> clear
        </div>
      </aside>

      <section className="ql-pane ql-pane--results" aria-label="Search results">
        {groups.map((g) => (
          <div className="ql-group" key={g.kind}>
            <h2 className="ql-group__head">
              {g.kind === "title" && <NoteIcon size={15} />}
              {g.kind === "check" && <ChecklistIcon size={15} />}
              {g.kind === "code" && <CodeIcon size={15} />}
              {SCOPE_LABEL[g.kind]}
              <span className="tnum">{g.hits.length}</span>
            </h2>
            {g.hits.map((h) => {
              const index = rows.findIndex((r) => r.id === h.note.id);
              const lines = hitLines(h.note, query, scope);
              return (
                <button
                  type="button"
                  key={`${h.note.id}-${h.kind}`}
                  className="ql-hit"
                  data-cursor={index === cursor || undefined}
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => openNote(h.note.id)}
                >
                  <span className="ql-hit__title">
                    <Highlight text={titleOf(h.note)} query={query} />
                    {index === cursor && <SparkIcon size={14} />}
                  </span>
                  {lines.length > 0 && (
                    <span className="ql-hit__lines">
                      {lines.map((l, i) => (
                        <span className="ql-hit__line" key={i}>
                          <Highlight text={l.text} query={query} />
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="ql-hit__meta">
                    {h.note.folder} · {relativeTime(h.note.updatedMins)} · {wordCount(h.note)} words
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        {query.trim() && groups.length === 0 && (
          <div className="ql-empty">
            <p>Nothing matched “{query}”.</p>
            <p className="ql-empty__hint">Try a shorter word, or widen the scope back to Everything.</p>
            <button type="button" className="ql-btn" onClick={() => setScope("all")}>
              Search everything
            </button>
          </div>
        )}

        {!query.trim() && (
          <div className="ql-empty ql-empty--lead">
            <p>Search across titles, paragraphs, checklist items and code.</p>
            <p className="ql-empty__hint">
              Try “checklist”, “type”, “search” or a tag like “engineering”.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
