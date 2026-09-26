import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/streetwear-store/streetwear-store.css";

export const metadata: Metadata = {
  title: "Streetwear Store — ANDROID-PROTOTYPE",
};

/**
 * Layout for the streetwear-store prototype route.
 *
 * Thin pass-through: page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
