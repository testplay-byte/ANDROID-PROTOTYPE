import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/weather-app/weather-app.css";

/* Outfit — the reference app's typeface (self-hosted at build time). */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather App — ANDROID-PROTOTYPE",
};

/**
 * Layout for the weather-app prototype route (Aurora Weather glassmorphism).
 *
 * Thin pass-through: page.tsx (client) renders the full Stage + DeviceFrame
 * shell. The font variable div only scopes --font-outfit for the app root.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={outfit.variable}>{children}</div>;
}
