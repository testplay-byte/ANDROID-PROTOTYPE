/**
 * quill / components / note-blocks — the one renderer for note content.
 *
 * The editor and the Library preview read the SAME block list through this
 * component, so a note can never look different in two places. The checklist is
 * the only interactive block: tapping its box calls `onToggle`, which writes to
 * the provider's override map — that is why the checkbox actually toggles, the
 * word count stays stable and the progress meter moves.
 */

import { useQuill } from "../state/quill-context";
import type { Block, Note } from "../data";
import { CheckIcon, ChecklistIcon, CodeIcon, QuoteIcon } from "./icons";

export function NoteBlocks({ note }: { note: Note }) {
  const { isChecked, toggleCheck } = useQuill();

  return (
    <div className="ql-blocks">
      {note.blocks.map((block, i) => {
        switch (block.kind) {
          case "title":
            return (
              <h1 className="ql-title" key={i}>
                {block.text}
              </h1>
            );

          case "para":
            return (
              <p className="ql-para" key={i}>
                {block.text}
              </p>
            );

          case "quote":
            return (
              <figure className="ql-quote" key={i}>
                <QuoteIcon size={16} />
                <blockquote>{block.text}</blockquote>
                <figcaption>{block.cite}</figcaption>
              </figure>
            );

          case "code":
            return (
              <figure className="ql-code" key={i}>
                <figcaption>
                  <CodeIcon size={14} />
                  {block.lang}
                </figcaption>
                <pre>
                  <code>{block.text}</code>
                </pre>
              </figure>
            );

          case "check": {
            const done = isChecked(note, block.id, block.done);
            return (
              <div className="ql-check" key={i} data-done={done || undefined}>
                <button
                  type="button"
                  className="ql-check__box"
                  role="checkbox"
                  aria-checked={done}
                  aria-label={block.text}
                  onClick={() => toggleCheck(note, block.id, block.done)}
                >
                  {done && <CheckIcon size={13} strokeWidth={2.4} />}
                </button>
                <button
                  type="button"
                  className="ql-check__text"
                  onClick={() => toggleCheck(note, block.id, block.done)}
                >
                  {block.text}
                </button>
              </div>
            );
          }
        }
      })}
    </div>
  );
}

/** A one-line "what's in this note" strip — used by the Library row and the
 *  preview header so block kinds are visible without opening the note. */
export function BlockKinds({ note }: { note: Note }) {
  const { checkedCount } = useQuill();
  const checks = note.blocks.filter((b): b is Extract<Block, { kind: "check" }> => b.kind === "check");
  const code = note.blocks.some((b) => b.kind === "code");
  return (
    <span className="ql-kinds">
      {checks.length > 0 && (
        <span title="Checklist items">
          <ChecklistIcon size={14} /> {checkedCount(note)}/{checks.length}
        </span>
      )}
      {code && (
        <span title="Contains a code block">
          <CodeIcon size={14} /> code
        </span>
      )}
    </span>
  );
}
