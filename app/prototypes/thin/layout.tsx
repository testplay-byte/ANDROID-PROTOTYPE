import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/thin/thin.css";

export const metadata: Metadata = {
  title: "Thin — ANDROID-PROTOTYPE",
};

/**
 * Layout for the thin prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so a desktop prototype is styled exactly like its phone family
 * (nook is the minimal phone build of the same language).
 *
 * `style="minimal"` is set on the <SurfaceFrame> in page.tsx, so
 * src/proto-kit/styles/minimal.css supplies this window's entire token layer,
 * and thin.css adds nothing but structure on top of it.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
