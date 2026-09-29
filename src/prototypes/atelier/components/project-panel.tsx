"use client";

/**
 * atelier / components / project-panel — the detail REGION beside the plate wall.
 *
 * On a desktop window this opens BESIDE the grid: the grid keeps its columns
 * and the plate stays visible while the brief, the scope and the progress are
 * read alongside it. It is not a modal, and it is not a pushed route. Below
 * 900px of surface width the split collapses and the region runs full width
 * under the plates (see atelier.css § 10).
 */

import { DISCIPLINE_LABEL, STATUS_LABEL, workById } from "../data";
import { useAtelier } from "../state/atelier-context";
import { CloseIcon, StickyIcon } from "./icons";
import { Plate } from "./geometry";

export function ProjectPanel() {
  const { selectedWork, selectWork, notify } = useAtelier();
  const work = selectedWork ? workById(selectedWork) : undefined;
  if (!work) return null;

  return (
    <aside className="atl-panel" aria-label={`Plate ${work.plateNo} detail`}>
      <header className="atl-panel__head">
        <div className="atl-panel__plate">
          <Plate plate={work.plate} className="atl-plate--panel" />
        </div>
        <div className="atl-panel__heading">
          <span className="atl-panel__no tnum">PLATE {work.plateNo}</span>
          <h2>{work.title}</h2>
          <p>
            {DISCIPLINE_LABEL[work.discipline]} · {work.client} · {work.year}
          </p>
        </div>
        <button
          type="button"
          className="atl-panel__close"
          aria-label="Close detail region"
          onClick={() => selectWork(null)}
        >
          <CloseIcon size={14} />
        </button>
      </header>

      <p className="atl-panel__summary">{work.summary}</p>

      <dl className="atl-facts">
        <div>
          <dt>Status</dt>
          <dd>
            <span className={`atl-dot atl-dot--${work.status}`} aria-hidden="true" />
            {STATUS_LABEL[work.status]}
          </dd>
        </div>
        <div>
          <dt>Lead</dt>
          <dd>{work.lead}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd className="tnum">{work.due}</dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd className="tnum">{work.progress}%</dd>
        </div>
      </dl>

      <div className="atl-panel__meter" role="img" aria-label={`${work.progress}% complete`}>
        <span className="atl-panel__meterfill" style={{ width: `${work.progress}%` }} />
      </div>

      <h3 className="atl-label">Scope</h3>
      <ul className="atl-scope">
        {work.scope.map((s) => (
          <li key={s}>
            <span className="atl-scope__tick" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>

      <footer className="atl-panel__actions">
        <button
          type="button"
          className="atl-btn atl-btn--ink"
          onClick={() => notify(`Plate ${work.plateNo} added to the print queue`)}
        >
          <StickyIcon size={14} /> Add to print queue
        </button>
        <button type="button" className="atl-btn" onClick={() => notify("Dossier exported as PDF")}>
          Export dossier
        </button>
      </footer>
    </aside>
  );
}
