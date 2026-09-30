import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/proto-kit/charts/charts.css";
import "../../../src/prototypes/signal/signal.css";

export const metadata: Metadata = {
  title: "Signal — ANDROID-PROTOTYPE",
};

/**
 * Layout for the signal prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens, so `data-style="m3"` arriving on the window is all it takes to
 * re-ink every chart in the app.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
