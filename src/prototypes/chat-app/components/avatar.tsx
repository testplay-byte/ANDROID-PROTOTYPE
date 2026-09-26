/**
 * chat-app / components / avatar — initials in a flat saturated circle.
 * ZERO shadows: depth comes from the saturated color block alone.
 */
import styles from "./avatar.module.css";
import type { AccentRole } from "../lib/types";

/** Token role → CSS custom property. */
const ACCENT_VAR: Record<AccentRole, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
  error: "var(--color-error)",
  success: "var(--color-success)",
  warn: "var(--color-warn)",
};

export interface AvatarProps {
  initials: string;
  accent: AccentRole;
  size?: number;
}

export function Avatar({ initials, accent, size = 46 }: AvatarProps) {
  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: ACCENT_VAR[accent],
        fontSize: size <= 40 ? "var(--fs-label)" : "var(--fs-body-l)",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
