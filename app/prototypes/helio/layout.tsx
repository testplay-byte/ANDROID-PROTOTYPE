import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/helio/helio.css";

export const metadata: Metadata = {
  title: "Helio — ANDROID-PROTOTYPE",
};

/** Thin pass-through: page.tsx renders the Stage + SurfaceFrame shell. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
