"use client";

/* atlas / components / tile — the bento atom.

   A Tile is ONE job: a number, a mini chart, a media frame. Sizes carry
   meaning (frequency of use): the destination hero spans both columns,
   weather spans both, the countdown is a tall 1x2, utility tiles are 1x1.
   Tiles are borderless (bento: gutter + shadow do the separation), use
   the enlarged radius scale, lift on hover (desktop), sink on press, and
   rise in on mount with a per-index stagger (--i drives the delay). */

import type { CSSProperties, ReactNode } from "react";

export interface TileProps {
  /** grid-column span: 2 = full width hero, 1 = half (default) */
  wide?: boolean;
  /** grid-row span: 2 = tall 1x2 side tile */
  tall?: boolean;
  /** entrance stagger index (CSS var --i) */
  i?: number;
  /** when set the tile renders as a button and can expand / navigate */
  onClick?: () => void;
  /** aria label for interactive tiles */
  label?: string;
  className?: string;
  /** "accent" paints the primary container behind the content */
  tone?: "default" | "surface2" | "accent" | "art";
  children: ReactNode;
}

export function Tile({
  wide,
  tall,
  i = 0,
  onClick,
  label,
  className = "",
  tone = "default",
  children,
}: TileProps) {
  const cls = [
    "at-tile",
    wide ? "at-tile-wide" : "",
    tall ? "at-tile-tall" : "",
    tone === "surface2" ? "at-tone-2" : "",
    tone === "accent" ? "at-tone-accent" : "",
    tone === "art" ? "at-tone-art" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        className={cls}
        style={{ ["--i" as string]: `${i}` } as CSSProperties}
        onClick={onClick}
        aria-label={label}
      >
        {children}
      </button>
    );
  }
  return (
    <div className={cls} style={{ ["--i" as string]: `${i}` } as CSSProperties}>
      {children}
    </div>
  );
}

/* Tile micro-typography shared by every tile's label line. */
export function TileHead({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <span className="at-tile-head">
      {icon ? <span className="at-tile-ic">{icon}</span> : null}
      <span className="at-tile-title">{title}</span>
    </span>
  );
}
