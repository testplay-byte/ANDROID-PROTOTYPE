"use client";

/* atlas / screens / pack — the checklist as a bento.

   Grouping is spatial, not vertical: Essentials spans the full width
   (the 2x2 of the layout — it is where the work happens), Tech and Docs
   sit as equal 1x1 tiles below. Every item is a cell; checking it fills
   the cell with the accent and strikes the label. Progress is per-trip
   and persisted (atlas-pack-v1), with a master reset for the trip. */

import { useState } from "react";
import { useAtlas } from "../state/atlas-context";
import { Tile, TileHead } from "../components/tile";
import { BagIcon, CheckIcon } from "../components/icons";
import { PACK_GROUPS, packTotal } from "../lib/data";

export function PackScreen() {
  const { trip, isPacked, togglePacked, packedCount, showToast } = useAtlas();
  const [resetArm, setResetArm] = useState(false);

  const total = packTotal();
  const done = packedCount(trip.id);
  const pct = Math.round((done / total) * 100);

  return (
    <div className="at-screen at-screen-pack">
      {/* progress banner */}
      <Tile wide i={0} className="at-packhead">
        <div className="at-packhead-txt">
          <TileHead icon={<BagIcon size={15} strokeWidth={2.2} />} title={`Packing · ${trip.city}`} />
          <div className="at-packhead-num">
            <span className="at-packhead-done tnum">{done}</span>
            <span className="at-packhead-of tnum">/ {total}</span>
            <span className="at-packhead-pct tnum">{pct}%</span>
          </div>
        </div>
        <div className="at-packbig" aria-hidden="true">
          <div className="at-packbig-fill" style={{ width: `${pct}%` }} />
        </div>
      </Tile>

      {PACK_GROUPS.map((g, gi) => (
        <Tile
          key={g.id}
          wide={g.span === "hero"}
          i={gi + 1}
          className={"at-packgroup" + (g.span === "hero" ? " at-packgroup-hero" : "")}
        >
          <div className="at-packgroup-head">
            <span className="at-packgroup-label">{g.label}</span>
            <span className="at-packgroup-count tnum">
              {g.items.filter((_, idx) => isPacked(trip.id, `${g.id}:${idx}`)).length}
              <span className="at-packgroup-of">/{g.items.length}</span>
            </span>
          </div>
          <ul className={"at-cells" + (g.span === "hero" ? " at-cells-2" : " at-cells-1")}>
            {g.items.map((item, idx) => {
              const id = `${g.id}:${idx}`;
              const on = isPacked(trip.id, id);
              return (
                <li key={item}>
                  <button
                    type="button"
                    className={"at-cell" + (on ? " on" : "")}
                    aria-pressed={on}
                    onClick={() => {
                      togglePacked(trip.id, id);
                      setResetArm(false);
                      if (!on) showToast(`${item} packed`, "check");
                    }}
                  >
                    <span className="at-cell-check" aria-hidden="true">
                      {on ? <CheckIcon size={11} strokeWidth={3} /> : null}
                    </span>
                    <span className="at-cell-label">{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Tile>
      ))}

      <Tile wide i={PACK_GROUPS.length + 1} className="at-packreset">
        <button
          type="button"
          className={"at-reset-btn" + (resetArm ? " armed" : "")}
          onClick={() => {
            if (!resetArm) {
              setResetArm(true);
              showToast(`Tap again to clear ${trip.city}'s list`, "bag");
              window.setTimeout(() => setResetArm(false), 3000);
            } else {
              PACK_GROUPS.forEach((g) =>
                g.items.forEach((_, idx) => {
                  if (isPacked(trip.id, `${g.id}:${idx}`))
                    togglePacked(trip.id, `${g.id}:${idx}`);
                })
              );
              setResetArm(false);
              showToast(`Packing list for ${trip.city} cleared`, "bag");
            }
          }}
        >
          {resetArm ? "Confirm reset" : "Reset list for this trip"}
        </button>
      </Tile>
    </div>
  );
}
