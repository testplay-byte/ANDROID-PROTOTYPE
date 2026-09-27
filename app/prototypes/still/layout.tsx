import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/still/still.css";

export const metadata: Metadata = {
  title: "Still — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Still prototype route.
 *
 * Thin pass-through: page.tsx (client) renders the full
 * DeviceThemeProvider + StillProvider + Stage + DeviceFrame shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
