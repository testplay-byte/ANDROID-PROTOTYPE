/**
 * HabitForm — inline form for adding or editing a habit.
 * Name input, icon picker (6 inline SVGs), target-days-per-week stepper.
 * When `onDelete` is given (edit mode) a delete button appears.
 */

import { useState } from "react";
import type { HabitDraft, IconId } from "../lib/types";
import { ICON_IDS, ICON_LABELS } from "../lib/icons";
import { HabitIcon } from "./habit-icon";
import styles from "./habit-form.module.css";

export function HabitForm({
  initial,
  saveLabel = "Save",
  onSave,
  onCancel,
  onDelete,
}: {
  initial?: HabitDraft;
  saveLabel?: string;
  onSave: (draft: HabitDraft) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState<IconId>(initial?.icon ?? "run");
  const [target, setTarget] = useState(initial?.targetDays ?? 5);

  const canSave = name.trim().length > 0;

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="habit-name">
          Name
        </label>
        <input
          id="habit-name"
          className={styles.input}
          type="text"
          value={name}
          maxLength={40}
          placeholder="e.g. Stretch 5 min"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Icon</span>
        <div className={styles.icons}>
          {ICON_IDS.map((id) => (
            <button
              key={id}
              type="button"
              title={ICON_LABELS[id]}
              aria-label={ICON_LABELS[id]}
              aria-pressed={icon === id}
              className={`${styles.iconBtn} ${icon === id ? styles.iconBtnActive : ""}`}
              onClick={() => setIcon(id)}
            >
              <HabitIcon icon={id} size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Target</span>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label="Decrease target"
            disabled={target <= 1}
            onClick={() => setTarget((t) => Math.max(1, t - 1))}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 7h10" />
            </svg>
          </button>
          <span className={styles.stepVal}>
            {target}
            <span className={styles.stepUnit}>days / week</span>
          </span>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label="Increase target"
            disabled={target >= 7}
            onClick={() => setTarget((t) => Math.min(7, t + 1))}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 7h10M7 2v10" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.save}
          disabled={!canSave}
          onClick={() => onSave({ name: name.trim(), icon, targetDays: target })}
        >
          {saveLabel}
        </button>
        {onDelete ? (
          <button type="button" className={styles.delete} onClick={onDelete}>
            Delete
          </button>
        ) : null}
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
