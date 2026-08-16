import { notFound } from "next/navigation";
import { requireAdmin } from "@/admin/guard";
import { defaultValue, toInputValue, type FormValue, type SerializableField } from "@/admin/form-values";
import { getResource } from "@/admin/resources";
import { findRow, refOptions } from "@/admin/store";
import { ResourceForm } from "@/components/admin/resource-form";
import { AdminTitle } from "@/components/admin/ui";

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const { tenant } = await requireAdmin();
  const isNew = id === "uus";
  const row = isNew ? null : await findRow(resource, tenant.id, id);
  if (!isNew && !row) notFound();

  const fields: SerializableField[] = await Promise.all(
    resource.fields.map(async (field) => {
      if (field.type !== "ref" || !field.refResource) return field;
      return { ...field, options: await refOptions(field.refResource, tenant.id) };
    })
  );

  const values: Record<string, FormValue> = {};
  for (const field of resource.fields) {
    values[field.name] = row ? toInputValue(field, row[field.name]) : defaultValue(field);
  }

  return (
    <>
      <AdminTitle
        title={isNew ? `Uus: ${resource.singular.toLowerCase()}` : resource.title(row!)}
        subtitle={isNew ? undefined : resource.meta?.(row!)}
      />
      <ResourceForm
        resourceKey={resource.key}
        id={isNew ? null : id}
        fields={fields}
        values={values}
        backHref={`/admin/${resource.key}`}
      />
    </>
  );
}
