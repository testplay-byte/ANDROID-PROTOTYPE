"use client";

/**
 * halo / components / controls — the small neumorphic atoms the views share.
 *
 * Every one of them is shaped by the shadow recipe in halo.css (raised =
 * --neu-raise, pressed = --neu-press) rather than by a border, which is the
 * whole point of the language. Nothing here owns state.
 */

import type { ReactNode } from "react";
import { ADJUSTABLE, KIND_LABEL, type Device } from "../data";
import { DeviceIcon, MinusIcon, PlusIcon } from "./icons";

/* --------------------------------------------------------------- a stat */

export function StatTile({
  label,
  value,
  unit,
  sub,
  tone,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  tone?: "up" | "down" | "flat";
  icon?: ReactNode;
}) {
  return (
    <article className="halo-stat halo-raised" data-tone={tone ?? "flat"}>
      <span className="halo-stat__label">
        {icon && (
          <span className="halo-stat__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </span>
      <strong className="halo-stat__value tnum">
        {value}
        {unit && <em className="halo-stat__unit">{unit}</em>}
      </strong>
      {sub && <span className="halo-stat__sub">{sub}</span>}
    </article>
  );
}

/* ------------------------------------------------------------ a legend */

export function Legend({ items }: { items: { label: string; on: boolean }[] }) {
  return (
    <ul className="halo-legend" aria-hidden="true">
      {items.map((i) => (
        <li key={i.label} data-on={i.on || undefined}>
          <i aria-hidden="true" />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------- a section head */

export function CardHead({
  title,
  desc,
  meta,
  action,
}: {
  title: string;
  desc?: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <header className="halo-card__head">
      <div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {action ?? (meta ? <span className="halo-card__meta tnum">{meta}</span> : null)}
    </header>
  );
}

/* ------------------------------------------------- the power-state button
   One control for every device, in both the home grid and the drawer:
   raised and empty when off, CARVED when on. Carving is how neumorphism
   says "this is engaged" without ever drawing a border. */

export function PowerButton({
  device,
  onToggle,
  size = "md",
}: {
  device: Device;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const on = device.on;
  return (
    <button
      type="button"
      className={`halo-power halo-power--${size} ${on ? "is-on" : ""}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={`${device.name} — turn ${on ? "off" : "on"}`}
      title={on ? "Turn off" : "Turn on"}
    >
      <DeviceIcon kind={device.kind} size={size === "lg" ? 22 : size === "sm" ? 15 : 18} />
    </button>
  );
}

/* ------------------------------------------------ the value well (dial)
   A carved groove with a stepper on each side. Used for the dimmable and
   measurable kinds; the other kinds simply do not render one. */

export function ValueWell({
  device,
  onNudge,
}: {
  device: Device;
  onNudge: (dir: 1 | -1) => void;
}) {
  if (!ADJUSTABLE[device.kind]) {
    return (
      <p className="halo-well halo-well--static halo-press">
        <span className="halo-well__label">{KIND_LABEL[device.kind]}</span>
        <b className="tnum">{device.on ? "Active" : "Idle"}</b>
      </p>
    );
  }

  const pct = ((device.value - device.min) / (device.max - device.min)) * 100;
  return (
    <div className="halo-wellrow">
      <button
        type="button"
        className="halo-step halo-raised"
        onClick={() => onNudge(-1)}
        disabled={device.value <= device.min}
        aria-label={`${device.name} down`}
      >
        <MinusIcon size={14} />
      </button>
      <p className="halo-well halo-press">
        <span className="halo-well__label">{KIND_LABEL[device.kind]}</span>
        <b className="tnum">
          {device.value}
          <em>{device.unit}</em>
        </b>
        <i className="halo-well__fill" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </p>
      <button
        type="button"
        className="halo-step halo-raised"
        onClick={() => onNudge(1)}
        disabled={device.value >= device.max}
        aria-label={`${device.name} up`}
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- a chip */

export function Chip({ children, tone = "mute" }: { children: ReactNode; tone?: "mute" | "on" | "warn" | "off" }) {
  return (
    <span className="halo-chip" data-tone={tone}>
      {children}
    </span>
  );
}
