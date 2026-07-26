import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { LogoHeader } from "@/components/logo-header";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kolmainu",
    template: "Kolmainu - %s",
  },
  description: "Kolmainu koguduse äpp - jumalateenistused, sündmused, annetused",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Kolmainu",
    statusBarStyle: "default",
  },
  applicationName: "Kolmainu",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ec",
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
    <html lang="et" className={geist.variable}>
      <body>
        <div className="mx-auto max-w-[520px] px-5 pb-[calc(76px+env(safe-area-inset-bottom)+40px)]">
          <LogoHeader />
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
