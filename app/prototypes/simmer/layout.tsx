import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/simmer/simmer.css";

export const metadata: Metadata = {
  title: "Simmer — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Simmer prototype route.
 *
 * Thin pass-through: page.tsx (client) renders the full
 * DeviceThemeProvider + SimmerProvider + Stage + DeviceFrame shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
