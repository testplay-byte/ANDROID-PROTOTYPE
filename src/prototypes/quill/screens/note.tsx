"use client";

/**
 * quill / screens / note — the editor.
 *
 * The note's BLOCKS are the content: title, paragraphs, a quote, a working
 * checklist and a code block, all rendered by the shared <NoteBlocks>. Tapping a
 * checklist row writes to the provider's override map, so the box toggles, the
 * progress meter in the rail moves, and the change survives a reload.
 *
 * A desktop note is a single wide column with a metadata rail BESIDE it — the
 * phone equivalent is one scrolling screen with no rail at all.
 */

import { checklistProgress, relativeTime, tagLabel, wordCount } from "../data";
import { useQuill } from "../state/quill-context";
import { NoteBlocks } from "../components/note-blocks";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChecklistIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  PinIcon,
  TagIcon,
} from "../components/icons";

export function NoteScreen() {
  const { activeNote, notes, go, openNote, fontSize, checkedCount, setSearch, notify } = useQuill();

  const at = notes.findIndex((n) => n.id === activeNote.id);
  const prev = notes[at - 1];
  const next = notes[at + 1];
  const progress = checklistProgress(activeNote);
  const done = checkedCount(activeNote);

  return (
    <div className="ql-split ql-split--note" data-size={fontSize}>
      <section className="ql-pane ql-pane--editor" aria-label={`Editing ${activeNote.title}`}>
        <div className="ql-editorbar">
          <button type="button" className="ql-btn" onClick={() => go("library")}>
            <ArrowLeftIcon size={15} /> Library
          </button>
          <div className="ql-editorbar__nav">
            <button
              type="button"
              className="ql-iconbtn"
              disabled={!prev}
              onClick={() => prev && openNote(prev.id)}
              aria-label="Previous note"
            >
              <ArrowLeftIcon size={16} />
            </button>
            <span className="ql-editorbar__where tnum">
              {at + 1} / {notes.length}
            </span>
            <button
              type="button"
              className="ql-iconbtn"
              disabled={!next}
              onClick={() => next && openNote(next.id)}
              aria-label="Next note"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>

        <article className="ql-editor">
          <NoteBlocks note={activeNote} />
        </article>

        <footer className="ql-editorfoot">
          <span className="tnum">{wordCount(activeNote)} words</span>
          <span className="tnum">{activeNote.blocks.length} blocks</span>
          <span className="tnum">
            {done}/{progress.total} checked
          </span>
          <span className="ql-editorfoot__sep" />
          <span>
            <ClockIcon size={13} /> Updated {relativeTime(activeNote.updatedMins)}
          </span>
          <span className="ql-editorfoot__hint">Font size is set in Settings</span>
        </footer>
      </section>

      <aside className="ql-pane ql-pane--meta" aria-label="Note details">
        <h2 className="ql-meta__head">Details</h2>

        <dl className="ql-facts">
          <div>
            <dt>
              <FolderIcon size={14} /> Folder
            </dt>
            <dd>{activeNote.folder}</dd>
          </div>
          <div>
            <dt>
              <TagIcon size={14} /> Tags
            </dt>
            <dd className="ql-facts__tags">
              {activeNote.tags.map((t) => (
                <em key={t} className="ql-tagpill">
                  {tagLabel(t)}
                </em>
              ))}
            </dd>
          </div>
          <div>
            <dt>
              <ClockIcon size={14} /> Created
            </dt>
            <dd>{activeNote.created}</dd>
          </div>
          <div>
            <dt>
              <ClockIcon size={14} /> Updated
            </dt>
            <dd>{relativeTime(activeNote.updatedMins)}</dd>
          </div>
          <div>
            <dt>Words</dt>
            <dd className="tnum">{wordCount(activeNote)}</dd>
          </div>
          <div>
            <dt>
              <ChecklistIcon size={14} /> Checklist
            </dt>
            <dd className="tnum">
              {done} of {progress.total} done
            </dd>
          </div>
        </dl>

        {progress.total > 0 && (
          <div className="ql-progress">
            <div className="ql-progress__track">
              <div className="ql-progress__fill" style={{ width: `${(done / progress.total) * 100}%` }} />
            </div>
            <p className="ql-progress__caption tnum">
              {done === progress.total ? "Everything on this note is done" : `${progress.total - done} left`}
            </p>
          </div>
        )}

        {activeNote.pinned && (
          <p className="ql-meta__pin">
            <PinIcon size={14} /> Pinned to the top of the library
          </p>
        )}

        <div className="ql-meta__actions">
          <button
            type="button"
            className="ql-btn ql-btn--filled"
            onClick={() => {
              notify(`${activeNote.title} — ${wordCount(activeNote)} words, ${done}/${progress.total} checked`);
            }}
          >
            <CheckIcon size={15} /> Mark reviewed
          </button>
          <button
            type="button"
            className="ql-btn"
            onClick={() => {
              setSearch(activeNote.tags[0] ?? "");
              go("library");
              window.setTimeout(
                () => document.querySelector<HTMLInputElement>("#ql-library-search")?.focus(),
                60
              );
            }}
          >
            Filter library by “{tagLabel(activeNote.tags[0] ?? "design")}”
          </button>
        </div>
      </aside>
    </div>
  );
}
