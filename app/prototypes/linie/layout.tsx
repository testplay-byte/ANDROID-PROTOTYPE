import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/linie/linie.css";

export const metadata: Metadata = {
  title: "Linie — ANDROID-PROTOTYPE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
