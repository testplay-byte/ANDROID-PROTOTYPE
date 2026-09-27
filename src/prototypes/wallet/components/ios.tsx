"use client";

/* ios — iOS-chrome primitives for the Wallet prototype, rebuilt for the
   iOS 26 / 27 "Liquid Glass" look: the collapsing nav bar and controls are
   floating glass (blur + saturate, luminous hairline) instead of flat
   translucent bars. Geometry & behavior follow docs/design-languages/hig.md;
   adapted from the fitness-tracker reference components (same repo, no
   cross-prototype import — copied & re-skinned per the repo rule). */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Observe the scrollable content element; true once past `threshold`. */
export function useIosCollapse(threshold = 40) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setCollapsed(el.scrollTop > threshold);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return { ref, collapsed };
}

/** Large-title nav bar; collapses into a Liquid Glass inline bar on scroll. */
export function IosNavBar({
  title,
  leading,
  trailing,
  collapsed = false,
  inlineOnly = false,
}: {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  collapsed?: boolean;
  inlineOnly?: boolean;
}) {
  const isCollapsed = collapsed || inlineOnly;
  return (
    <header className={"wl-navbar" + (isCollapsed ? " is-collapsed" : "") + (inlineOnly ? " is-inline-only" : "")}>
      <div className="wl-navbar__inline">
        <div className="wl-navbar__side">{leading}</div>
        <span className="wl-navbar__inline-title" aria-hidden={!isCollapsed}>
          {title}
        </span>
        <div className="wl-navbar__side wl-navbar__side--right">{trailing}</div>
      </div>
      <div className="wl-navbar__large">
        <h1 className="wl-navbar__large-title">{title}</h1>
      </div>
    </header>
  );
}

/** Native iOS switch — 51×31 track, 27px white knob, green when on. */
export function IosSwitch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={"wl-switch" + (on ? " on" : "")}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    >
      <i />
    </button>
  );
}

/** iOS segmented control — raised slab on the selected segment. */
export function IosSegmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="wl-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          className={"wl-seg__btn" + (value === o.id ? " on" : "")}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
