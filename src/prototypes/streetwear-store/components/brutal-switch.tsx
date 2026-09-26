"use client";

/**
 * BrutalSwitch — brutalist on/off toggle.
 * Bordered square track, primary-yellow fill when on, hard shadow.
 */

import styles from "./brutal-switch.module.css";

export function BrutalSwitch({
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
