"use client";

/**
 * HabitsScreen — list of habits with an edit affordance. Tapping a row
 * (or its Edit label) expands an inline editor; "New habit" opens the
 * same inline form in add mode. Deleting happens from the editor.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { HabitIcon } from "../components/habit-icon";
import { HabitForm } from "../components/habit-form";
import type { Habit, HabitDraft } from "../lib/types";
import { ICON_LABELS } from "../lib/icons";
import styles from "./habits-screen.module.css";

type EditingId = number | "new" | null;

export function HabitsScreen({
  habits,
  onAdd,
  onUpdate,
  onDelete,
}: {
  habits: Habit[];
  onAdd: (draft: HabitDraft) => void;
  onUpdate: (id: number, patch: Partial<Habit>) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState<EditingId>(null);

  function close() {
    setEditing(null);
  }

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Habits" subtitle={`${habits.length} active`} />

      <div
        className={`${styles.content} ${
          editing === "new" ? styles.editorOpen : ""
        }`}
      >
        <div className={styles.list}>
        {habits.map((h) => {
          const isOpen = editing === h.id;
          return (
            <div key={h.id} className={styles.item}>
              <button
                type="button"
                className={`${styles.row} ${isOpen ? styles.rowActive : ""}`}
                onClick={() => setEditing(isOpen ? null : h.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.icon}>
                  <HabitIcon icon={h.icon} size={20} />
                </span>
                <span className={styles.meta}>
                  <span className={styles.name}>{h.name}</span>
                  <span className={styles.caption}>
                    {h.targetDays} days / week · {ICON_LABELS[h.icon]}
                  </span>
                </span>
                <span className={styles.edit}>Edit</span>
              </button>

              {isOpen && (
                <div className={styles.editor}>
                  <HabitForm
                    initial={{
                      name: h.name,
                      icon: h.icon,
                      targetDays: h.targetDays,
                    }}
                    onSave={(draft) => {
                      onUpdate(h.id, draft);
                      close();
                    }}
                    onCancel={close}
                    onDelete={() => {
                      onDelete(h.id);
                      close();
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {editing === "new" ? (
          <div className={styles.item}>
            <div className={styles.editor}>
              <HabitForm
                saveLabel="Add habit"
                onSave={(draft) => {
                  onAdd(draft);
                  close();
                }}
                onCancel={close}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.newRow}
            onClick={() => setEditing("new")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New habit
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
