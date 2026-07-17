"use client";

/**
 * anime-app / components / library-customize-sheet — bottom sheet for
 * customizing the Library page's look and feel.
 *
 * Options:
 *   - Layout: Grid | List
 *   - Columns (grid only): 2 | 3 | 4 | 5
 *   - Text placement (grid only): Below cover | On cover
 *
 * All changes apply live (via useSettings context) and persist to
 * localStorage. The sheet slides up from the bottom with a scrim backdrop.
 */
import { useSettings } from "../hooks/use-settings";
import type { LibraryLayout, LibraryTextPlacement } from "../lib/types";
import styles from "./library-customize-sheet.module.css";

interface LibraryCustomizeSheetProps {
  open: boolean;
  onClose: () => void;
}

export function LibraryCustomizeSheet({ open, onClose }: LibraryCustomizeSheetProps) {
  const { settings, update } = useSettings();

  return (
    <>
      {/* Scrim */}
      <div
        className={`${styles.scrim} ${open ? styles.scrimIsOpen : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Sheet */}
      <div
        className={`${styles.sheet} ${open ? styles.sheetIsOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Customize library"
        aria-hidden={!open}
      >
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2 className={styles.title}>Customize Library</h2>
        </div>

        <div className={styles.body}>
          {/* Layout */}
          <Section label="Layout">
            <Segmented
              options={[
                { value: "grid", label: "Grid", icon: <GridIcon /> },
                { value: "list", label: "List", icon: <ListIcon /> },
              ]}
              value={settings.libraryLayout}
              onChange={(v) => update({ libraryLayout: v as LibraryLayout })}
            />
          </Section>

          {/* Columns — only in grid mode */}
          {settings.libraryLayout === "grid" && (
            <Section label="Columns per row">
              <Segmented
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                ]}
                value={String(settings.libraryColumns)}
                onChange={(v) => update({ libraryColumns: parseInt(v, 10) })}
              />
            </Section>
          )}

          {/* Text placement — only in grid mode */}
          {settings.libraryLayout === "grid" && (
            <Section label="Text placement">
              <Segmented
                options={[
                  { value: "below", label: "Below cover" },
                  { value: "overlay", label: "On cover" },
                ]}
                value={settings.libraryTextPlacement}
                onChange={(v) =>
                  update({ libraryTextPlacement: v as LibraryTextPlacement })
                }
              />
            </Section>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>{label}</span>
      {children}
    </div>
  );
}

interface SegOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.segmented} role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`${styles.segBtn} ${value === opt.value ? styles.segBtnIsActive : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <span className={styles.segIcon}>{opt.icon}</span>}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
