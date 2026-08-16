import { BottomNav } from "@/components/bottom-nav";
import { LogoHeader } from "@/components/logo-header";
import { getSiteConfig } from "@/lib/tenant";
import { chromeBackground } from "@/lib/theme";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();
  const chrome = chromeBackground(site.theme);

  return (
    <>
      <div className="mx-auto max-w-[520px] px-5 pb-[calc(76px+env(safe-area-inset-bottom)+40px)]">
        <LogoHeader
          logoUrl={site.logoUrl ?? "/icons/logo.png"}
          name={site.shortName}
          background={chrome}
        />
        {children}
      </div>
      <BottomNav background={chrome} />
    </>
  );
}
