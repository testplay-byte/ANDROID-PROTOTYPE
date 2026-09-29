import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/mochi/mochi.css";

export const metadata: Metadata = {
  title: "Mochi — ANDROID-PROTOTYPE",
};

/**
 * Layout for the mochi prototype route (desktop surface).
 *
 * Thin pass-through: page.tsx (client) renders the full Stage +
 * SurfaceFrame + DesktopSidebar + DesktopTopBar shell. Token imports are
 * identical to a phone prototype — the SURFACE carries the clay tokens, so
 * the design language is chosen by one `style="clay"` prop, not by CSS.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
