import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/fitness-tracker/fitness-tracker.css";

export const metadata: Metadata = {
  title: "Fitness Tracker — ANDROID-PROTOTYPE",
};

/**
 * Layout for the fitness-tracker prototype route.
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
