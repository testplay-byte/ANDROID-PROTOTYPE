import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/pulse/pulse.css";

export const metadata: Metadata = {
  title: "Pulse — ANDROID-PROTOTYPE",
};

/**
 * Layout for the pulse prototype route.
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider + PulseProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
