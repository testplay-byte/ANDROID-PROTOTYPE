"use client";

/* shelf-screen — the library as pure typography. A quiet small-caps
   header (no large title), one "currently reading" card with the big
   title treatment, then reading / finished / to-read rows: title at
   medium weight, author muted, 1px hairline between rows, a 1px
   progress rule under each row. Tapping a row opens the reader. */

import type { CSSProperties } from "react";
import { useNook } from "../state/nook-context";
import { minutesLabel } from "../lib/data";
import type { NookBook } from "../state/nook-context";

export function ShelfScreen() {
  const { books, openBook, go, highlights, minutes } = useNook();

  const reading = books.filter((b) => b.status === "reading");
  const featured = [...reading].sort((a, b) => b.pct - a.pct)[0] ?? null;
  const finished = books.filter((b) => b.status === "finished");
  const toRead = books.filter((b) => b.status === "to-read");
  const rest = reading.filter((b) => b.id !== featured?.id);
  const noteCount = (id: string) => highlights.filter((h) => h.bookId === id).length;

  return (
    <section className="no-screen" aria-label="Shelf">
      <div className="no-content">
        <header className="no-head" style={{ "--stagger": "0ms" } as CSSProperties}>
          <span className="no-head__kicker">Shelf</span>
          <span className="no-head__meta tnum">
            {books.length} books · {finished.length} finished
          </span>
        </header>

        {featured ? (
          <button
            className="no-feature"
            style={{ "--stagger": "70ms" } as CSSProperties}
            onClick={() => {
              openBook(featured.id);
              go("read");
            }}
          >
            <span className="no-feature__label">Currently reading</span>
            <span className="no-feature__title">{featured.title}</span>
            <span className="no-feature__author">
              {featured.author} · {featured.year}
            </span>
            <span className="no-feature__meter">
              <span className="no-feature__pct tnum">{featured.pct}%</span>
              <span className="no-rule" aria-hidden="true">
                <span className="no-rule__fill" style={{ width: `${featured.pct}%` }} />
              </span>
              <span className="no-feature__left">
                {Math.round((featured.pages * (100 - featured.pct)) / 100)} pages left
              </span>
            </span>
          </button>
        ) : null}

        {rest.length > 0 ? (
          <h2 className="no-sechead" style={{ "--stagger": "140ms" } as CSSProperties}>
            In progress
          </h2>
        ) : null}
        <div className="no-rows" style={{ "--stagger": "180ms" } as CSSProperties}>
          {rest.map((b) => (
            <ShelfRow key={b.id} book={b} notes={noteCount(b.id)} />
          ))}
        </div>

        <h2 className="no-sechead" style={{ "--stagger": "240ms" } as CSSProperties}>
          Finished
        </h2>
        <div className="no-rows" style={{ "--stagger": "280ms" } as CSSProperties}>
          {finished.map((b) => (
            <ShelfRow key={b.id} book={b} notes={noteCount(b.id)} />
          ))}
        </div>

        {toRead.length > 0 ? (
          <>
            <h2 className="no-sechead" style={{ "--stagger": "340ms" } as CSSProperties}>
              To read
            </h2>
            <div className="no-rows" style={{ "--stagger": "380ms" } as CSSProperties}>
              {toRead.map((b) => (
                <ShelfRow key={b.id} book={b} notes={noteCount(b.id)} />
              ))}
            </div>
          </>
        ) : null}

        <p className="no-foot" style={{ "--stagger": "440ms" } as CSSProperties}>
          {minutesLabel(minutes)} in the record · tap any line to read
        </p>
      </div>
    </section>
  );
}

function ShelfRow({ book, notes }: { book: NookBook; notes: number }) {
  const { openBook, go } = useNook();
  const pct = book.pct;
  return (
    <button
      className="no-row"
      onClick={() => {
        openBook(book.id);
        go("read");
      }}
    >
      <span className="no-row__main">
        <span className="no-row__title">{book.shortTitle}</span>
        <span className="no-row__author">
          {book.author}
          {book.status === "finished" ? (
            <>
              {" "}
              · Finished{notes > 0 ? ` · ${notes} note${notes === 1 ? "" : "s"}` : ""}
            </>
          ) : null}
        </span>
      </span>
      <span className="no-row__pct tnum">{book.status === "finished" ? "—" : `${pct}%`}</span>
      <span className="no-rule no-rule--row" aria-hidden="true">
        <span
          className="no-rule__fill"
          style={{ width: `${book.status === "finished" ? 100 : pct}%` }}
        />
      </span>
    </button>
  );
}
