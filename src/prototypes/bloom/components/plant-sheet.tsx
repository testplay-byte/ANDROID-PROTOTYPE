"use client";

/* plant-sheet — the plant detail bottom sheet: big art, live thirst ring,
   care facts (light / water / temp) and the "Water now" action that
   completes a watering (ring springs back, button flips to the done
   state, toast confirms). */

import { useMemo } from "react";
import { useBloom } from "../state/bloom-context";
import { daysUntilWater, thirstLabel, thirstOf, wateredAgo } from "../lib/data";
import { BottomSheet } from "./bottom-sheet";
import { PlantArt } from "./plant-art";
import { ProgressRing } from "./progress-ring";
import { CheckIcon, DropIcon, SunIcon, ThermIcon } from "./icons";

export function PlantSheet() {
  const { plants, selectedPlantId, selectPlant, waterPlant, checks } = useBloom();
  const plant = useMemo(
    () => plants.find((p) => p.id === selectedPlantId) ?? null,
    [plants, selectedPlantId],
  );
  if (!plant) return null;

  function close() {
    selectPlant(null);
  }

  const thirst = thirstOf(plant);
  const due = daysUntilWater(plant);
  const done = plant.daysSinceWatered === 0;
  const dueLine = done
    ? "rested today"
    : due > 1
      ? `due in ${due}d`
      : due === 1
        ? "due tomorrow"
        : "due today";
  const checkedOff = checks.includes(plant.id);

  return (
    <BottomSheet open onClose={close} labelId="bl-sheet-plant-title" title="Plant details">
      <div className="bl-psheet">
        <div className="bl-psheet__stage">
          <PlantArt shape={plant.shape} pot={plant.pot} className="bl-psheet__art" />
          <ProgressRing
            thirst={thirst}
            popKey={`${plant.id}-${plant.daysSinceWatered}`}
            size={54}
            stroke={5}
            className="bl-psheet__ring"
          />
        </div>
        <h3 className="bl-psheet__name">
          {plant.name}
        </h3>
        <p className="bl-psheet__species">{plant.species}</p>
        <p className="bl-psheet__thirst">
          <b>{thirstLabel(thirst)}</b> · {dueLine} · {wateredAgo(plant.daysSinceWatered)}
        </p>

        <div className="bl-facts" role="list" aria-label="Care facts">
          <div className="bl-fact" role="listitem">
            <span className="bl-fact__ic bl-fact__ic--light">
              <SunIcon size={16} />
            </span>
            <span className="bl-fact__k">Light</span>
            <span className="bl-fact__v">{plant.light}</span>
          </div>
          <div className="bl-fact" role="listitem">
            <span className="bl-fact__ic bl-fact__ic--water">
              <DropIcon size={16} />
            </span>
            <span className="bl-fact__k">Water</span>
            <span className="bl-fact__v">
              every {plant.intervalDays}d
            </span>
          </div>
          <div className="bl-fact" role="listitem">
            <span className="bl-fact__ic bl-fact__ic--temp">
              <ThermIcon size={16} />
            </span>
            <span className="bl-fact__k">Temp</span>
            <span className="bl-fact__v">{plant.temp}</span>
          </div>
        </div>

        <button
          type="button"
          className={"bl-btn-filled" + (done ? " is-done" : "")}
          disabled={done}
          onClick={() => waterPlant(plant.id)}
        >
          {done ? (
            <>
              <CheckIcon size={18} strokeWidth={2.8} />
              Watered — looking happy
            </>
          ) : (
            <>
              <DropIcon size={18} />
              Water now
            </>
          )}
        </button>
        {done && !checkedOff ? (
          <p className="bl-psheet__hint">Tip: tick it off in Today&apos;s schedule to keep your streak.</p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
