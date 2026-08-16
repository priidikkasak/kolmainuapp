import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/tenant";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteConfig();
  const background = site.theme.bg ?? "#f7f4ec";

  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description ?? undefined,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: background,
    theme_color: background,
    lang: "et",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
