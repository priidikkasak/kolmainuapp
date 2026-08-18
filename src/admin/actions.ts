"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db/client";
import { tenants, type TenantContact, type TenantTheme } from "@/db/schema";
import { authenticate, destroySession } from "@/lib/auth";
import { requireAdmin } from "./guard";
import { getResource } from "./resources";
import { deleteRow, parseForm, saveRow } from "./store";

export type ActionState = { error?: string; ok?: boolean };

function refreshSite() {
  // Content feeds every route, so refresh the whole tree.
  revalidatePath("/", "layout");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Täida mõlemad väljad." };

  const result = await authenticate(email, password);
  if ("error" in result) return { error: result.error };

  const next = String(formData.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveResourceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const key = String(formData.get("__resource") ?? "");
  const id = String(formData.get("__id") ?? "") || null;
  const resource = getResource(key);
  if (!resource) return { error: "Tundmatu sisutüüp." };

  const { tenant } = await requireAdmin();
  try {
    const values = parseForm(resource, formData);
    await saveRow(resource, tenant.id, id, values);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Salvestamine ebaõnnestus." };
  }

  refreshSite();
  redirect(`/admin/${key}`);
}

export async function deleteResourceAction(formData: FormData) {
  const key = String(formData.get("__resource") ?? "");
  const id = String(formData.get("__id") ?? "");
  const resource = getResource(key);
  if (!resource || !id) return;

  const { tenant } = await requireAdmin();
  await deleteRow(resource, tenant.id, id);
  refreshSite();
  redirect(`/admin/${key}`);
}

const CONTACT_KEYS: (keyof TenantContact)[] = [
  "phone",
  "email",
  "addressChurch",
  "addressOffice",
  "mapsUrl",
  "facebook",
  "instagram",
  "website",
  "iban",
  "ibanOwner",
  "ibanReference",
];

const THEME_KEYS: (keyof TenantTheme)[] = [
  "bg",
  "surface",
  "ink",
  "ink2",
  "ink3",
  "ink4",
  "line",
  "lineStrong",
  "brand",
];

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { tenant } = await requireAdmin();
  const db = requireDb();

  const text = (name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    return value === "" ? null : value;
  };

  const contact: TenantContact = {};
  for (const key of CONTACT_KEYS) {
    const value = text(`contact.${key}`);
    if (value) contact[key] = value;
  }

  const theme: TenantTheme = {};
  for (const key of THEME_KEYS) {
    const value = text(`theme.${key}`);
    if (value) theme[key] = value;
  }

  const name = text("name");
  const shortName = text("shortName");
  if (!name || !shortName) return { error: "Nimi ja lühinimi on kohustuslikud." };

  await db
    .update(tenants)
    .set({
      name,
      shortName,
      tagline: text("tagline"),
      description: text("description"),
      logoUrl: text("logoUrl"),
      domain: text("domain"),
      contact,
      theme,
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, tenant.id));

  refreshSite();
  return { ok: true };
}
