"use client";

/**
 * facet / screens / board-screen — the flagship view.
 *
 * The whole point of bento: tiles are borderless cards separated by a real
 * gutter, each does ONE job, and SIZE CARRIES MEANING. Every tile's head
 * carries a span cycle control (1×1 → 2×1 → 2×2 → 1×2), so the layout is the
 * user's, not the designer's.
 *
 * The grid is 4 columns of one fixed row height. Tile placement is plain
 * auto-flow, so resizing a tile reflows everything after it the way a real
 * bento board does. At `@container surface (max-width: 900px)` the grid
 * becomes 2 columns and the 2×2 tiles become 2×1.
 */

import {
  AgendaTile,
  CaptureTile,
  ClockTile,
  FocusTile,
  HabitsTile,
  MonthTile,
  NotesTile,
  SignalTile,
  WeatherTile,
} from "../components/board-tiles";
import { RestoreIcon, ResizeIcon } from "../components/icons";
import { SPAN_CYCLE, SPAN_LABEL } from "../data";
import { useFacet } from "../state/facet-context";

export function BoardScreen() {
  const { visibleTiles, spans, cycleSpan, activeTile, resetSpans, prefs, showAllTiles, notify } =
    useFacet();

  return (
    <div className="fc-view">
      <div className="fc-boardbar">
        <span className="fc-boardbar__legend">
          <span className="fc-boardbar__text">span cycle</span>
          {SPAN_CYCLE.map((s) => (
            <span className="fc-boardbar__key tnum" key={s}>
              {SPAN_LABEL[s]}
            </span>
          ))}
        </span>
        <span className="fc-boardbar__readout tnum">
          {visibleTiles.length} tiles ·{" "}
          {visibleTiles.map((t) => SPAN_LABEL[spans[t.id] ?? t.span]).join(" ")}
        </span>
        <span className="fc-boardbar__actions">
          {activeTile && (
            <button
              type="button"
              className="fc-btn fc-btn--sm"
              onClick={() => cycleSpan(activeTile, -1)}
              title="Shrink the selected tile"
            >
              <ResizeIcon /> Smaller
            </button>
          )}
          <button
            type="button"
            className="fc-btn fc-btn--sm"
            onClick={() => {
              resetSpans();
              notify("Tile layout reset to the default spans");
            }}
          >
            <RestoreIcon /> Reset layout
          </button>
          {prefs.hidden.length > 0 && (
            <button
              type="button"
              className="fc-btn fc-btn--sm fc-btn--quiet"
              onClick={() => {
                showAllTiles();
                notify(
                  `${prefs.hidden.length} hidden tile${prefs.hidden.length === 1 ? "" : "s"} restored`
                );
              }}
            >
              Show {prefs.hidden.length} hidden
            </button>
          )}
        </span>
      </div>

      {visibleTiles.length === 0 ? (
        <div className="fc-empty">
          <h2>Every tile is hidden</h2>
          <p>
            A bento board with nothing in it is just a background. Put the tiles back, or choose
            which ones you actually want in Settings.
          </p>
          <button
            type="button"
            className="fc-btn fc-btn--solid"
            onClick={() => {
              showAllTiles();
              notify("Every tile is back on the board");
            }}
          >
            Restore all tiles
          </button>
        </div>
      ) : (
        <div className="fc-board" data-density={prefs.density}>
          {visibleTiles.map((t) => {
            switch (t.id) {
              case "clock":
                return <ClockTile key={t.id} />;
              case "weather":
                return <WeatherTile key={t.id} />;
              case "agenda":
                return <AgendaTile key={t.id} />;
              case "capture":
                return <CaptureTile key={t.id} />;
              case "habits":
                return <HabitsTile key={t.id} />;
              case "focus":
                return <FocusTile key={t.id} />;
              case "notes":
                return <NotesTile key={t.id} />;
              case "month":
                return <MonthTile key={t.id} />;
              case "signal":
                return <SignalTile key={t.id} />;
              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
}
