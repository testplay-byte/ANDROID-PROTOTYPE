import type { ReactNode } from "react";
import "../../../../src/proto-kit/tokens/tokens.css";
import "../../../../src/proto-kit/styles/index.css";
/* The surface route reuses the prototype page components but not their
   layouts, so their stylesheets are imported here. All three are
   prefix-scoped (.mrd- / .ql- / .tel-) and never collide. */
import "../../../../src/prototypes/meridian/meridian.css";
import "../../../../src/prototypes/quill/quill.css";
import "../../../../src/prototypes/telemetry/telemetry.css";

/**
 * Layout for the surface-aware prototype route (`[slug]/[surface]`).
 *
 * Token layer first, then the design-language layer, then the prototype
 * stylesheets — the same import order as a prototype's own layout.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
