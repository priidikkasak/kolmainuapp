import Link from "next/link";
import { requireAdmin } from "@/admin/guard";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminTitle } from "@/components/admin/ui";

export default async function SettingsPage() {
  const { tenant } = await requireAdmin();

  return (
    <>
      <AdminTitle title="Seaded" subtitle="Koguduse andmed, kontakt ja välimus" />
      <SettingsForm
        values={{
          name: tenant.name,
          shortName: tenant.shortName,
          tagline: tenant.tagline ?? "",
          description: tenant.description ?? "",
          logoUrl: tenant.logoUrl ?? "",
          homeTitle: tenant.homeTitle ?? "",
          homeSubtitle: tenant.homeSubtitle ?? "",
          domain: tenant.domain ?? "",
          contact: tenant.contact ?? {},
          theme: tenant.theme ?? {},
        }}
      />
      <div className="pt-8">
        <Link href="/admin" className="text-[14px] font-medium text-ink-3">
          ← Sisuhaldus
        </Link>
      </div>
    </>
  );
}
