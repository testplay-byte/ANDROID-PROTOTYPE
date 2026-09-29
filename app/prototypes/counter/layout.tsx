import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/counter/counter.css";

export const metadata: Metadata = {
  title: "Counter — ANDROID-PROTOTYPE",
};

/**
 * Layout for the counter prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so a desktop prototype is styled exactly like its phone family.
 *
 * `style="flat"` is set on the <SurfaceFrame> in page.tsx, so
 * src/proto-kit/styles/flat.css supplies this window's entire token layer.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
