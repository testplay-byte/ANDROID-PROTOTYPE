import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/stockyard/stockyard.css";

export const metadata: Metadata = {
  title: "Stockyard — ANDROID-PROTOTYPE",
};

/**
 * Layout for the stockyard prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so a desktop prototype is styled exactly like its phone family,
 * just with `style="brutalism"` on the surface instead of a device frame.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
