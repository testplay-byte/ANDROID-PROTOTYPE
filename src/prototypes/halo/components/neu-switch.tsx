"use client";

/**
 * NeuSwitch — the neumorphic toggle used across the Settings view.
 *
 * OFF: carved into the surface (--neu-press, a --color-bg track).
 * ON:  extruded and filled with --color-primary-container, the knob popped
 *      out with the raised recipe. The ON state pairs the container colour
 *      with --color-on-primary-container so the label beside it stays above
 *      4.5:1 in BOTH themes — a solid --color-primary fill is too close to
 *      its own foreground in the light neumorph palette.
 */

export function NeuSwitch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`halo-switch ${on ? "is-on" : ""}`}
      onClick={onChange}
    >
      <span className="halo-switch__knob" />
    </button>
  );
}
