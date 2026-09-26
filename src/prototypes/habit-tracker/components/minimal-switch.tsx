/**
 * MinimalSwitch — monochrome on/off toggle used on the Settings screen.
 * Bordered pill track; the knob fills with ink (and the track inverts)
 * when on.
 */

import styles from "./minimal-switch.module.css";

export function MinimalSwitch({
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
