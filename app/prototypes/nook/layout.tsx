import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/nook/nook.css";

export const metadata: Metadata = {
  title: "Nook — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Nook prototype route.
 *
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
