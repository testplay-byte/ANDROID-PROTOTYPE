"use client";

/**
 * quill / screens / library — the three-column desktop window.
 *
 *   [ DesktopSidebar ] [ note list ] [ preview pane ]
 *
 * What makes this a DESKTOP library and not a phone list:
 *   - the list and the detail are side by side; selecting a row fills the
 *     preview pane instead of pushing a new screen
 *   - a search field AND tag chips AND a sort control filter the same list
 *   - ↑/↓ move the selection, Enter opens the note in the editor
 *   - a footer reports the filtered count against the total
 */

import { useEffect, useRef } from "react";
import {
  TAGS,
  checklistProgress,
  previewOf,
  relativeTime,
  tagLabel,
  wordCount,
} from "../data";
import { SORTS, useQuill, type SortKey } from "../state/quill-context";
import { BlockKinds } from "../components/note-blocks";
import {
  ArrowUpDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
} from "../components/icons";

export function LibraryScreen() {
  const {
    filteredNotes,
    search,
    setSearch,
    tags,
    toggleTag,
    clearTags,
    pinnedOnly,
    setPinnedOnly,
    sort,
    setSort,
    activeNoteId,
    selectNote,
    openNote,
    newNote,
    notes,
    counts,
  } = useQuill();

  const listRef = useRef<HTMLDivElement>(null);
  const active = notes.find((n) => n.id === activeNoteId) ?? notes[0];

  /* ↑/↓ walk the filtered list and keep the preview pane in step. */
  const move = (delta: number) => {
    if (filteredNotes.length === 0) return;
    const at = filteredNotes.findIndex((n) => n.id === activeNoteId);
    const next = Math.min(Math.max(at + delta, 0), filteredNotes.length - 1);
    const target = filteredNotes[next];
    if (target) selectNote(target.id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Enter" && listRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        openNote(activeNoteId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredNotes, activeNoteId]);

  const progress = checklistProgress(active);
  const filtersOn = tags.length > 0 || pinnedOnly;

  return (
    <div className="ql-split">
      {/* ---------- column 2: the list ---------- */}
      <section className="ql-pane ql-pane--list" aria-label="Note list">
        <div className="ql-toolbar">
          <label className="ql-search">
            <SearchIcon size={15} />
            <input
              id="ql-library-search"
              type="search"
              value={search}
              placeholder="Search this library"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search this library"
            />
            {search ? (
              <button type="button" className="ql-search__clear" onClick={() => setSearch("")} aria-label="Clear search">
                Clear
              </button>
            ) : (
              <kbd>/</kbd>
            )}
          </label>
          <div className="ql-sort" role="group" aria-label="Sort notes">
            <ArrowUpDownIcon size={15} />
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={sort === s.id ? "is-on" : ""}
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id as SortKey)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ql-chips" role="group" aria-label="Filter by tag">
          <button
            type="button"
            className={`ql-chip ql-chip--pin ${pinnedOnly ? "is-on" : ""}`}
            aria-pressed={pinnedOnly}
            onClick={() => setPinnedOnly(!pinnedOnly)}
          >
            <PinIcon size={13} /> Pinned
          </button>
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`ql-chip ${tags.includes(t.id) ? "is-on" : ""}`}
              aria-pressed={tags.includes(t.id)}
              onClick={() => toggleTag(t.id)}
            >
              {t.label}
              <span className="tnum">{counts.byTag[t.id] ?? 0}</span>
            </button>
          ))}
          {filtersOn && (
            <button type="button" className="ql-chip ql-chip--clear" onClick={clearTags}>
              Clear
            </button>
          )}
        </div>

        <div className="ql-list" ref={listRef} role="listbox" aria-label="Notes" tabIndex={-1}>
          {filteredNotes.map((n) => {
            const p = checklistProgress(n);
            return (
              <button
                type="button"
                role="option"
                aria-selected={n.id === activeNoteId}
                key={n.id}
                className="ql-row"
                data-selected={n.id === activeNoteId || undefined}
                onClick={() => selectNote(n.id)}
                onDoubleClick={() => openNote(n.id)}
              >
                <span className="ql-row__top">
                  <span className="ql-row__title">{n.title}</span>
                  {n.pinned && <PinIcon size={13} />}
                </span>
                <span className="ql-row__snippet">{previewOf(n)}</span>
                <span className="ql-row__meta">
                  <span className="ql-row__when">
                    <ClockIcon size={13} /> {relativeTime(n.updatedMins)}
                  </span>
                  <span className="ql-row__tags">
                    {n.tags.map((t) => (
                      <em key={t} className="ql-tagpill">
                        {tagLabel(t)}
                      </em>
                    ))}
                  </span>
                  <span className="tnum ql-row__words">{wordCount(n)} words</span>
                </span>
                {p.total > 0 && (
                  <span className="ql-row__meter" aria-hidden="true">
                    <i style={{ width: `${(p.done / p.total) * 100}%` }} />
                  </span>
                )}
              </button>
            );
          })}
          {filteredNotes.length === 0 && (
            <div className="ql-empty">
              <p>No notes match this filter.</p>
              <p className="ql-empty__hint">Clear the chips, or search for something else.</p>
              <button type="button" className="ql-btn" onClick={clearTags}>
                Reset filters
              </button>
            </div>
          )}
        </div>

        <footer className="ql-listfoot">
          <span className="tnum">
            {filteredNotes.length} of {notes.length} notes
          </span>
          <span className="ql-listfoot__hint">↑ ↓ to preview · Enter to open</span>
        </footer>
      </section>

      {/* ---------- column 3: the detail pane, BESIDE the list ---------- */}
      <section className="ql-pane ql-pane--preview" aria-label="Note preview">
        <header className="ql-preview__head">
          <div className="ql-preview__id">
            <span className="ql-preview__folder">
              <FolderIcon size={14} /> {active.folder}
            </span>
            <h2>{active.title}</h2>
            <p className="ql-preview__when">
              Updated {relativeTime(active.updatedMins)} · created {active.created}
            </p>
          </div>
          <button type="button" className="ql-btn ql-btn--filled" onClick={() => openNote(active.id)}>
            Open in editor <ChevronRightIcon size={15} />
          </button>
        </header>

        <div className="ql-preview__body">
          <p className="ql-preview__text">{previewOf(active)}</p>

          <div className="ql-preview__grid">
            <div className="ql-fact">
              <span className="ql-fact__label">
                <TagIcon size={14} /> Tags
              </span>
              <span className="ql-fact__value">
                {active.tags.map((t) => (
                  <em key={t} className="ql-tagpill">
                    {tagLabel(t)}
                  </em>
                ))}
              </span>
            </div>
            <div className="ql-fact">
              <span className="ql-fact__label">Length</span>
              <span className="ql-fact__value tnum">{wordCount(active)} words</span>
            </div>
            <div className="ql-fact">
              <span className="ql-fact__label">Blocks</span>
              <span className="ql-fact__value tnum">{active.blocks.length}</span>
            </div>
            <div className="ql-fact">
              <span className="ql-fact__label">Checklist</span>
              <span className="ql-fact__value tnum">
                {progress.done}/{progress.total} done
              </span>
            </div>
          </div>

          {progress.total > 0 && (
            <div className="ql-progress">
              <div className="ql-progress__track">
                <div className="ql-progress__fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
              </div>
              <p className="ql-progress__caption">
                {progress.total - progress.done === 0
                  ? "Every action on this note is done."
                  : `${progress.total - progress.done} action${progress.total - progress.done === 1 ? "" : "s"} left in the editor.`}
              </p>
            </div>
          )}

          <div className="ql-preview__foot">
            <BlockKinds note={active} />
            <button type="button" className="ql-btn" onClick={newNote}>
              <PlusIcon size={15} /> New note
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
