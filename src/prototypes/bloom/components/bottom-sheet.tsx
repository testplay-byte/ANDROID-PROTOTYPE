"use client";

/* bottom-sheet — the M3 modal bottom sheet: scrim fade + sheet slide-up
   (emphasized), rounded top, drag handle, header with a close button.
   Closes via scrim tap, the × button, or the Escape key. */

import { useEffect } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  labelId: string;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, labelId, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="bl-sheet-root">
      <div className="bl-sheet-scrim" onClick={onClose} aria-hidden="true" />
      <div className="bl-sheet" role="dialog" aria-modal="true" aria-labelledby={labelId}>
        <div className="bl-sheet-handle" aria-hidden="true" />
        <header className="bl-sheet-head">
          <h2 id={labelId} className="bl-sheet-title">
            {title}
          </h2>
          <button type="button" className="bl-sheet-close" onClick={onClose} aria-label="Close sheet">
            <CloseIcon size={20} />
          </button>
        </header>
        <div className="bl-sheet-body">{children}</div>
      </div>
    </div>
  );
}
