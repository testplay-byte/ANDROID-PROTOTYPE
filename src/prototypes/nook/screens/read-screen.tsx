"use client";

/* read-screen — two states:
   1. picker: no book open; a quiet list to choose what to read.
   2. reader: real long-form text. A 1px progress bar runs under the
      top chrome; an "A A A" font-size control (3 steps, persisted)
      and a tight/loose leading toggle live in a controls strip.
      Tapping the page outside a paragraph toggles the chrome
      (immersive — the signature minimal interaction); tapping a
      paragraph marks it as a highlight (when tap-to-highlight is on).
      Scroll position drives progress; opening resumes at the stored
      page; Notes "jump-to" scrolls to a paragraph and flashes it. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNook } from "../state/nook-context";
import { bookById, flatParagraphs } from "../lib/data";

export function ReadScreen() {
  const { activeBookId } = useNook();
  return activeBookId && bookById(activeBookId) ? <Reader /> : <Picker />;
}

/* ------------------------------------------------------------------ */
/* picker                                                              */
/* ------------------------------------------------------------------ */

function Picker() {
  const { books, openBook } = useNook();
  const ordered = useMemo(() => {
    const rank = { reading: 0, "to-read": 1, finished: 2 } as const;
    return [...books].sort((a, b) => rank[a.status] - rank[b.status] || b.pct - a.pct);
  }, [books]);

  return (
    <section className="no-screen" aria-label="Read">
      <div className="no-content">
        <header className="no-head" style={{ "--stagger": "0ms" } as CSSProperties}>
          <span className="no-head__kicker">Read</span>
          <span className="no-head__meta">choose a book</span>
        </header>
        <div className="no-rows" style={{ "--stagger": "80ms" } as CSSProperties}>
          {ordered.map((b) => (
            <button key={b.id} className="no-row" onClick={() => openBook(b.id)}>
              <span className="no-row__main">
                <span className="no-row__title">{b.shortTitle}</span>
                <span className="no-row__author">
                  {b.author}
                  {b.status === "reading"
                    ? ` · ${b.pct}% in`
                    : b.status === "finished"
                      ? " · finished"
                      : ` · ${b.pages} pages`}
                </span>
              </span>
              <span className="no-row__pct">{b.status === "to-read" ? "start" : `${b.passages.length} ch`}</span>
              <span className="no-rule no-rule--row" aria-hidden="true">
                <span className="no-rule__fill" style={{ width: `${b.pct}%` }} />
              </span>
            </button>
          ))}
        </div>
        <p className="no-foot" style={{ "--stagger": "160ms" } as CSSProperties}>
          passages are original prose written for this prototype
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* reader                                                              */
/* ------------------------------------------------------------------ */

function Reader() {
  const {
    activeBookId,
    bookOf,
    closeBook,
    go,
    prefs,
    setPrefs,
    startParagraphOf,
    setProgress,
    isHighlighted,
    toggleHighlight,
    jumpTarget,
    clearJump,
  } = useNook();

  const book = bookOf(activeBookId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [chrome, setChrome] = useState(true); // immersive toggle
  const [flash, setFlash] = useState<number | null>(null);
  const [pct, setPctState] = useState(book?.pct ?? 0);
  const lastReported = useRef(-1);

  const flat = useMemo(() => (book ? flatParagraphs(book) : []), [book]);
  const totalParas = flat.length;

  const leaveReader = useCallback(() => {
    closeBook();
    go("shelf");
  }, [closeBook, go]);

  /* resume: scroll to the stored paragraph once on open */
  useEffect(() => {
    if (!book || jumpTarget) return; // the jump effect owns the scroll
    const el = scrollRef.current;
    const target = paraRefs.current[startParagraphOf(book.id, totalParas)];
    if (el && target) el.scrollTop = Math.max(0, target.offsetTop - 20);
    lastReported.current = book.pct;
    setPctState(book.pct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  /* notes → jump-to: scroll + brief flash on the marked paragraph */
  useEffect(() => {
    if (!jumpTarget || !book) return;
    const idx = flat.findIndex(
      (f) => f.passageId === jumpTarget.passageId && f.paraIndex === jumpTarget.paraIndex,
    );
    if (idx >= 0) {
      const el = scrollRef.current;
      const target = paraRefs.current[idx];
      if (el && target)
        el.scrollTo({ top: Math.max(0, target.offsetTop - 20), behavior: "smooth" });
      setFlash(idx);
    }
    clearJump();
    const t = window.setTimeout(() => setFlash(null), 1300);
    return () => window.clearTimeout(t);
  }, [jumpTarget, book, flat, clearJump]);

  /* scroll → progress (monotonic; drives the 1px bar + the shelf) */
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !book) return;
    const span = el.scrollHeight - el.clientHeight;
    const raw = span > 4 ? (el.scrollTop / span) * 100 : book.pct;
    const p = Math.max(book.pct, Math.min(100, Math.round(raw)));
    if (p !== lastReported.current) {
      lastReported.current = p;
      setPctState(p);
      setProgress(book.id, p);
    }
  }, [book, setProgress]);

  /* tap anywhere that is not the chrome → toggle the immersive chrome.
     (proto-kit's useSwipeSimulation already swallows the click that
     follows a drag, so a horizontal swipe never toggles the chrome.) */
  function onSurfaceTap(e: React.MouseEvent) {
    const t = e.target as HTMLElement;
    if (t.closest("[data-para]")) return; // paragraph tap = highlight
    if (t.closest("[data-chrome]")) return; // controls handle themselves
    setChrome((c) => !c);
  }

  if (!book) return null;

  /* global paragraph index across passages, in reading order */
  let gi = -1;
  const done = pct >= 100;

  return (
    <section
      className={"no-reader" + (chrome ? "" : " is-immersive")}
      aria-label="Reader"
    >
      <div className="no-reader__bar" data-chrome>
        <button className="no-reader__back" onClick={leaveReader} aria-label="Close reader">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          <span>shelf</span>
        </button>
        <span className="no-reader__ident">
          {book.shortTitle} <em>{book.author}</em>
        </span>
        <span className="no-reader__pct tnum">{pct}%</span>
      </div>
      <div className="no-reader__rule" aria-hidden="true">
        <span className="no-reader__rule-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="no-reader__controls" data-chrome>
        <span className="no-seg" role="group" aria-label="Text size">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={"no-seg__btn" + (prefs.fontStep === i ? " is-on" : "")}
              style={{ fontSize: [10, 12.5, 16][i] }}
              aria-pressed={prefs.fontStep === i}
              aria-label={`Text size ${i + 1} of 3`}
              onClick={() => setPrefs({ fontStep: i as 0 | 1 | 2 })}
            >
              A
            </button>
          ))}
        </span>
        <span className="no-seg" role="group" aria-label="Line spacing">
          <button
            className={"no-seg__btn no-seg__txt" + (!prefs.looseLeading ? " is-on" : "")}
            aria-pressed={!prefs.looseLeading}
            onClick={() => setPrefs({ looseLeading: false })}
          >
            tight
          </button>
          <button
            className={"no-seg__btn no-seg__txt" + (prefs.looseLeading ? " is-on" : "")}
            aria-pressed={prefs.looseLeading}
            onClick={() => setPrefs({ looseLeading: true })}
          >
            loose
          </button>
        </span>
      </div>

      <div
        className="no-scroll"
        ref={scrollRef}
        onScroll={onScroll}
        onClick={onSurfaceTap}
      >
        <div
          className={
            "no-text no-text--s" +
            prefs.fontStep +
            (prefs.looseLeading ? " no-text--loose" : "")
          }
        >
          {book.passages.map((passage) => (
            <article className="no-passage" key={passage.id}>
              <h2 className="no-passage__title">{passage.title}</h2>
              {passage.paragraphs.map((text, pi) => {
                gi += 1;
                const idx = gi;
                const marked = isHighlighted(book.id, passage.id, pi);
                return (
                  <p
                    key={pi}
                    data-para
                    ref={(el) => {
                      paraRefs.current[idx] = el;
                    }}
                    className={
                      "no-para" +
                      (prefs.tapToHighlight ? " is-tappable" : "") +
                      (marked ? " is-marked" : "") +
                      (flash === idx ? " is-flash" : "")
                    }
                    onClick={() => {
                      if (!prefs.tapToHighlight) return;
                      toggleHighlight({
                        bookId: book.id,
                        passageId: passage.id,
                        paraIndex: pi,
                        text,
                      });
                    }}
                  >
                    {text}
                  </p>
                );
              })}
            </article>
          ))}
          <footer className="no-reader__end">
            {done ? (
              <>
                <span className="no-reader__end-title">The end</span>
                <button className="no-reader__endlink" onClick={leaveReader}>
                  Return to the shelf
                </button>
              </>
            ) : (
              <span className="no-reader__endnote">
                your place is kept — scroll, close, come back
              </span>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
}
