import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/kids-learning/kids-learning.css";

export const metadata: Metadata = {
  title: "Kids Learning — ANDROID-PROTOTYPE",
};

/**
 * Layout for the kids-learning prototype route.
 *
 * Thin pass-through: the page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
