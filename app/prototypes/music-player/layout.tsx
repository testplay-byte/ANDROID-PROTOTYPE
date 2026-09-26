import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/music-player/music-player.css";

export const metadata: Metadata = {
  title: "Music Player — ANDROID-PROTOTYPE",
};

/**
 * Layout for the music-player prototype route.
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
