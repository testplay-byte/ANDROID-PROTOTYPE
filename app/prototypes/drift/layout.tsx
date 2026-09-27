import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/drift/drift.css";

export const metadata: Metadata = {
  title: "Drift — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Drift prototype route.
 *
 * Thin pass-through: page.tsx (client) renders the full
 * DeviceThemeProvider + DriftProvider + Stage + DeviceFrame shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
