/**
 * BauhausSwitch — sharp-cornered on/off toggle for the Settings screen.
 * Square 2px-bordered track; when on, the track fills with ink and the
 * square knob slides into the tertiary yellow — triad only, no gradients.
 */

import styles from "./bauhaus-switch.module.css";

export function BauhausSwitch({
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
