"use client";

/* plant-card — one plant in the Home collection grid: generated art on a
   tinted panel, name + species, the thirst ring (top-right) and the
   "watered Nd ago" line. Tap opens the plant bottom sheet. */

import type { CSSProperties } from "react";
import type { Plant } from "../lib/data";
import { thirstLabel, thirstOf, wateredAgo } from "../lib/data";
import { PlantArt } from "./plant-art";
import { ProgressRing } from "./progress-ring";

interface PlantCardProps {
  plant: Plant;
  index: number;
  onOpen: (id: string) => void;
}

export function PlantCard({ plant, index, onOpen }: PlantCardProps) {
  const thirst = thirstOf(plant);

  return (
    <button
      type="button"
      className="bl-pcard"
      style={{ ["--stagger" as string]: `${index * 60}ms` } as CSSProperties}
      onClick={() => onOpen(plant.id)}
      aria-label={`${plant.name} — ${thirstLabel(thirst)}`}
    >
      <span className="bl-pcard__art">
        <PlantArt shape={plant.shape} pot={plant.pot} />
      </span>
      <ProgressRing
        thirst={thirst}
        popKey={`${plant.id}-${plant.daysSinceWatered}`}
        size={38}
        stroke={4}
        className="bl-pcard__ring"
      />
      <span className="bl-pcard__text">
        <span className="bl-pcard__name">{plant.name}</span>
        <span className="bl-pcard__species">{plant.species}</span>
        <span className="bl-pcard__ago">{wateredAgo(plant.daysSinceWatered)}</span>
      </span>
    </button>
  );
}
