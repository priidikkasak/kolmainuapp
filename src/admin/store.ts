import { and, asc, desc, eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { requireDb } from "@/db/client";
import { fromLocalInput } from "@/lib/date";
import { getResource, type Field, type Resource, type Row } from "./resources";

function col(resource: Resource, name: string): PgColumn {
  const column = (resource.table as unknown as Record<string, PgColumn>)[name];
  if (!column) throw new Error(`Tundmatu veerg: ${resource.key}.${name}`);
  return column;
}

function tenantFilter(resource: Resource, tenantId: string) {
  return eq(col(resource, "tenantId"), tenantId);
}

export async function listRows(resource: Resource, tenantId: string, limit = 500) {
  const db = requireDb();
  const order = resource.orderBy.map((o) =>
    o.dir === "desc" ? desc(col(resource, o.name)) : asc(col(resource, o.name))
  );
  return (await db
    .select()
    .from(resource.table)
    .where(tenantFilter(resource, tenantId))
    .orderBy(...order)
    .limit(limit)) as Row[];
}

export async function findRow(resource: Resource, tenantId: string, id: string) {
  const db = requireDb();
  const rows = (await db
    .select()
    .from(resource.table)
    .where(and(tenantFilter(resource, tenantId), eq(col(resource, "id"), id)))
    .limit(1)) as Row[];
  return rows[0] ?? null;
}

/** `{value,label}` pairs for a `ref` field pointing at `refResource`. */
export async function refOptions(refKey: string, tenantId: string) {
  const target = getResource(refKey);
  if (!target) return [];
  const rows = await listRows(target, tenantId);
  return rows.map((r) => ({
    value: String(r.id),
    label: target.title(r) || String(r[target.labelColumn] ?? r.id),
  }));
}

export function coerceField(field: Field, raw: FormDataEntryValue | null): unknown {
  if (field.type === "bool") return raw === "on" || raw === "true";
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value === "") {
    if (field.type === "number") return null;
    if (field.type === "datetime") return null;
    return field.required ? "" : null;
  }
  switch (field.type) {
    case "number": {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case "datetime":
      return fromLocalInput(value);
    default:
      return value;
  }
}

export function parseForm(resource: Resource, formData: FormData): Row {
  const values: Row = {};
  for (const field of resource.fields) {
    const raw = formData.get(field.name);
    const value = coerceField(field, raw);
    if (field.optionalOnEdit && (value === null || value === "")) continue;
    if (field.required && (value === null || value === "")) {
      throw new Error(`Väli „${field.label}“ on kohustuslik.`);
    }
    values[field.name] = value;
  }
  return values;
}

export async function saveRow(
  resource: Resource,
  tenantId: string,
  id: string | null,
  values: Row
) {
  const db = requireDb();
  const prepared = resource.beforeSave ? resource.beforeSave(values, !id) : values;

  if (id) {
    await db
      .update(resource.table)
      .set(prepared as never)
      .where(and(tenantFilter(resource, tenantId), eq(col(resource, "id"), id)));
    return id;
  }

  const inserted = (await db
    .insert(resource.table)
    .values({ ...prepared, tenantId } as never)
    .returning()) as Row[];
  return String(inserted[0]?.id ?? "");
}

export async function deleteRow(resource: Resource, tenantId: string, id: string) {
  const db = requireDb();
  await db
    .delete(resource.table)
    .where(and(tenantFilter(resource, tenantId), eq(col(resource, "id"), id)));
}

export async function countRows(resource: Resource, tenantId: string) {
  const rows = await listRows(resource, tenantId, 1000);
  return rows.length;
}
