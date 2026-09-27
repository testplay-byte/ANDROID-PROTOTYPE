"use client";

/* toast — the M3 snackbar-style confirmation pill (surface-4, check /
   droplet / leaf / info icon from the message channel). Rendered above
   the floating nav; fades + slides in. */

import { useBloom } from "../state/bloom-context";
import { CheckIcon, DropFilledIcon, InfoIcon, LeafIcon } from "./icons";

export function Toast() {
  const { toast } = useBloom();
  return (
    <div className={"bl-toast" + (toast ? " show" : "")} role="status" aria-live="polite">
      <span className="bl-toast__ic" aria-hidden="true">
        {toast?.icon === "check" ? <CheckIcon size={16} strokeWidth={2.8} /> : null}
        {toast?.icon === "droplet" ? <DropFilledIcon size={15} /> : null}
        {toast?.icon === "leaf" ? <LeafIcon size={15} /> : null}
        {toast?.icon === "info" ? <InfoIcon size={15} /> : null}
      </span>
      <span>{toast?.msg ?? ""}</span>
    </div>
  );
}
