/**
 * HabitIcon — the 6 inline stroke SVGs a habit can use.
 * stroke="currentColor" so it inherits the surrounding ink.
 */

import type { ReactNode } from "react";
import type { IconId } from "../lib/types";

const PATHS: Record<IconId, ReactNode> = {
  run: (
    <>
      <circle cx="15.5" cy="4.5" r="2" />
      <path d="M13 8.5 9.5 11.5l2.5 3.5-1.5 5.5" />
      <path d="M13 8.5 17.5 10l2 3.5" />
      <path d="m5.5 21.5 4-5" />
      <path d="M4.5 12.5 8 11.5l3 2.5" />
    </>
  ),
  read: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  water: (
    <>
      <path d="M12 2.7 6.7 8.9a6.5 6.5 0 1 0 10.6 0z" />
    </>
  ),
  meditate: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 8.5v5" />
      <path d="m12 13.5-5.5 4.5" />
      <path d="m12 13.5 5.5 4.5" />
      <path d="M3.5 11.5c2.2 2.2 5.2 3.5 8.5 3.5s6.3-1.3 8.5-3.5" />
    </>
  ),
  sleep: (
    <>
      <path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4-3 16" />
    </>
  ),
};

export function HabitIcon({ icon, size = 20 }: { icon: IconId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[icon]}
    </svg>
  );
}
