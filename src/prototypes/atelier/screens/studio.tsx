"use client";

/**
 * atelier / screens / studio — the people, the disciplines and the capacity.
 *
 * Desktop-only layout: a maker directory beside a capacity chart, both
 * multi-column. The chart is the same language as the rest of the app — flat
 * two-tone rules in the primary triad, numerals in tabular figures, no axis
 * furniture beyond a printed scale. Phone would be a list of names.
 */

import { DISCIPLINES, DISCIPLINE_LABEL, DISCIPLINE_TONE, WORKS, loadPct, type Discipline } from "../data";
import { useAtelier } from "../state/atelier-context";
import { CapacityBar, Mark } from "../components/geometry";

/** Booked hours per discipline, split by maker — a stacked rule, no chart junk. */
function DisciplineRow({ d }: { d: Discipline }) {
  const { makers } = useAtelier();
  const team = makers.filter((m) => m.discipline === d);
  const booked = team.reduce((n, m) => n + m.booked, 0);
  const capacity = team.reduce((n, m) => n + m.capacity, 0);
  const pct = capacity === 0 ? 0 : Math.round((booked / capacity) * 100);
  const plates = WORKS.filter((w) => w.discipline === d).length;
  return (
    <li className="atl-dis__row" data-tone={DISCIPLINE_TONE[d]}>
      <span className="atl-dis__label">
        <Mark kind="square" tone={DISCIPLINE_TONE[d]} size={12} />
        {DISCIPLINE_LABEL[d]}
      </span>
      <span className="atl-dis__plates tnum">{plates}</span>
      <span className="atl-dis__track" role="img" aria-label={`${pct}% booked`}>
        <span
          className={`atl-dis__fill atl-geo--${DISCIPLINE_TONE[d]}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="atl-dis__pct tnum">{pct}%</span>
      <span className="atl-dis__hrs tnum">
        {booked}/{capacity}h
      </span>
    </li>
  );
}

export function StudioScreen() {
  const { makers, cards, go } = useAtelier();

  return (
    <div className="atl-view">
      <div className="atl-studio">
        <section className="atl-people" aria-label="Makers">
          <h2 className="atl-label atl-label--rule">Makers</h2>
          <div className="atl-people__grid">
            {makers.map((m) => {
              const open = cards.filter((c) => c.owner === m.name).length;
              return (
                <article className="atl-person" key={m.id} data-tone={m.tone}>
                  <header className="atl-person__head">
                    <span className="atl-person__mark">
                      <Mark kind={m.shape} tone={m.tone} size={18} />
                    </span>
                    <div>
                      <b>{m.name}</b>
                      <span>{m.role}</span>
                    </div>
                    <span className="atl-person__init tnum">{m.initials}</span>
                  </header>
                  <p className="atl-person__disc">
                    <Mark kind="square" tone={DISCIPLINE_TONE[m.discipline]} size={9} />
                    {DISCIPLINE_LABEL[m.discipline]}
                  </p>
                  <CapacityBar maker={m} tone={m.tone} />
                  <footer className="atl-person__foot">
                    <span className="tnum">
                      {open} open job{open === 1 ? "" : "s"}
                    </span>
                    <span className="tnum">{loadPct(m)}% booked</span>
                  </footer>
                </article>
              );
            })}
          </div>
        </section>

        <section className="atl-dis" aria-label="Capacity by discipline">
          <h2 className="atl-label atl-label--rule">Capacity by discipline</h2>
          <ol className="atl-dis__list">
            {DISCIPLINES.map((d) => (
              <DisciplineRow key={d} d={d} />
            ))}
          </ol>
          <p className="atl-dis__scale">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100% booked</span>
          </p>

          <h2 className="atl-label atl-label--rule">Studio terms</h2>
          <dl className="atl-facts atl-facts--stack">
            <div>
              <dt>Season</dt>
              <dd>Autumn — Winter 2026</dd>
            </div>
            <div>
              <dt>Bench</dt>
              <dd>4 : 0 : 3 (print : bind : assembly)</dd>
            </div>
            <div>
              <dt>Review</dt>
              <dd>Thursdays, 09:00, studio floor</dd>
            </div>
            <div>
              <dt>Open call</dt>
              <dd>Two commissions per season</dd>
            </div>
          </dl>
          <button type="button" className="atl-btn" onClick={() => go("board")}>
            Go to the production board →
          </button>
        </section>
      </div>
    </div>
  );
}
