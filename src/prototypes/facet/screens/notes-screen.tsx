"use client";

/**
 * facet / screens / notes-screen — the desktop notes pattern: a searchable
 * list on the left, the editor on the right, and a meta rail beside it.
 *
 * The editor writes straight into the live notes array, so the board's
 * "latest note" tile, the ⌘K palette and this list are never out of step.
 */

import { useEffect } from "react";
import { PlusIcon, SearchIcon, CloseIcon } from "../components/icons";
import { useFacet } from "../state/facet-context";

export function NotesScreen() {
  const {
    notes,
    visibleNotes,
    noteId,
    selectNote,
    search,
    setSearch,
    editNote,
    addNote,
    deleteNote,
    go,
  } = useFacet();

  const note = notes.find((n) => n.id === noteId) ?? visibleNotes[0] ?? null;

  /* keep the editor valid when the search hides the open note */
  useEffect(() => {
    if (note && !visibleNotes.some((n) => n.id === note.id) && visibleNotes[0]) {
      selectNote(visibleNotes[0].id);
    }
  }, [note, visibleNotes, selectNote]);

  const words = note ? note.body.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="fc-view">
      <div className="fc-split fc-split--notes">
        {/* ---------- the list ---------- */}
        <div className="fc-split__list">
          <label className="fc-searchbox">
            <SearchIcon size={15} />
            <input
              value={search}
              placeholder="Search titles, text and tags…"
              aria-label="Search notes"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear the search">
                <CloseIcon size={14} />
              </button>
            )}
          </label>

          <div className="fc-notelist__head">
            <span className="tnum">
              {visibleNotes.length} of {notes.length}
            </span>
            <button type="button" className="fc-btn fc-btn--sm fc-btn--solid" onClick={addNote}>
              <PlusIcon size={14} /> New
            </button>
          </div>

          <ul className="fc-notelist">
            {visibleNotes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="fc-notelist__item"
                  data-active={note?.id === n.id || undefined}
                  onClick={() => selectNote(n.id)}
                >
                  <span className="fc-notelist__top">
                    <b>{n.title}</b>
                    <span className="fc-chip">{n.tag}</span>
                  </span>
                  <span className="fc-notelist__preview">{n.body.split("\n")[0] || "Empty note"}</span>
                  <span className="fc-notelist__stamp tnum">{n.stamp}</span>
                </button>
              </li>
            ))}
            {visibleNotes.length === 0 && (
              <li className="fc-notelist__empty">
                No note matches “{search}”. The board's capture tile is the faster way in.
              </li>
            )}
          </ul>
        </div>

        {/* ---------- the editor + meta rail ---------- */}
        <div className="fc-split__main">
          {note ? (
            <div className="fc-editor">
              <div className="fc-editor__bar">
                <span className="fc-editor__tag">{note.tag}</span>
                <span className="fc-editor__stamp tnum">{note.stamp}</span>
                <span className="fc-editor__spacer" />
                <button
                  type="button"
                  className="fc-btn fc-btn--sm fc-btn--quiet"
                  onClick={() => go("board")}
                >
                  Show on board
                </button>
                <button
                  type="button"
                  className="fc-btn fc-btn--sm fc-btn--quiet"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
              <h2 className="fc-editor__title">{note.title}</h2>
              <textarea
                className="fc-editor__body"
                value={note.body}
                spellCheck={false}
                aria-label="Note body"
                onChange={(e) => editNote(note.id, e.target.value)}
              />
              <div className="fc-editor__foot tnum">
                {words} words · {note.body.length} characters · saved as you type
              </div>
            </div>
          ) : (
            <div className="fc-empty">
              <h2>No note open</h2>
              <p>Pick one from the list, or start a new one — the drawer is the memory of the board.</p>
              <button type="button" className="fc-btn fc-btn--solid" onClick={addNote}>
                <PlusIcon size={15} /> New note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
