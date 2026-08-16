import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { getSiteConfig } from "@/lib/tenant";
import { themeStyle } from "@/lib/theme";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: {
      default: site.shortName,
      template: `${site.shortName} - %s`,
    },
    description: site.description ?? undefined,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: site.shortName,
      statusBarStyle: "default",
    },
    applicationName: site.shortName,
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/icon-192.png",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const site = await getSiteConfig();
  return {
    themeColor: site.theme.bg ?? "#f7f4ec",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();
  return (
    <html lang="et" className={geist.variable} style={themeStyle(site.theme)}>
      <body>{children}</body>
    </html>
  );
}
