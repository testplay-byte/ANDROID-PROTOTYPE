import type { ReactNode } from "react";
import "../../../../src/proto-kit/tokens/tokens.css";
import "../../../../src/proto-kit/styles/index.css";
/* The surface route reuses the prototype page components but not their
   layouts, so every desktop prototype's stylesheet is imported here.
   They are prefix-scoped (.mrd- .ql- .tel- .aur- .sy- .mch- .atl-) and
   never collide. */
import "../../../../src/prototypes/meridian/meridian.css";
import "../../../../src/prototypes/quill/quill.css";
import "../../../../src/prototypes/telemetry/telemetry.css";
import "../../../../src/prototypes/aurora/aurora.css";
import "../../../../src/prototypes/stockyard/stockyard.css";
import "../../../../src/prototypes/mochi/mochi.css";
import "../../../../src/prototypes/atelier/atelier.css";
import "../../../../src/prototypes/signal/signal.css";
import "../../../../src/prototypes/halo/halo.css";
import "../../../../src/prototypes/counter/counter.css";
import "../../../../src/prototypes/facet/facet.css";
import "../../../../src/prototypes/thin/thin.css";
import "../../../../src/prototypes/helio/helio.css";

/**
 * Layout for the surface-aware prototype route (`[slug]/[surface]`).
 *
 * Token layer first, then the design-language layer, then the prototype
 * stylesheets — the same import order as a prototype's own layout.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
