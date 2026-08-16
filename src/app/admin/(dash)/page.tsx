import Link from "next/link";
import { requireAdmin } from "@/admin/guard";
import { VISIBLE_RESOURCES } from "@/admin/resources";
import { countRows } from "@/admin/store";
import { AdminRow, AdminTitle } from "@/components/admin/ui";

export default async function AdminHome() {
  const { tenant } = await requireAdmin();

  const items = await Promise.all(
    VISIBLE_RESOURCES.map(async (resource) => ({
      resource,
      count: await countRows(resource, tenant.id).catch(() => 0),
    }))
  );

  return (
    <>
      <AdminTitle title="Sisuhaldus" subtitle={tenant.name} />

      <div className="flex flex-col gap-2">
        {items.map(({ resource, count }) => (
          <AdminRow
            key={resource.key}
            href={`/admin/${resource.key}`}
            title={resource.label}
            meta={resource.description}
            badge={String(count)}
          />
        ))}
        <AdminRow
          href="/admin/seaded"
          title="Seaded"
          meta="Nimi, kontakt, värvid, logo"
        />
      </div>

      <div className="pt-8">
        <Link href="/admin/seadistus" className="text-[13px] font-medium text-ink-3">
          Tehniline seadistus →
        </Link>
      </div>
    </>
  );
}
