import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/halo/halo.css";

export const metadata: Metadata = {
  title: "Halo — ANDROID-PROTOTYPE",
};

/**
 * Layout for the halo prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so `style="neumorph"` reaches the same palette the phone family
 * (music-player) uses, only at desktop densities.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
