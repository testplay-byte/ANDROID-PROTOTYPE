/**
 * telemetry / components / controls — small Carbon primitives shared by the
 * screens: the status square, the bordered tag, the Carbon toggle, the
 * segmented control, the stepper and the filter chip.
 *
 * The OFF state of the toggle carries an explicit "OFF" label so it reads in
 * BOTH Carbon themes — in light mode a gray track on a white card is
 * otherwise too quiet to notice.
 */

import type { ReactNode } from "react";
import type { ServiceState } from "../data";
import { MinusIcon, PlusIcon } from "./icons";

/* ------------------------- status square ------------------------- */

export function StatusSquare({ state, small = false }: { state: ServiceState; small?: boolean }) {
  return <span className={`tel-sq tel-sq--${state}${small ? " tel-sq--sm" : ""}`} aria-hidden="true" />;
}

/* ------------------------------ tags ----------------------------- */

export type TagTone = "red" | "amber" | "green" | "blue" | "gray";

export function Tag({ children, tone }: { children: ReactNode; tone: TagTone }) {
  return <span className={`tel-tag tel-tag--${tone}`}>{children}</span>;
}

export const SEVERITY_TONE: Record<string, TagTone> = {
  "sev-1": "red",
  "sev-2": "amber",
  "sev-3": "gray",
};

/* -------------------------- Carbon switch ------------------------- */

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <span className="tel-setrow__ctrl">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`tel-switch${checked ? " is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="tel-switch__thumb" />
      </button>
      <span className="tel-switch__state">{checked ? "ON" : "OFF"}</span>
    </span>
  );
}

/* ---------------------- segmented control ------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onSelect,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="tel-seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`tel-seg__btn${o.id === value ? " is-on" : ""}`}
          aria-pressed={o.id === value}
          onClick={() => onSelect(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------- stepper ---------------------------- */

export function Stepper({
  value,
  min,
  max,
  step,
  format,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <span className="tel-stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="tel-stepper__btn"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <MinusIcon />
      </button>
      <span className="tel-stepper__val">{format(value)}</span>
      <button
        type="button"
        className="tel-stepper__btn"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <PlusIcon />
      </button>
    </span>
  );
}

/** Filter chip */
export function Chip({
  label,
  count,
  on,
  onClick,
}: {
  label: string;
  count?: number;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`tel-chip${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick}>
      {label}
      {count !== undefined && <span className="tel-chip__n tnum">{count}</span>}
    </button>
  );
}
