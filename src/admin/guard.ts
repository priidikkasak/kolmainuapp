import { cache } from "react";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tenants, type Tenant } from "@/db/schema";
import { getSession, type Session } from "@/lib/auth";
import { currentTenantSlug } from "@/lib/tenant";

export type AdminContext = { session: Session; tenant: Tenant };

/**
 * Every admin page and action goes through here. Owners without a fixed tenant
 * fall back to the tenant matching the current host, then the first one.
 */
export const requireAdmin = cache(async (): Promise<AdminContext> => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!db) redirect("/admin/seadistus");

  if (session.tenantId) {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, session.tenantId))
      .limit(1);
    if (tenant) return { session, tenant };
  }

  const slug = await currentTenantSlug();
  const [byHost] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
  if (byHost) return { session, tenant: byHost };

  const [first] = await db.select().from(tenants).orderBy(asc(tenants.createdAt)).limit(1);
  if (first) return { session, tenant: first };

  redirect("/admin/seadistus");
});
