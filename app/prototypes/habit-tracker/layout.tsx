import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/proto-kit/styles/index.css"; // multi-style layer (after tokens!)
import "../../../src/prototypes/habit-tracker/habit-tracker.css";

export const metadata: Metadata = {
  title: "Habit Tracker — ANDROID-PROTOTYPE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
