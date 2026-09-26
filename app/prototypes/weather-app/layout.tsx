import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/weather-app/weather-app.css";

export const metadata: Metadata = {
  title: "Weather App — ANDROID-PROTOTYPE",
};

/**
 * Layout for the weather-app prototype route.
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
