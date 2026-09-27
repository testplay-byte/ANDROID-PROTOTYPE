import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter — self-hosted via next/font (downloaded at build time, served from
 * the site itself). The dashboard + settings pages rely on it: on Android
 * the system-font stack falls back to thin Roboto cuts, which made the
 * dashboard read as "unbolded, wrong font" next to the prototypes (which
 * load Inter through proto-kit tokens.css). `--font-inter` is consumed by
 * dashboard.css + globals.css.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANDROID-PROTOTYPE — Mobile UI Prototypes",
  description:
    "Interactive, fully functional mobile UI prototypes — viewable in the browser, deployed via GitHub Pages.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
