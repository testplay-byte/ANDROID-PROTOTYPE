import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/ruckus/ruckus.css";

export const metadata: Metadata = {
  title: "Ruckus — ANDROID-PROTOTYPE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
