/**
 * habit-tracker / lib/icons — icon registry for the habit icon picker.
 */

import type { IconId } from "./types";

export const ICON_IDS: IconId[] = [
  "run",
  "read",
  "water",
  "meditate",
  "sleep",
  "code",
];

export const ICON_LABELS: Record<IconId, string> = {
  run: "Run",
  read: "Read",
  water: "Water",
  meditate: "Meditate",
  sleep: "Sleep",
  code: "Code",
};
