"use client";

/**
 * facet / screens / settings-screen — the preferences that change the whole
 * window, not just this page.
 *
 * Theme, tile density and the hide-tile control are all real: hide a tile
 * here and the board loses it (and the board tells you how many are hidden);
 * change the density and the grid's row height changes under every tile.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { EyeIcon, EyeOffIcon, RestoreIcon, ResizeIcon } from "../components/icons";
import { SPAN_CYCLE, SPAN_LABEL, SHORTCUTS, TILES } from "../data";
import { useFacet, type Density } from "../state/facet-context";

const DENSITIES: { id: Density; label: string; hint: string }[] = [
  { id: "compact", label: "Compact", hint: "134 → 112px rows, tighter padding" },
  { id: "cosy", label: "Cosy", hint: "134px rows — the default" },
  { id: "roomy", label: "Roomy", hint: "152px rows, more air per tile" },
];

export function SettingsScreen() {
  const {
    prefs,
    setPrefs,
    resetPrefs,
    hideTile,
    showTile,
    showAllTiles,
    spans,
    cycleSpan,
    resetSpans,
    go,
    notify,
  } = useFacet();
  const { theme, setTheme } = useDeviceTheme();
  const hiddenCount = prefs.hidden.length;

  return (
    <div className="fc-view">
      <div className="fc-settings">
        {/* ---------- appearance ---------- */}
        <section className="fc-card">
          <h2 className="fc-card__title">Appearance</h2>
          <p className="fc-card__desc">
            The window theme. Bento keeps one orange accent and a felt background in both themes —
            only the planes change.
          </p>
          <div className="fc-segment" role="group" aria-label="Window theme">
            {(["dark", "light"] as const).map((t) => (
              <button
                type="button"
                key={t}
                className="fc-segment__btn"
                data-active={theme === t || undefined}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
              >
                {t === "dark" ? "Dark" : "Light"}
              </button>
            ))}
          </div>
          <div className="fc-swatchrow">
            {["surface", "primary", "secondary", "tertiary"].map((k) => (
              <span className="fc-swatchrow__item" key={k}>
                <span className={`fc-swatch fc-swatch--${k}`} />
                {k}
              </span>
            ))}
          </div>
        </section>

        {/* ---------- density ---------- */}
        <section className="fc-card">
          <h2 className="fc-card__title">Tile density</h2>
          <p className="fc-card__desc">
            The board's row height. This is a layout change, not a font change — every tile keeps
            its content and gets more or less air.
          </p>
          <div className="fc-segment fc-segment--stack" role="group" aria-label="Tile density">
            {DENSITIES.map((d) => (
              <button
                type="button"
                key={d.id}
                className="fc-segment__btn"
                data-active={prefs.density === d.id || undefined}
                onClick={() => setPrefs({ density: d.id })}
                aria-pressed={prefs.density === d.id}
              >
                <b>{d.label}</b>
                <span>{d.hint}</span>
              </button>
            ))}
          </div>
          <div className="fc-miniboard" data-density={prefs.density} aria-hidden="true">
            <span />
            <span />
            <span data-span="2x1" />
          </div>
        </section>

        {/* ---------- hide tiles ---------- */}
        <section className="fc-card fc-card--wide">
          <h2 className="fc-card__title">Tiles on the board</h2>
          <p className="fc-card__desc">
            Hiding a tile removes it from the bento grid for real — the board reflows and the rest
            of the tiles take the space. Clock, agenda and capture are the spine and always stay.
          </p>
          <ul className="fc-tilelist">
            {TILES.map((t) => {
              const hidden = prefs.hidden.includes(t.id);
              return (
                <li className="fc-tilelist__row" key={t.id} data-hidden={hidden || undefined}>
                  <span className="fc-tilelist__name">{t.job}</span>
                  <span className="fc-tilelist__span tnum">
                    <ResizeIcon /> {SPAN_LABEL[spans[t.id] ?? t.span]}
                  </span>
                  <span className="fc-tilelist__cycle">
                    <button
                      type="button"
                      className="fc-btn fc-btn--sm"
                      onClick={() => cycleSpan(t.id)}
                      title={`Cycle ${t.job} between ${SPAN_CYCLE.map((s) => SPAN_LABEL[s]).join(", ")}`}
                    >
                      Cycle size
                    </button>
                  </span>
                  <button
                    type="button"
                    className="fc-btn fc-btn--sm"
                    disabled={!t.hideable}
                    onClick={() => {
                      if (hidden) showTile(t.id);
                      else hideTile(t.id);
                      notify(hidden ? `${t.job} is back on the board` : `${t.job} hidden from the board`);
                    }}
                    aria-pressed={hidden}
                  >
                    {hidden ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                    {hidden ? "Show" : "Hide"}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="fc-card__actions">
            <button
              type="button"
              className="fc-btn fc-btn--sm"
              onClick={() => {
                resetSpans();
                notify("Every tile back to its default span");
              }}
            >
              <RestoreIcon /> Reset all spans
            </button>
            <button
              type="button"
              className="fc-btn fc-btn--sm"
              disabled={hiddenCount === 0}
              onClick={() => {
                showAllTiles();
                notify("Every hidden tile is back");
              }}
            >
              Show all ({hiddenCount})
            </button>
            <button type="button" className="fc-btn fc-btn--sm" onClick={() => go("board")}>
              Back to the board
            </button>
          </div>
        </section>

        {/* ---------- keyboard ---------- */}
        <section className="fc-card">
          <h2 className="fc-card__title">Keyboard</h2>
          <p className="fc-card__desc">
            Desktop shortcuts — a phone has none of these, which is part of why the two builds are
            separate systems.
          </p>
          <ul className="fc-keys">
            {SHORTCUTS.map((s) => (
              <li key={s.keys}>
                <kbd>{s.keys}</kbd>
                <span>{s.what}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- data ---------- */}
        <section className="fc-card">
          <h2 className="fc-card__title">Demo data</h2>
          <p className="fc-card__desc">
            Everything on this board is pinned to a fixed Monday, 28 September 2026 — no live clock,
            no randomness, so two people looking at the same screen see the same pixels.
          </p>
          <button
            type="button"
            className="fc-btn fc-btn--solid"
            onClick={() => {
              resetPrefs();
              notify("Preferences reset — density cosy, every tile visible");
            }}
          >
            Reset preferences
          </button>
        </section>
      </div>
    </div>
  );
}
