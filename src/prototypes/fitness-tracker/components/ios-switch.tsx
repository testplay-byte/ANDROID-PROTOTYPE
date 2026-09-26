"use client";

/**
 * IosSwitch — native iOS toggle switch.
 * 51x31 track, 27px white knob, iOS green (#34c759 → --color-success)
 * when on, neutral gray track when off. No proto-kit switch involved.
 */

import styles from "./ios-switch.module.css";

export function IosSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name (the row title). */
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.switch} ${checked ? styles.on : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.knob} />
    </button>
  );
}
