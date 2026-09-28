import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/quill/quill.css";

export const metadata: Metadata = {
  title: "Quill — ANDROID-PROTOTYPE",
};

/**
 * Layout for the quill prototype route (desktop surface, HIG).
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + SurfaceFrame + DesktopSidebar + DesktopTopBar shell. The token
 * imports are identical to a phone prototype — the SURFACE carries the app
 * tokens (data-style="hig"), so this desktop app is styled exactly like its
 * phone family in the same design language.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
