/**
 * kids-learning / components / clay-switch — a puffy claymorphism toggle.
 * Idle = raised (--shadow-2), off/pressed = pressed dough (--shadow-inset).
 */
import styles from "./clay-switch.module.css";

export interface ClaySwitchProps {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

export function ClaySwitch({ on, onChange, label }: ClaySwitchProps) {
  return (
    <button
      type="button"
      className={`${styles.switch} ${on ? styles.switchOn : ""}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className={`${styles.knob} ${on ? styles.knobOn : ""}`}>
        {on ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
