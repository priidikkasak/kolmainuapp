import { loadEnv } from "./load-env";

loadEnv();

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  events,
  galleryCategories,
  galleryImages,
  homeTiles,
  news,
  pageSections,
  pages,
  sectionItems,
  sermons,
  tenants,
  users,
  verses,
  weeklyServices,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/password";
import {
  seedConfig,
  seedEvents,
  seedGallery,
  seedHomeTiles,
  seedNews,
  seedPages,
  seedSermons,
  seedVerses,
  seedWeeklyServices,
} from "../src/content/seed";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL puudub. Lisa see .env.local faili.");
  process.exit(1);
}

const force = process.argv.includes("--force");
const sql = postgres(url, { max: 1, prepare: false });
const db = drizzle(sql);

async function main() {
  const slug = process.env.DEFAULT_TENANT ?? seedConfig.slug;

  let [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
  if (!tenant) {
    [tenant] = await db
      .insert(tenants)
      .values({
        slug,
        name: seedConfig.name,
        shortName: seedConfig.shortName,
        tagline: seedConfig.tagline,
        description: seedConfig.description,
        logoUrl: seedConfig.logoUrl,
        theme: seedConfig.theme,
        contact: seedConfig.contact,
      })
      .returning();
    console.log(`Kogudus loodud: ${tenant.slug}`);
  } else {
    console.log(`Kogudus olemas: ${tenant.slug}`);
  }

  const tenantId = tenant.id;

  const existing = await db.select().from(events).where(eq(events.tenantId, tenantId)).limit(1);
  if (existing.length && !force) {
    console.log("Sisu on juba olemas — jätan vahele. Ülekirjutamiseks: npm run db:seed -- --force");
  } else {
    if (force) {
      await db.delete(sectionItems).where(eq(sectionItems.tenantId, tenantId));
      await db.delete(pageSections).where(eq(pageSections.tenantId, tenantId));
      await db.delete(pages).where(eq(pages.tenantId, tenantId));
      await db.delete(galleryImages).where(eq(galleryImages.tenantId, tenantId));
      await db.delete(galleryCategories).where(eq(galleryCategories.tenantId, tenantId));
      await db.delete(homeTiles).where(eq(homeTiles.tenantId, tenantId));
      await db.delete(verses).where(eq(verses.tenantId, tenantId));
      await db.delete(sermons).where(eq(sermons.tenantId, tenantId));
      await db.delete(news).where(eq(news.tenantId, tenantId));
      await db.delete(weeklyServices).where(eq(weeklyServices.tenantId, tenantId));
      await db.delete(events).where(eq(events.tenantId, tenantId));
      console.log("Vana sisu kustutatud.");
    }

    await db.insert(homeTiles).values(
      seedHomeTiles.map((tile, i) => ({
        tenantId,
        href: tile.href,
        label: tile.label,
        sublabel: tile.sublabel,
        imageUrl: tile.imageUrl,
        sortOrder: i,
      }))
    );

    await db.insert(weeklyServices).values(
      seedWeeklyServices.map((service, i) => ({
        tenantId,
        title: service.title,
        weekday: service.weekday,
        time: service.time,
        meta: service.meta,
        sortOrder: i,
      }))
    );

    await db.insert(events).values(
      seedEvents.map((event) => ({
        tenantId,
        title: event.title,
        meta: event.meta,
        location: event.location,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        kind: event.kind,
        highlight: event.highlight,
      }))
    );

    await db.insert(news).values(
      seedNews.map((item) => ({
        tenantId,
        title: item.title,
        excerpt: item.excerpt,
        href: item.href,
        publishedAt: item.publishedAt,
      }))
    );

    await db.insert(sermons).values(
      seedSermons.map((sermon) => ({
        tenantId,
        title: sermon.title,
        preacher: sermon.preacher,
        scripture: sermon.scripture,
        durationMin: sermon.durationMin,
        audioUrl: sermon.audioUrl,
        preachedAt: sermon.preachedAt,
      }))
    );

    await db.insert(verses).values(
      seedVerses.map((verse, i) => ({
        tenantId,
        text: verse.text,
        reference: verse.reference,
        imageUrl: verse.imageUrl,
        sortOrder: i,
      }))
    );

    for (const [index, group] of seedGallery.entries()) {
      const [category] = await db
        .insert(galleryCategories)
        .values({ tenantId, slug: group.id, title: group.title, sortOrder: index })
        .returning();
      await db.insert(galleryImages).values(
        group.photos.map((photo, i) => ({
          tenantId,
          categoryId: category.id,
          url: photo.src,
          alt: photo.alt,
          sortOrder: i,
        }))
      );
    }

    for (const page of seedPages) {
      await db.insert(pages).values({
        tenantId,
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle,
        intro: page.intro,
      });
      for (const [index, section] of page.sections.entries()) {
        const [saved] = await db
          .insert(pageSections)
          .values({
            tenantId,
            pageSlug: page.slug,
            label: section.label,
            kind: section.kind,
            body: section.body,
            anchor: section.anchor,
            sortOrder: index,
          })
          .returning();
        if (section.items.length) {
          await db.insert(sectionItems).values(
            section.items.map((item, i) => ({
              tenantId,
              sectionId: saved.id,
              title: item.title,
              meta: item.meta,
              aside: item.aside,
              href: item.href,
              sortOrder: i,
            }))
          );
        }
      }
    }

    console.log("Näidissisu lisatud.");
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      await db
        .update(users)
        .set({ passwordHash: hashPassword(password), tenantId })
        .where(eq(users.id, existingUser.id));
      console.log(`Kasutaja parool uuendatud: ${email}`);
    } else {
      await db.insert(users).values({
        tenantId,
        email,
        name: process.env.ADMIN_NAME ?? null,
        passwordHash: hashPassword(password),
        role: "owner",
      });
      console.log(`Kasutaja loodud: ${email}`);
    }
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD puuduvad — kasutajat ei loodud.");
  }
}

main()
  .then(() => sql.end())
  .catch(async (error) => {
    console.error(error);
    await sql.end();
    process.exit(1);
  });
