import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/aurora/aurora.css";

export const metadata: Metadata = {
  title: "Aurora — ANDROID-PROTOTYPE",
};

/**
 * Layout for the aurora prototype route (desktop surface).
 *
 * Thin pass-through, exactly like every other prototype: page.tsx (client)
 * renders the whole Stage + SurfaceFrame + sidebar + top bar shell. The
 * SURFACE carries the app tokens, so `style="glass"` here is what supplies
 * the glass recipe — aurora.css only consumes it.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
