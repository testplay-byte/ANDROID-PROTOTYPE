"use client";

/* pulse / components/controls — small Carbon-flavoured primitives shared
   across screens: the toggle switch, bordered uppercase status/severity
   tags, the status square and the segmented control. */

import type { ReactNode } from "react";
import type { ServiceState } from "../lib/data";

/* ------------------------- Carbon switch ------------------------- */

export function CarbonSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`plu-switch ${checked ? "plu-switch--on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="plu-switch__thumb">
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-fg)" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
            <path d="m4 12 6 6L20 6" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

/* ------------------------- status square ------------------------- */

export function StatusSquare({
  state,
  small = false,
}: {
  state: ServiceState;
  small?: boolean;
}) {
  return (
    <span
      className={`plu-sq plu-sq--${state} ${small ? "plu-sq--sm" : ""}`}
      aria-hidden="true"
    />
  );
}

/* --------------------------- tags ------------------------------ */

export function StateTag({
  children,
  tone,
  compact = false,
}: {
  children: ReactNode;
  tone: "green" | "amber" | "red" | "blue" | "gray";
  compact?: boolean;
}) {
  return (
    <span className={`plu-tag plu-tag--${tone}${compact ? " plu-tag--sm" : ""}`}>
      {children}
    </span>
  );
}

export const SEVERITY_TONE: Record<string, "red" | "amber" | "gray"> = {
  "sev-1": "red",
  "sev-2": "amber",
  "sev-3": "gray",
};

/* --------------------- segmented control ------------------------ */

export interface SegmentOption {
  id: string;
  label: string;
}

export function Segmented({
  options,
  value,
  onSelect,
  ariaLabel,
}: {
  options: SegmentOption[];
  value: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="plu-seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`plu-seg__opt ${o.id === value ? "plu-seg__opt--active" : ""}`}
          aria-pressed={o.id === value}
          onClick={() => onSelect(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------- press button ------------------------- */

export function ActionButton({
  children,
  onClick,
  kind = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`plu-btn plu-btn--${kind}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
