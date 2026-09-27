"use client";

/* still / components / toast — carved (inset) soft pill snackbar, reads
   the message channel from StillProvider. Sits above the nav bar. */

import { useStill } from "../state/still-context";
import { BellIcon, BreathIcon, CheckIcon, InfoIcon } from "./icons";

export function Toast() {
  const { toast } = useStill();
  if (!toast) return null;
  return (
    <div className="st-toast" role="status" aria-live="polite" key={toast.msg}>
      <span className="st-toast__icon" aria-hidden="true">
        {toast.icon === "check" ? (
          <CheckIcon size={13} />
        ) : toast.icon === "breath" ? (
          <BreathIcon size={15} />
        ) : toast.icon === "bell" ? (
          <BellIcon size={15} />
        ) : (
          <InfoIcon size={15} />
        )}
      </span>
      <span className="st-toast__msg">{toast.msg}</span>
    </div>
  );
}
