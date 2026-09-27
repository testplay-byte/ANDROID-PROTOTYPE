import type { Metadata } from "next";
import "../../src/proto-kit/tokens/tokens.css";
import "../../src/dashboard/dashboard.css";
import "../../src/dashboard/settings.css";

export const metadata: Metadata = {
  title: "Settings — ANDROID-PROTOTYPE",
  description:
    "Configure the device chrome used by every prototype: camera cutout type (punch-hole / pill / notch), its position, and the pill size.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
