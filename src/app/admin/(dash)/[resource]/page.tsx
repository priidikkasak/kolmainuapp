import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/admin/guard";
import { getResource } from "@/admin/resources";
import { listRows } from "@/admin/store";
import { AdminRow, AdminTitle, Empty } from "@/components/admin/ui";

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const { tenant } = await requireAdmin();
  const rows = await listRows(resource, tenant.id);

  return (
    <>
      <AdminTitle
        title={resource.label}
        subtitle={resource.description}
        action={
          <Link
            href={`/admin/${resource.key}/uus`}
            className="shrink-0 rounded-[12px] bg-ink px-4 py-2.5 text-[14px] font-semibold text-white"
          >
            Lisa
          </Link>
        }
      />

      {rows.length === 0 ? (
        <Empty>Siin pole veel midagi. Vajuta „Lisa“.</Empty>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <AdminRow
              key={String(row.id)}
              href={`/admin/${resource.key}/${row.id}`}
              title={resource.title(row)}
              meta={resource.meta?.(row)}
              badge={"published" in row && row.published === false ? "peidetud" : null}
            />
          ))}
        </div>
      )}

      <div className="pt-8">
        <Link href="/admin" className="text-[14px] font-medium text-ink-3">
          ← Sisuhaldus
        </Link>
      </div>
    </>
  );
}
