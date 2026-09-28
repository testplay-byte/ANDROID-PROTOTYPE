"use client";

/* ruckus / components / marquee — the yellow ticker strip.
   Text is duplicated once so the CSS loop is seamless; the copy is
   aria-hidden so screen readers hear it once. */

export function Marquee({ items, tone = "primary" }: { items: string[]; tone?: "primary" | "ink" }) {
  const line = items.join("  •  ");
  return (
    <div className={`rk-marquee rk-marquee--${tone}`} aria-hidden="true">
      <div className="rk-marquee__inner">
        <span className="rk-marquee__run">{line}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
        <span className="rk-marquee__run">{line}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
