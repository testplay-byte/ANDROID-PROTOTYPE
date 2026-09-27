"use client";

/* notes-screen — every marked passage, grouped by book. Each note is a
   hanging-indent quotation in the reading serif, its locator muted;
   "read" jumps into the reader at that paragraph (flash-highlighted),
   "remove" deletes the mark. Empty state invites the first mark. */

import type { CSSProperties } from "react";
import { useNook } from "../state/nook-context";
import { bookById } from "../lib/data";

export function NotesScreen() {
  const { highlights, removeHighlight, requestJump, go } = useNook();

  /* group by book, newest book-group first by most recent mark */
  const groups = new Map<string, typeof highlights>();
  for (const h of highlights) {
    const g = groups.get(h.bookId) ?? [];
    g.push(h);
    groups.set(h.bookId, g);
  }
  const ordered = [...groups.entries()].sort(
    (a, b) =>
      Number(b[1][b[1].length - 1]?.id.split("-")[1] ?? 0) -
      Number(a[1][a[1].length - 1]?.id.split("-")[1] ?? 0),
  );

  return (
    <section className="no-screen" aria-label="Notes">
      <div className="no-content">
        <header className="no-head" style={{ "--stagger": "0ms" } as CSSProperties}>
          <span className="no-head__kicker">Notes</span>
          <span className="no-head__meta tnum">
            {highlights.length} {highlights.length === 1 ? "mark" : "marks"}
          </span>
        </header>

        {ordered.length === 0 ? (
          <div className="no-empty" style={{ "--stagger": "80ms" } as CSSProperties}>
            <p className="no-empty__line">No passages marked yet.</p>
            <p className="no-empty__sub">
              Tap any paragraph while reading to keep it here.
            </p>
            <button
              className="no-empty__cta"
              onClick={() => {
                go("read");
              }}
            >
              Open a book
            </button>
          </div>
        ) : (
          ordered.map(([bookId, marks], gi) => {
            const book = bookById(bookId);
            if (!book) return null;
            return (
              <div
                className="no-notegroup"
                key={bookId}
                style={{ "--stagger": `${80 + gi * 70}ms` } as CSSProperties}
              >
                <h2 className="no-notegroup__head">
                  {book.shortTitle}
                  <em>{book.author}</em>
                </h2>
                {marks.map((h) => {
                  const passage = book.passages.find((p) => p.id === h.passageId);
                  return (
                    <figure className="no-note" key={h.id}>
                      <blockquote className="no-note__quote">
                        {h.text.length > 220 ? `${h.text.slice(0, 220).trimEnd()}…` : h.text}
                      </blockquote>
                      <figcaption className="no-note__foot">
                        <span className="no-note__loc">
                          {passage?.title ?? ""} · ¶{h.paraIndex + 1}
                        </span>
                        <span className="no-note__acts">
                          <button
                            className="no-note__act"
                            onClick={() => requestJump(h.bookId, h.passageId, h.paraIndex)}
                          >
                            read
                          </button>
                          <button
                            className="no-note__act no-note__act--del"
                            onClick={() => removeHighlight(h.id)}
                          >
                            remove
                          </button>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
