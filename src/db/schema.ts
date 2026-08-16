import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Every content row is scoped by `tenantId`. One deploy can serve many
 * congregations — the tenant is resolved from the request host.
 */

export type TenantTheme = {
  bg?: string;
  surface?: string;
  ink?: string;
  ink2?: string;
  ink3?: string;
  ink4?: string;
  line?: string;
  lineStrong?: string;
  brand?: string;
};

export type TenantContact = {
  phone?: string;
  email?: string;
  addressChurch?: string;
  addressOffice?: string;
  mapsUrl?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  iban?: string;
  ibanOwner?: string;
  ibanReference?: string;
};

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  domain: text("domain"),
  tagline: text("tagline"),
  description: text("description"),
  logoUrl: text("logo_url"),
  homeTitle: text("home_title"),
  homeSubtitle: text("home_subtitle"),
  theme: jsonb("theme").$type<TenantTheme>().notNull().default({}),
  contact: jsonb("contact").$type<TenantContact>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    // "owner" can manage every tenant, "admin" only its own
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

const tenantId = () =>
  uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" });

/** Dated happenings — feeds both /kalender and /sundmused. */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: tenantId(),
    title: text("title").notNull(),
    meta: text("meta"),
    location: text("location"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    // teenistus | palvus | koor | noored | muu
    kind: text("kind").notNull().default("teenistus"),
    highlight: boolean("highlight").notNull().default(false),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_tenant_start_idx").on(t.tenantId, t.startsAt)]
);

/** Recurring weekly rhythm shown as "Iganädalased". */
export const weeklyServices = pgTable("weekly_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  title: text("title").notNull(),
  // 0 = Sunday … 6 = Saturday
  weekday: integer("weekday").notNull().default(0),
  time: text("time"),
  meta: text("meta"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const news = pgTable("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body"),
  href: text("href"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  published: boolean("published").notNull().default(true),
});

export const sermons = pgTable("sermons", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  title: text("title").notNull(),
  preacher: text("preacher"),
  scripture: text("scripture"),
  durationMin: integer("duration_min"),
  audioUrl: text("audio_url"),
  body: text("body"),
  preachedAt: timestamp("preached_at", { withTimezone: true }).notNull().defaultNow(),
  published: boolean("published").notNull().default(true),
});

export const verses = pgTable("verses", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  text: text("text").notNull(),
  reference: text("reference").notNull(),
  imageUrl: text("image_url"),
  // when set, this verse is shown on that day; otherwise it rotates
  showOn: timestamp("show_on", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const galleryCategories = pgTable("gallery_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const galleryImages = pgTable(
  "gallery_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: tenantId(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => galleryCategories.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("gallery_images_cat_idx").on(t.categoryId, t.sortOrder)]
);

/** Home screen bento tiles — congregation-specific navigation. */
export const homeTiles = pgTable("home_tiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: tenantId(),
  href: text("href").notNull(),
  label: text("label").notNull(),
  sublabel: text("sublabel"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

/** Editable content pages: /meist, /talitused, /muusika, /kogukond, /anneta, /piibel */
export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: tenantId(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    // plain text, blank line = new paragraph
    intro: text("intro"),
    published: boolean("published").notNull().default(true),
  },
  (t) => [uniqueIndex("pages_tenant_slug_idx").on(t.tenantId, t.slug)]
);

/**
 * Sections belong to a page slug rather than a page row, so a section can be
 * created before the page itself exists.
 */
export const pageSections = pgTable(
  "page_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: tenantId(),
    pageSlug: text("page_slug").notNull(),
    label: text("label"),
    // prose | list | info
    kind: text("kind").notNull().default("prose"),
    body: text("body"),
    anchor: text("anchor"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
  },
  (t) => [index("page_sections_slug_idx").on(t.tenantId, t.pageSlug, t.sortOrder)]
);

export const sectionItems = pgTable(
  "section_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: tenantId(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => pageSections.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    meta: text("meta"),
    aside: text("aside"),
    href: text("href"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("section_items_section_idx").on(t.sectionId, t.sortOrder)]
);

export type Tenant = typeof tenants.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type WeeklyServiceRow = typeof weeklyServices.$inferSelect;
export type NewsRow = typeof news.$inferSelect;
export type SermonRow = typeof sermons.$inferSelect;
export type VerseRow = typeof verses.$inferSelect;
export type GalleryCategoryRow = typeof galleryCategories.$inferSelect;
export type GalleryImageRow = typeof galleryImages.$inferSelect;
export type HomeTileRow = typeof homeTiles.$inferSelect;
export type PageRow = typeof pages.$inferSelect;
export type PageSectionRow = typeof pageSections.$inferSelect;
export type SectionItemRow = typeof sectionItems.$inferSelect;
