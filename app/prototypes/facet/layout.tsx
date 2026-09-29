import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/facet/facet.css";

export const metadata: Metadata = {
  title: "Facet — ANDROID-PROTOTYPE",
};

/**
 * Layout for the facet prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so this desktop window is styled from exactly the same family as
 * its phone sibling, `atlas`.
 *
 * `style="bento"` is set on the <SurfaceFrame> in page.tsx, so
 * src/proto-kit/styles/bento.css supplies this window's entire token layer:
 * the enlarged radius scale, the felt background, shadow-1 contact lift and
 * the single orange accent.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
