import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/wallet/wallet.css";

export const metadata: Metadata = {
  title: "Wallet — ANDROID-PROTOTYPE",
};

/**
 * Layout for the Wallet prototype route (HIG · iOS 26/27 Liquid Glass).
 * Thin pass-through: page.tsx (client) renders the full Stage + DeviceFrame
 * shell; the system font stack is set inside wallet.css.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
