"use client";

/**
 * CarbonSwitch — custom Carbon-style toggle.
 * Bordered flat track (0 radius), knob slides right; track + knob go
 * primary IBM blue when on. Fast, no bounce (100–150ms).
 */

import styles from "./carbon-switch.module.css";

export function CarbonSwitch({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`${styles.track} ${on ? styles.trackOn : ""}`}
      onClick={onToggle}
    >
      <span className={`${styles.knob} ${on ? styles.knobOn : ""}`} />
    </button>
  );
}
