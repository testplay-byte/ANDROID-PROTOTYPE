import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css";
import "../../../src/prototypes/chat-app/chat-app.css";

export const metadata: Metadata = {
  title: "Chat App — ANDROID-PROTOTYPE",
};

/**
 * Layout for the chat-app prototype route.
 *
 * Thin pass-through: the page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider + KeyboardProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
