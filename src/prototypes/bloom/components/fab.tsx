"use client";

/* fab — the M3 floating action button, primary container, docked above the
   bottom nav. Opens the "Add plant" sheet. */

import { PlusIcon } from "./icons";

export function Fab({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="bl-fab" onClick={onClick} aria-label={label}>
      <PlusIcon size={22} />
    </button>
  );
}
