"use client";

/* simmer / components/picker-sheet — choose what fills a plan slot.
   Opens from Plan's empty/filled slots; picking a recipe writes it into
   the week (persisted) and re-derives the shopping list. */

import { Sheet } from "./sheet";
import { DishArt } from "./dish-art";
import { CheckIcon, CloseIcon } from "./icons";
import { useSimmer } from "../state/simmer-context";
import { RECIPES, formatMinutes } from "../lib/data";

export function PickerSheet() {
  const { pickerSlot, openPicker, plan, setPlanSlot, showToast } = useSimmer();
  if (!pickerSlot) return null;

  const { day, slot } = pickerSlot;
  const current = plan[day][slot];
  const slotLabel = slot === "midday" ? "Midday" : "Evening";

  function pick(id: string | null) {
    setPlanSlot(day, slot, id);
    openPicker(null);
    const r = id ? RECIPES.find((x) => x.id === id) : null;
    showToast(r ? `${day} ${slotLabel}: ${r.name}` : `${day} ${slotLabel} cleared`, "check");
  }

  return (
    <Sheet open title={`Plan ${day} · ${slotLabel}`} onClose={() => openPicker(null)}>
      <button type="button" className="sm-pick-clear" onClick={() => pick(null)}>
        <CloseIcon size={14} /> Leave this slot empty
      </button>
      <ul className="sm-pick-list">
        {RECIPES.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className={`sm-pick-row${current === r.id ? " sm-pick-row--on" : ""}`}
              onClick={() => pick(r.id)}
            >
              <span className="sm-pick-art">
                <DishArt recipe={r} />
              </span>
              <span className="sm-pick-txt">
                <b>{r.name}</b>
                <small className="tnum">
                  {formatMinutes(r.minutes)} · {r.category}
                </small>
              </span>
              {current === r.id && (
                <span className="sm-pick-check">
                  <CheckIcon size={13} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
