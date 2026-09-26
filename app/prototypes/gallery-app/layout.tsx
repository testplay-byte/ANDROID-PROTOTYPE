import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/gallery-app/gallery-app.css";

export const metadata: Metadata = {
  title: "Gallery App — ANDROID-PROTOTYPE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
