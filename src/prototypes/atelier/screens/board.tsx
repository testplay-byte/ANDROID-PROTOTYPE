"use client";

/**
 * atelier / screens / board — the studio production board.
 *
 * Desktop-only layout: four columns across the whole window, each headed by a
 * SOLID primary block (red, blue, yellow, then ink) with a WIP count, and
 * cards that advance to the next stage on click. The numbered switcher above
 * the board is a desktop "pin a column" control; below 900px of surface width
 * it becomes the ONLY way to move between columns, because the board reflows
 * to one column at a time (atelier.css § 10).
 */

import { SHAPE_LABEL, STAGES, type Card } from "../data";
import { useAtelier } from "../state/atelier-context";
import { ArrowIcon, PlusIcon } from "../components/icons";
import { Mark } from "../components/geometry";

/** One job on the board. The whole card IS the control: clicking or
 *  pressing Enter advances it to the next stage. */
function BoardCard({ card }: { card: Card }) {
  const { advanceCard } = useAtelier();
  return (
    <button
      type="button"
      className="atl-tcard"
      data-tone={card.tone}
      onClick={() => advanceCard(card.id)}
      aria-label={`Advance ${card.title} to the next stage`}
      title="Advance to the next stage"
    >
      <span className="atl-tcard__top">
        <Mark kind={card.shape} tone={card.tone} size={12} />
        <b className="tnum">{card.points}</b>
      </span>
      <span className="atl-tcard__title">{card.title}</span>
      <span className="atl-tcard__work">{card.work}</span>
      <span className="atl-tcard__foot">
        <span className="atl-tcard__owner">{card.owner}</span>
        <span className="atl-tcard__due tnum">{card.due}</span>
        <span className="atl-advance" aria-hidden="true">
          <ArrowIcon size={14} />
        </span>
      </span>
      <span className="atl-tcard__shape">{SHAPE_LABEL[card.shape]}</span>
    </button>
  );
}

export function BoardScreen() {
  const { cards, boardColumn, setBoardColumn, stageCounts: counts, notify, go } = useAtelier();
  const active = STAGES[boardColumn] ?? STAGES[0];

  return (
    <div className="atl-view">
      <div className="atl-boardbar">
        <div className="atl-switch" role="tablist" aria-label="Board columns">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={boardColumn === i}
              className={`atl-switch__btn atl-switch__btn--${s.tone} ${boardColumn === i ? "is-on" : ""}`}
              onClick={() => setBoardColumn(i)}
            >
              <span className="tnum">{s.index}</span>
              {s.label}
            </button>
          ))}
        </div>
        <p className="atl-boardbar__hint">
          Column {active.index} — <b>{active.label}</b>. Click a card to advance it.
        </p>
        <button
          type="button"
          className="atl-btn atl-btn--ink"
          onClick={() => notify(`New job drafted into ${active.label}`)}
        >
          <PlusIcon size={14} /> New job
        </button>
      </div>

      <div className="atl-board" data-col={boardColumn}>
        {STAGES.map((col, i) => {
          const items = cards.filter((c) => c.stage === col.id);
          const over = col.wip !== null && counts[col.id] > col.wip;
          return (
            <section
              className="atl-col"
              key={col.id}
              data-tone={col.tone}
              data-on={boardColumn === i || undefined}
              aria-label={`${col.label} column`}
            >
              <header className="atl-col__head">
                <span className="atl-col__index tnum">{col.index}</span>
                <h2>{col.label}</h2>
                <span className="atl-col__wip tnum">
                  {counts[col.id]}
                  {col.wip !== null ? ` / ${col.wip}` : ""}
                </span>
              </header>
              {col.wip !== null && (
                <p className="atl-col__limit">Work in progress {over ? "— over limit" : "— within limit"}</p>
              )}
              <div className="atl-col__cards">
                {items.map((c) => (
                  <BoardCard key={c.id} card={c} />
                ))}
                {items.length === 0 && <p className="atl-col__empty">Empty</p>}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="atl-board__foot">
        <span className="tnum">
          {cards.length} jobs · {counts.installed} installed · {counts.construction} on the bench
        </span>
        <button type="button" className="atl-linkbtn" onClick={() => go("studio")}>
          See who is carrying them →
        </button>
      </footer>
    </div>
  );
}
