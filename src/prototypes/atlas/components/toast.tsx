"use client";

/* atlas / components / toast — bento-style confirmation tile.
   Renders as a small raised tile (shadow-2, widget radius) that slides up
   above the nav row; icon mirrors the message channel in atlas-context. */

import { useAtlas } from "../state/atlas-context";
import { BagIcon, CheckIcon, InfoIcon, PinIcon, PlaneIcon } from "./icons";

export function Toast() {
  const { toast } = useAtlas();
  return (
    <div className={"at-toast" + (toast ? " at-toast-show" : "")} role="status" aria-live="polite">
      <span className="at-toast__ic" aria-hidden="true">
        {toast?.icon === "check" ? <CheckIcon size={15} strokeWidth={2.8} /> : null}
        {toast?.icon === "plane" ? <PlaneIcon size={15} /> : null}
        {toast?.icon === "pin" ? <PinIcon size={15} /> : null}
        {toast?.icon === "bag" ? <BagIcon size={15} /> : null}
        {toast?.icon === "info" ? <InfoIcon size={15} /> : null}
      </span>
      <span>{toast?.msg ?? ""}</span>
    </div>
  );
}
