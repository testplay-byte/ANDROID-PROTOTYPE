import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/atlas/atlas.css";

export const metadata: Metadata = {
  title: "Atlas — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Atlas prototype route (Bento trip planner).
 * Thin pass-through: page.tsx (client) renders the full
 * DeviceThemeProvider + Stage + DeviceFrame shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
