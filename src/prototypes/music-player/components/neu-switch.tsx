"use client";

/**
 * NeuSwitch — a neumorphic toggle switch.
 *
 * OFF: carved into the surface — --shadow-inset, --color-bg track.
 * ON:  extruded + primary — --shadow-1 track filled with --color-primary,
 *      knob pops out with a small raised shadow.
 */

import styles from "./neu-switch.module.css";

export function NeuSwitch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`${styles.switch} ${on ? styles.on : ""}`}
      onClick={onChange}
    >
      <span className={styles.knob} />
    </button>
  );
}
