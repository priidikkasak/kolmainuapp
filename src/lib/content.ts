import { cache } from "react";
import { and, asc, desc, eq, gte, lte, or } from "drizzle-orm";
import { db } from "@/db/client";
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
  verses,
  weeklyServices,
} from "@/db/schema";
import { currentTenant } from "@/lib/tenant";
import {
  seedEvents,
  seedDailyPhotos,
  seedGallery,
  seedHomeTiles,
  seedNews,
  seedPages,
  seedSermons,
  seedVerses,
  seedWeeklyServices,
} from "@/content/seed";
import type {
  EventKind,
  GalleryGroup,
  GalleryPhoto,
  HomeTile,
  NewsItem,
  Sermon,
  SiteEvent,
  SitePage,
  Verse,
  WeeklyService,
} from "@/lib/content-types";

/**
 * Read side of the CMS. Every getter falls back to the bundled seed content
 * when no database is configured, so the public site works on a bare deploy.
 */

async function scope() {
  if (!db) return null;
  const tenant = await currentTenant();
  return tenant ? { db, tenantId: tenant.id } : null;
}

export const getHomeTiles = cache(async (): Promise<HomeTile[]> => {
  const s = await scope();
  if (!s) return seedHomeTiles;
  const rows = await s.db
    .select()
    .from(homeTiles)
    .where(and(eq(homeTiles.tenantId, s.tenantId), eq(homeTiles.published, true)))
    .orderBy(asc(homeTiles.sortOrder));
  return rows.length ? rows.map((r) => ({ id: r.id, href: r.href, label: r.label, sublabel: r.sublabel, imageUrl: r.imageUrl })) : seedHomeTiles;
});

export const getUpcomingEvents = cache(async (limit = 40): Promise<SiteEvent[]> => {
  const from = new Date(Date.now() - 12 * 3_600_000);
  const s = await scope();
  if (!s) {
    return seedEvents
      .filter((e) => (e.endsAt ?? e.startsAt) >= from)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice(0, limit);
  }
  const rows = await s.db
    .select()
    .from(events)
    .where(
      and(
        eq(events.tenantId, s.tenantId),
        eq(events.published, true),
        or(gte(events.startsAt, from), gte(events.endsAt, from))
      )
    )
    .orderBy(asc(events.startsAt))
    .limit(limit);
  return rows.map(toSiteEvent);
});

function toSiteEvent(r: typeof events.$inferSelect): SiteEvent {
  return {
    id: r.id,
    title: r.title,
    meta: r.meta,
    location: r.location,
    startsAt: r.startsAt,
    endsAt: r.endsAt,
    kind: r.kind as EventKind,
    highlight: r.highlight,
  };
}

export const getHighlightEvents = cache(async (limit = 6): Promise<SiteEvent[]> => {
  const upcoming = await getUpcomingEvents(60);
  return upcoming.filter((e) => e.highlight).slice(0, limit);
});

export const getWeeklyServices = cache(async (): Promise<WeeklyService[]> => {
  const s = await scope();
  if (!s) return seedWeeklyServices;
  const rows = await s.db
    .select()
    .from(weeklyServices)
    .where(and(eq(weeklyServices.tenantId, s.tenantId), eq(weeklyServices.published, true)))
    .orderBy(asc(weeklyServices.sortOrder), asc(weeklyServices.weekday));
  return rows.length
    ? rows.map((r) => ({ id: r.id, title: r.title, weekday: r.weekday, time: r.time, meta: r.meta }))
    : seedWeeklyServices;
});

export const getNews = cache(async (limit = 10): Promise<NewsItem[]> => {
  const s = await scope();
  if (!s) return seedNews.slice(0, limit);
  const rows = await s.db
    .select()
    .from(news)
    .where(and(eq(news.tenantId, s.tenantId), eq(news.published, true)))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: r.excerpt,
    href: r.href,
    publishedAt: r.publishedAt,
  }));
});

export const getSermons = cache(async (limit = 20): Promise<Sermon[]> => {
  const s = await scope();
  if (!s) return seedSermons.slice(0, limit);
  const rows = await s.db
    .select()
    .from(sermons)
    .where(and(eq(sermons.tenantId, s.tenantId), eq(sermons.published, true)))
    .orderBy(desc(sermons.preachedAt))
    .limit(limit);
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    preacher: r.preacher,
    scripture: r.scripture,
    durationMin: r.durationMin,
    audioUrl: r.audioUrl,
    preachedAt: r.preachedAt,
  }));
});

