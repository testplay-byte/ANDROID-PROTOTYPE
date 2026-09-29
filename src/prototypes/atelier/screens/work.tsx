"use client";

/**
 * atelier / screens / work — the plate wall.
 *
 * Desktop-only layout: a multi-column grid of square geometric plates, a
 * discipline filter that re-filters the wall in place, and a detail REGION
 * that opens beside the grid instead of over it. On a phone this would be a
 * vertical list with a pushed detail screen — a different app, which is why
 * this one is not the phone prototype stretched.
 */

import { DISCIPLINES, DISCIPLINE_LABEL, DISCIPLINE_TONE, STUDIO, WORKS } from "../data";
import { useAtelier } from "../state/atelier-context";
import { FilterBar } from "../components/controls";
import { Plate, Mark } from "../components/geometry";
import { ProjectPanel } from "../components/project-panel";

export function WorkScreen() {
  const { discipline, setDiscipline, filteredWorks, selectedWork, selectWork, notify } = useAtelier();

  return (
    <div className="atl-view atl-view--split" data-split={selectedWork ? "on" : "off"}>
      <div className="atl-wall">
        {/* studio figures — a constructivist band, not a KPI dashboard */}
        <div className="atl-strip">
          <div className="atl-strip__cell">
            <b className="tnum">{STUDIO.openCommissions}</b>
            <span>Open commissions</span>
          </div>
          <div className="atl-strip__cell">
            <b className="tnum">{STUDIO.platesThisSeason}</b>
            <span>Plates this season</span>
          </div>
          <div className="atl-strip__cell">
            <b className="tnum">{STUDIO.installedThisYear}</b>
            <span>Installed this year</span>
          </div>
          <div className="atl-strip__cell">
            <b className="tnum">{STUDIO.printHoursLeft}h</b>
            <span>Print hours left</span>
          </div>
        </div>

        <div className="atl-wall__bar">
          <FilterBar
            label="Filter by discipline"
            value={discipline}
            onChange={setDiscipline}
            options={[
              { id: "all" as const, label: "All" },
              ...DISCIPLINES.map((d) => ({
                id: d,
                label: DISCIPLINE_LABEL[d],
                mark: <Mark kind="circle" tone={DISCIPLINE_TONE[d]} size={10} />,
              })),
            ]}
          />
          <span className="atl-wall__count tnum">
            {filteredWorks.length}/{WORKS.length} plates
          </span>
        </div>

        <div className="atl-grid">
          {filteredWorks.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`atl-card ${selectedWork === w.id ? "is-on" : ""}`}
              data-discipline={w.discipline}
              aria-pressed={selectedWork === w.id}
              onClick={() => selectWork(selectedWork === w.id ? null : w.id)}
            >
              <span className="atl-card__no tnum">{w.plateNo}</span>
              <span className="atl-card__plate">
                <Plate plate={w.plate} />
              </span>
              <span className="atl-card__title">{w.title}</span>
              <span className="atl-card__meta">
                {DISCIPLINE_LABEL[w.discipline]} · {w.year}
              </span>
              <span className="atl-card__bar" aria-hidden="true">
                <i style={{ width: `${w.progress}%` }} />
              </span>
            </button>
          ))}
          {filteredWorks.length === 0 && (
            <p className="atl-empty">
              No plates filed under {discipline === "all" ? "this filter" : DISCIPLINE_LABEL[discipline]}.
            </p>
          )}
        </div>

        <footer className="atl-wall__foot">
          <span className="tnum">{filteredWorks.length} of {WORKS.length} shown</span>
          <span>
            <button
              type="button"
              className="atl-linkbtn"
              onClick={() => {
                setDiscipline("all");
                notify("Wall reset to all plates");
              }}
            >
              Reset filter
            </button>
          </span>
        </footer>
      </div>

      <ProjectPanel />
    </div>
  );
}
