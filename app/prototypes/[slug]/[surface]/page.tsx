import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurfaceProvider } from "@/proto-kit/surface/surface-context";
import { PROTOTYPE_REGISTRY, allSurfaceRoutes } from "../../_registry";

/**
 * Surface-aware prototype route.
 *
 * `/prototypes/<slug>/<surface>/` renders the build of a prototype for that
 * surface, so a phone app and a desktop app can share a slug without
 * colliding, and the URL always states which surface you are looking at.
 * Slug routes (`app/prototypes/<slug>/page.tsx`) stay canonical for phone
 * prototypes and canonicalise themselves into a surface URL for the desktop
 * ones (see `useCanonicalSurface`).
 */
export function generateStaticParams() {
  return allSurfaceRoutes();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; surface: string }>;
}): Promise<Metadata> {
  const { slug, surface } = await params;
  const entry = PROTOTYPE_REGISTRY[slug];
  if (!entry) return { title: "Prototype — ANDROID-PROTOTYPE" };
  const label = surface === "tablet" ? "Tablet" : "Desktop";
  return { title: `${entry.name} (${label}) — ANDROID-PROTOTYPE` };
}

export default async function SurfaceRoute({
  params,
}: {
  params: Promise<{ slug: string; surface: string }>;
}) {
  const { slug, surface } = await params;
  const entry = PROTOTYPE_REGISTRY[slug];
  const View =
    surface === "tablet"
      ? entry?.views.tablet
      : surface === "desktop"
        ? entry?.views.desktop
        : undefined;
  if (!entry || !View) notFound();
  // the page component is shared; the provider is what makes the same
  // build render as a desktop window or a tablet device
  return (
    <SurfaceProvider surface={surface === "tablet" ? "tablet" : "desktop"}>
      <View />
    </SurfaceProvider>
  );
}
