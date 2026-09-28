"use client";

/**
 * quill / screens / settings — the two-column desktop form.
 *
 *   [ section list ] [ the selected section's controls ]
 *
 * A phone settings screen is one scrolling list with everything inline. On the
 * desktop the sections become a sidebar-of-sections and the controls get room
 * to explain themselves — the section list is local UI state, the values are
 * not (theme is the device theme, font size and sort are the provider's).
 */

import { useState, type ReactNode } from "react";
import { useDeviceTheme } from "../../../../src/proto-kit";
import { TAGS } from "../data";
import { FONT_SIZES, SORTS, useQuill, type EditorSize, type SortKey } from "../state/quill-context";
import { KeyboardIcon, MoonIcon, SlidersIcon, SparkIcon } from "../components/icons";

type SectionId = "appearance" | "editor" | "keyboard" | "data";

const SECTIONS: { id: SectionId; label: string; icon: ReactNode; blurb: string }[] = [
  { id: "appearance", label: "Appearance", icon: <MoonIcon size={17} />, blurb: "Light or dark, scoped to this window." },
  { id: "editor", label: "Editor", icon: <SparkIcon size={17} />, blurb: "How the note view is set." },
  { id: "keyboard", label: "Keyboard", icon: <KeyboardIcon size={17} />, blurb: "The desktop shortcuts." },
  { id: "data", label: "Data", icon: <SlidersIcon size={17} />, blurb: "Demo content and preferences." },
];

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "/", action: "Focus the library search field" },
  { keys: "1 – 4", action: "Jump to Library / Note / Search / Settings" },
  { keys: "↑ ↓", action: "Move between notes in the library list" },
  { keys: "↵", action: "Open the selected note in the editor" },
  { keys: "Esc", action: "Clear the search, then the filters, then the query" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="ql-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`ql-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsScreen() {
  const { fontSize, setFontSize, sort, setSort, notes, resetAll, notify, counts } = useQuill();
  const { theme, setTheme } = useDeviceTheme();
  const [section, setSection] = useState<SectionId>("appearance");
  const current = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
  const size = FONT_SIZES.find((f) => f.id === fontSize) ?? FONT_SIZES[1];

  return (
    <div className="ql-view ql-settings">
      <div className="ql-settings__grid">
        {/* ---- column 1: the section list ---- */}
        <nav className="ql-sections" aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`ql-sectionbtn ${section === s.id ? "is-on" : ""}`}
              aria-current={section === s.id ? "true" : undefined}
              onClick={() => setSection(s.id)}
            >
              <span className="ql-sectionbtn__icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="ql-sectionbtn__label">{s.label}</span>
            </button>
          ))}
          <p className="ql-sections__note">{current.blurb}</p>
        </nav>

        {/* ---- column 2: the form ---- */}
        <div className="ql-panels">
          {section === "appearance" && (
            <section className="ql-card">
              <header className="ql-card__head">
                <h2>Appearance</h2>
                <span className="ql-card__meta">HIG · system blue accent</span>
              </header>
              <div className="ql-field">
                <label>Theme</label>
                <Segmented
                  label="Theme"
                  value={theme}
                  onChange={(t) => setTheme(t)}
                  options={[
                    { id: "dark", label: "Dark" },
                    { id: "light", label: "Light" },
                  ]}
                />
                <p className="ql-field__hint">
                  Scoped to the Quill window — the stage around it keeps its own neutral palette.
                  Remembered as <code>quill-theme</code>.
                </p>
              </div>
              <div className="ql-field">
                <label>Surfaces</label>
                <p className="ql-field__hint">
                  Dark is true black with grouped gray cards; light is a soft gray canvas with
                  white cards. Both come from the HIG token layer, so the hairline borders and the
                  system blue stay the same in each.
                </p>
              </div>
            </section>
          )}

          {section === "editor" && (
            <section className="ql-card">
              <header className="ql-card__head">
                <h2>Editor</h2>
                <span className="ql-card__meta">Applies to the Note view only</span>
              </header>
              <div className="ql-field">
                <label>Font size</label>
                <Segmented
                  label="Editor font size"
                  value={fontSize}
                  onChange={(s: EditorSize) => {
                    setFontSize(s);
                    notify(`Editor set to ${s}`);
                  }}
                  options={FONT_SIZES.map((f) => ({ id: f.id, label: f.label }))}
                />
                <p className="ql-field__hint">{size.hint} — remembered as <code>quill-font-v1</code>.</p>
                <div className="ql-sizepreview" data-size={fontSize}>
                  <p className="ql-previewtitle">Reading text stays at the same rhythm</p>
                  <p className="ql-previewpara">
                    The size changes the whole editor column — title, body, checklist and quotes
                    scale together, so a long note is still comfortable to read.
                  </p>
                </div>
              </div>
              <div className="ql-field">
                <label>Default library sort</label>
                <Segmented
                  label="Default sort"
                  value={sort}
                  onChange={(s: SortKey) => setSort(s)}
                  options={SORTS.map((s) => ({ id: s.id, label: s.label }))}
                />
                <p className="ql-field__hint">Used the next time the library opens.</p>
              </div>
            </section>
          )}

          {section === "keyboard" && (
            <section className="ql-card">
              <header className="ql-card__head">
                <h2>Keyboard</h2>
                <span className="ql-card__meta">Desktop shortcuts</span>
              </header>
              <dl className="ql-shortcuts">
                {SHORTCUTS.map((s) => (
                  <div key={s.keys}>
                    <dt>
                      <kbd>{s.keys}</kbd>
                    </dt>
                    <dd>{s.action}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {section === "data" && (
            <section className="ql-card">
              <header className="ql-card__head">
                <h2>Data</h2>
                <span className="ql-card__meta">No backend, no randomness</span>
              </header>
              <div className="ql-facts">
                <div>
                  <dt>Notes</dt>
                  <dd className="tnum">{counts.total}</dd>
                </div>
                <div>
                  <dt>Pinned</dt>
                  <dd className="tnum">{counts.pinned}</dd>
                </div>
                <div>
                  <dt>Tags</dt>
                  <dd className="tnum">{TAGS.length}</dd>
                </div>
              </div>
              <p className="ql-field__hint">
                Every note is authored fixture data with fixed timestamps, so the library reads the
                same on every load. Resetting drops the checklist overrides, the font size and the
                sort — and any note you created here.
              </p>
              <div className="ql-field ql-field--row">
                <button type="button" className="ql-btn ql-btn--filled" onClick={resetAll}>
                  Reset preferences
                </button>
                <button
                  type="button"
                  className="ql-btn"
                  onClick={() => notify(`${notes.length} notes re-indexed — nothing to upload`)}
                >
                  Re-index search
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
