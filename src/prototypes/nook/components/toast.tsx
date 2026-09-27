"use client";

/* toast — a single quiet line on a hairline box, no shadow, no icon
   beyond a dot. It sits above the text tab row and fades in/out. */

import { useNook } from "../state/nook-context";

export function Toast() {
  const { toast } = useNook();
  return (
    <div
      className={"no-toast" + (toast ? " is-show" : "") + (toast?.tone === "warn" ? " no-toast--warn" : "")}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">{toast?.msg ?? ""}</span>
    </div>
  );
}
