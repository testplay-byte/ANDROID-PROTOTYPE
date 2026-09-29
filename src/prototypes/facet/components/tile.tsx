"use client";

/**
 * facet / components / tile — the bento atom.
 *
 * A tile does ONE job. Size carries meaning (the span cycle control in the
 * head is how the user says "this matters more than that"), tiles are
 * borderless — the gutter and shadow-1 do the separation — and nothing
 * scrolls inside a tile unless it genuinely cannot fit.
 *
 * The span lives on `data-span` so the tablet reflow is a container query
 * with explicit rules (2×2 → 2×1) rather than a JS resize listener.
 */

import type { ReactNode } from "react";
import { ResizeIcon } from "./icons";
import { SPAN_LABEL, type SpanId, type ToneId } from "../data";

export interface TileProps {
  id: string;
  /** the one job, in the tile's own words — printed in the head */
  job: string;
  span: SpanId;
  tone: ToneId;
  /** the span cycle control, hidden for tiles that must keep their size */
  onCycleSpan?: () => void;
  /** marks the tile the [ ] shortcuts act on */
  active?: boolean;
  /** action shown on the right of the head (e.g. "open calendar") */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Tile({
  id,
  job,
  span,
  tone,
  onCycleSpan,
  active = false,
  action,
  className = "",
  children,
}: TileProps) {
  return (
    <section
      className={`fc-tile ${className}`.trim()}
      data-span={span}
      data-tone={tone}
      data-active={active || undefined}
      aria-label={job}
    >
      <header className="fc-tile__head">
        <span className="fc-tile__job">{job}</span>
        <span className="fc-tile__tools">
          {action}
          {onCycleSpan && (
            <button
              type="button"
              className="fc-tile__span"
              onClick={onCycleSpan}
              title={`Resize this tile — now ${SPAN_LABEL[span]}`}
              aria-label={`Resize ${job} tile, currently ${SPAN_LABEL[span]}`}
            >
              <ResizeIcon />
              <span className="tnum">{SPAN_LABEL[span]}</span>
            </button>
          )}
        </span>
      </header>
      <div className="fc-tile__body" id={`tile-${id}`}>
        {children}
      </div>
    </section>
  );
}

/** Centred content block — most tiles are a number or a short phrase. */
export function TileCenter({ children }: { children: ReactNode }) {
  return <div className="fc-tile__center">{children}</div>;
}
