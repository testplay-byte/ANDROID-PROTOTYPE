/**
 * chat-app / components / flat-switch — a flat toggle with zero shadows.
 * Track: --color-surface-4 (off) → --color-primary (on). Knob: solid block.
 */
import styles from "./flat-switch.module.css";

export interface FlatSwitchProps {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

export function FlatSwitch({ on, onChange, label }: FlatSwitchProps) {
  return (
    <button
      type="button"
      className={`${styles.switch} ${on ? styles.switchOn : ""}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className={`${styles.knob} ${on ? styles.knobOn : ""}`} />
    </button>
  );
}
