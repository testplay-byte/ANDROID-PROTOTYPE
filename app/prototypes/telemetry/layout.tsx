import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/telemetry/telemetry.css";

export const metadata: Metadata = {
  title: "Telemetry — ANDROID-PROTOTYPE",
};

/**
 * Layout for the telemetry prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full Stage + SurfaceFrame
 * + DesktopSidebar + DesktopTopBar shell. The token imports are identical to
 * a phone prototype — the SURFACE carries the app tokens, so this desktop
 * console is styled exactly like its Carbon phone sibling (pulse).
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
