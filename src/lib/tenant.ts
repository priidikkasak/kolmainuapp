import { cache } from "react";
import { headers } from "next/headers";
import { eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { tenants, type Tenant } from "@/db/schema";
import { seedConfig } from "@/content/seed";
import type { SiteConfig } from "@/lib/content-types";

export const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT ?? "kolmainu";

/**
 * Host → tenant slug. `kolmainu.ee`, `www.kolmainu.ee` and `kolmainu.<host>`
 * all resolve to `kolmainu`; anything unrecognised falls back to the default.
 */
export function slugFromHost(host: string | null): string {
  if (!host) return DEFAULT_TENANT_SLUG;
  const clean = host.split(":")[0].toLowerCase().replace(/^www\./, "");
  if (clean === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(clean)) {
    return DEFAULT_TENANT_SLUG;
  }
  // Vercel preview URLs carry no tenant signal.
  if (clean.endsWith(".vercel.app")) return DEFAULT_TENANT_SLUG;
  return clean.split(".")[0] || DEFAULT_TENANT_SLUG;
}

export const currentTenantSlug = cache(async () => {
  const h = await headers();
  return slugFromHost(h.get("x-forwarded-host") ?? h.get("host"));
});

/** The tenant row, or null when there is no database yet. */
export const currentTenant = cache(async (): Promise<Tenant | null> => {
  if (!db) return null;
  const slug = await currentTenantSlug();
  const host = (await headers()).get("host")?.split(":")[0] ?? "";
  const rows = await db
    .select()
    .from(tenants)
    .where(or(eq(tenants.slug, slug), eq(tenants.domain, host)))
    .limit(1);
  if (rows[0]) return rows[0];
  const fallback = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, DEFAULT_TENANT_SLUG))
    .limit(1);
  return fallback[0] ?? null;
});

export function toSiteConfig(tenant: Tenant): SiteConfig {
  return {
    slug: tenant.slug,
    name: tenant.name,
    shortName: tenant.shortName,
    tagline: tenant.tagline,
    description: tenant.description,
    logoUrl: tenant.logoUrl,
    homeTitle: tenant.homeTitle ?? "Tere tulemast",
    homeSubtitle: tenant.homeSubtitle,
    theme: tenant.theme ?? {},
    contact: tenant.contact ?? {},
  };
}

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const tenant = await currentTenant();
  return tenant ? toSiteConfig(tenant) : seedConfig;
});
