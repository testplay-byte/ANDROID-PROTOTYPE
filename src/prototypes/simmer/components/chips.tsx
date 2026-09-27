"use client";

/* simmer / components/chips — the clay chip vocabulary.
   - MetaChip: small read-only pill (time, difficulty, counts)
   - FilterChip: pressable category chip with pressed-in active state
   Chips are where the clay signature lives: idle = --shadow-1 lift,
   active/pressed = translate down + --shadow-inset (shadow collapse). */

import type { ReactNode } from "react";
import { ClockIcon, FlameIcon } from "./icons";
import { DIFFICULTY_LABEL, formatMinutes, type Recipe } from "../lib/data";

export function MetaChip({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="sm-chip sm-chip--meta">
      {icon}
      {children}
    </span>
  );
}

export function RecipeMeta({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <MetaChip icon={<ClockIcon size={13} />}>
        <span className="tnum">{formatMinutes(recipe.minutes)}</span>
      </MetaChip>
      <MetaChip icon={<FlameIcon size={13} />}>
        {DIFFICULTY_LABEL[recipe.difficulty]}
      </MetaChip>
    </>
  );
}

export function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`sm-chip sm-chip--filter${active ? " sm-chip--on" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
      {count !== undefined && <b className="tnum">{count}</b>}
    </button>
  );
}
