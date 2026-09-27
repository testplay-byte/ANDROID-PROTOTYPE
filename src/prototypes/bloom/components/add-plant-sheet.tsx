"use client";

/* add-plant-sheet — FAB target: pick one of the preset species and it
   joins the collection (stateful via BloomProvider + persisted). */

import type { CSSProperties } from "react";
import { useBloom } from "../state/bloom-context";
import { SPECIES_PRESETS } from "../lib/data";
import { BottomSheet } from "./bottom-sheet";
import { PlantArt } from "./plant-art";
import { PlusIcon } from "./icons";

export function AddPlantSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPlant } = useBloom();

  return (
    <BottomSheet open={open} onClose={onClose} labelId="bl-sheet-add-title" title="Add a plant">
      <p className="bl-asheet__lead">Choose a new housemate — it lands straight in your collection.</p>
      <ul className="bl-asheet__list" aria-labelledby="bl-sheet-add-title">
        {SPECIES_PRESETS.map((preset, i) => (
          <li key={preset.species}>
            <button
              type="button"
              className="bl-species"
              style={{ ["--stagger" as string]: `${i * 45}ms` } as CSSProperties}
              onClick={() => addPlant(preset)}
            >
              <span className="bl-species__art">
                <PlantArt shape={preset.shape} pot={preset.pot} />
              </span>
              <span className="bl-species__text">
                <span className="bl-species__name">{preset.common}</span>
                <span className="bl-species__latin">{preset.species}</span>
              </span>
              <span className="bl-species__meta">every {preset.intervalDays}d</span>
              <span className="bl-species__add" aria-hidden="true">
                <PlusIcon size={16} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