/** Verse pinned to today, else a stable daily rotation through the pool. */
export const getVerseOfDay = cache(async (): Promise<Verse | null> => {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const s = await scope();
  if (!s) {
    return seedVerses.length ? seedVerses[dayIndex % seedVerses.length] : null;
  }
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay.getTime() + 86_400_000);
  const pinned = await s.db
    .select()
    .from(verses)
    .where(
      and(
        eq(verses.tenantId, s.tenantId),
        eq(verses.published, true),
        gte(verses.showOn, startOfDay),
        lte(verses.showOn, endOfDay)
      )
    )
    .limit(1);
  if (pinned[0]) return toVerse(pinned[0]);

  const pool = await s.db
    .select()
    .from(verses)
    .where(and(eq(verses.tenantId, s.tenantId), eq(verses.published, true)))
    .orderBy(asc(verses.sortOrder), asc(verses.id));
  if (!pool.length) return seedVerses[dayIndex % seedVerses.length] ?? null;
  return toVerse(pool[dayIndex % pool.length]);
});

function toVerse(r: typeof verses.$inferSelect): Verse {
  return { id: r.id, text: r.text, reference: r.reference, imageUrl: r.imageUrl };
}

/** Gallery category the Igapäevaelu feed reads from; kept out of the gallery page. */
export const DAILY_SLUG = "igapaevaelu";

export const getDailyPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  const s = await scope();
  if (!s) return seedDailyPhotos;
  const [cat] = await s.db
    .select()
    .from(galleryCategories)
    .where(and(eq(galleryCategories.tenantId, s.tenantId), eq(galleryCategories.slug, DAILY_SLUG)))
    .limit(1);
  if (!cat) return seedDailyPhotos;
  const imgs = await s.db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.categoryId, cat.id))
    .orderBy(asc(galleryImages.sortOrder));
  return imgs.length
    ? imgs.map((i) => ({ src: i.url, alt: i.alt ?? cat.title }))
    : seedDailyPhotos;
});

export const getGallery = cache(async (): Promise<GalleryGroup[]> => {
  const s = await scope();
  if (!s) return seedGallery;
  const cats = await s.db
    .select()
    .from(galleryCategories)
    .where(and(eq(galleryCategories.tenantId, s.tenantId), eq(galleryCategories.published, true)))
    .orderBy(asc(galleryCategories.sortOrder));
  const visible = cats.filter((c) => c.slug !== DAILY_SLUG);
  if (!visible.length) return seedGallery;
  const imgs = await s.db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.tenantId, s.tenantId))
    .orderBy(asc(galleryImages.sortOrder));
  return visible
    .map((cat) => ({
      id: cat.id,
      title: cat.title,
      photos: imgs
        .filter((i) => i.categoryId === cat.id)
        .map((i) => ({ src: i.url, alt: i.alt ?? cat.title })),
    }))
    .filter((g) => g.photos.length > 0);
});

export const getPage = cache(async (slug: string): Promise<SitePage | null> => {
  const fallback = seedPages.find((p) => p.slug === slug) ?? null;
  const s = await scope();
  if (!s) return fallback;

  const [page] = await s.db
    .select()
    .from(pages)
    .where(and(eq(pages.tenantId, s.tenantId), eq(pages.slug, slug)))
    .limit(1);
  if (!page || !page.published) return fallback;

  const sections = await s.db
    .select()
    .from(pageSections)
    .where(
      and(
        eq(pageSections.tenantId, s.tenantId),
        eq(pageSections.pageSlug, slug),
        eq(pageSections.published, true)
      )
    )
    .orderBy(asc(pageSections.sortOrder));

  const items = sections.length
    ? await s.db
        .select()
        .from(sectionItems)
        .where(eq(sectionItems.tenantId, s.tenantId))
        .orderBy(asc(sectionItems.sortOrder))
    : [];

  return {
    slug: page.slug,
    title: page.title,
    subtitle: page.subtitle,
    intro: page.intro,
    sections: sections.map((sec) => ({
      id: sec.id,
      label: sec.label,
      kind: (sec.kind as SitePage["sections"][number]["kind"]) ?? "prose",
      body: sec.body,
      anchor: sec.anchor,
      items: items
        .filter((i) => i.sectionId === sec.id)
        .map((i) => ({ id: i.id, title: i.title, meta: i.meta, aside: i.aside, href: i.href })),
    })),
  };
});
