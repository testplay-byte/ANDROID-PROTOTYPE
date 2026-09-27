"use client";

/* simmer / components/sheet — bottom sheet primitive in clay:
   scrim fades, the sheet itself is one giant puffy slab that slides up
   with a soft settle; × / scrim / Esc close it. */

import { useEffect } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sm-sheet-root">
      <div className="sm-sheet-scrim" onClick={onClose} />
      <div className="sm-sheet" role="dialog" aria-label={title}>
        <div className="sm-sheet-head">
          <span className="sm-sheet-handle" />
          <h2 className="sm-sheet-title">{title}</h2>
          <button type="button" className="sm-sheet-x" onClick={onClose} aria-label="Close">
            <CloseIcon size={16} />
          </button>
        </div>
        <div className="sm-sheet-body">{children}</div>
      </div>
    </div>
  );
}
