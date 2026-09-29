"use client";

/**
 * atelier / components / controls — the two desktop controls this app needs.
 *
 * Both are token-driven and hard-edged: a segmented control is a row of ink
 * boxes where the active one is a solid primary block, and a filter is the
 * same thing with a discipline mark in front of the label.
 */

import type { ReactNode } from "react";
import { Mark } from "./geometry";

/** Segmented control — one is always active (a radio group, not a toggle). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="atl-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`atl-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Filter row with a primitive in front of every label. */
export function FilterBar<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string; mark?: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="atl-filters" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          className={`atl-filter ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.mark ?? <Mark kind="square" tone="ink" size={10} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
