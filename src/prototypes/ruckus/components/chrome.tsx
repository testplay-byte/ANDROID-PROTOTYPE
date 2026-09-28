"use client";

/* ruckus / components / chrome — shared brutalist bits:
   the section banner (numbered stencil), the sticker badge, the toast. */

import { useEffect, useState } from "react";
import { useRuckus } from "../state/ruckus-context";
import { XIcon } from "./icons";

/** numbered section stencil — "01 / TONIGHT" ink slab */
export function Banner({ n, children, tone = "ink" }: { n: string; children: React.ReactNode; tone?: "ink" | "primary" | "flame" }) {
  return (
    <div className={`rk-banner rk-banner--${tone}`}>
      <span className="rk-banner__n">{n}</span>
      <span className="rk-banner__label">{children}</span>
    </div>
  );
}

/** rotated sticker badge — sold out, new, last units */
export function Sticker({ children, tone = "flame", tilt = -2 }: { children: React.ReactNode; tone?: "flame" | "primary" | "ink"; tilt?: number }) {
  return (
    <span className={`rk-sticker rk-sticker--${tone}`} style={{ transform: `rotate(${tilt}deg)` }}>
      {children}
    </span>
  );
}

/** brutalist toast — one line, hard shadow, auto-dismiss */
export function Toast() {
  const { toast } = useRuckus();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setShown(true);
    const t = window.setTimeout(() => setShown(false), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <div className={`rk-toast rk-toast--${toast.tone}${shown ? " is-in" : ""}`} role="status">
      {toast.msg}
    </div>
  );
}

/** hard switch — 52×32 track, 24px square-ish thumb, ink border */
export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" className={"rk-switch" + (on ? " is-on" : "")} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}
