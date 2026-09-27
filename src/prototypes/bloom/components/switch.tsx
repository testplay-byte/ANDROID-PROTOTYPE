"use client";

/* switch — M3 material switch: pill track + circular thumb, thumb grows
   with a primary tint when on. 44px+ touch area. */

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={"bl-switch" + (checked ? " on" : "")}
      onClick={() => onChange(!checked)}
    >
      <span className="bl-switch__thumb" aria-hidden="true">
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
