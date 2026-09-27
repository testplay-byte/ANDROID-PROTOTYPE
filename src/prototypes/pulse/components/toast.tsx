"use client";

/* pulse / components/toast — Carbon inline-notification styled toast:
   flat surface, 1px border, 4px left accent bar, 0 radius, no shadow.
   Fixed to the bottom of the app root, above the bottom nav. */

import { usePulse } from "../state/pulse-context";

function KindIcon({ kind }: { kind: "success" | "info" | "warning" }) {
  const box = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "square" as const,
  };
  if (kind === "success") {
    return (
      <svg {...box}>
        <path d="m4 12 6 6L20 6" />
      </svg>
    );
  }
  if (kind === "warning") {
    return (
      <svg {...box}>
        <path d="M12 3 22 20H2z" />
        <path d="M12 10v4M12 17h.01" />
      </svg>
    );
  }
  return (
    <svg {...box}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M12 10v6M12 7h.01" />
    </svg>
  );
}

export function Toast() {
  const { toast } = usePulse();
  if (!toast) return null;
  return (
    <div className={`plu-toast plu-toast--${toast.kind}`} role="status" key={toast.msg}>
      <span className="plu-toast__icon">
        <KindIcon kind={toast.kind} />
      </span>
      <span className="plu-toast__msg">{toast.msg}</span>
    </div>
  );
}
