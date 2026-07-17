import type { NextConfig } from "next";

/**
 * Next.js config for ANDROID-PROTOTYPE.
 *
 * Deploys as a STATIC EXPORT to GitHub Pages at:
 *   https://testplay-byte.github.io/ANDROID-PROTOTYPE/
 *
 * - output: 'export'  → produces static HTML/CSS/JS in ./out (no server needed)
 * - basePath          → the repo is a project page, served under /ANDROID-PROTOTYPE
 * - trailingSlash     → directory-style URLs (out/prototypes/x/ → /prototypes/x/)
 * - images.unoptimized → required for static export (no Next image server)
 *
 * Old static prototypes live in public/prototypes/ and are copied verbatim
 * into out/prototypes/ by the static export, preserving their URLs during the
 * migration to Next.js components.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ANDROID-PROTOTYPE",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Suppress build errors from old static HTML in public/ (it isn't compiled).
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
