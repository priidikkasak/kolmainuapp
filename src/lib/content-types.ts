import type { TenantContact, TenantTheme } from "@/db/schema";

export type { TenantContact, TenantTheme };

export type EventKind = "teenistus" | "palvus" | "koor" | "noored" | "muu";

export type SiteEvent = {
  id: string;
  title: string;
  meta: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
  kind: EventKind;
  highlight: boolean;
};

export type WeeklyService = {
  id: string;
  title: string;
  weekday: number;
  time: string | null;
  meta: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string | null;
  href: string | null;
  publishedAt: Date;
};

export type Sermon = {
  id: string;
  title: string;
  preacher: string | null;
  scripture: string | null;
  durationMin: number | null;
  audioUrl: string | null;
  preachedAt: Date;
};

export type Verse = {
  id: string;
  text: string;
  reference: string;
  imageUrl: string | null;
};

export type GalleryPhoto = { src: string; alt: string };

export type GalleryGroup = {
  id: string;
  title: string;
  photos: GalleryPhoto[];
};

export type HomeTile = {
  id: string;
  href: string;
  label: string;
  sublabel: string | null;
  imageUrl: string | null;
};

export type SectionItem = {
  id: string;
  title: string;
  meta: string | null;
  aside: string | null;
  href: string | null;
};

export type SectionKind = "prose" | "list" | "info";

export type SiteSection = {
  id: string;
  label: string | null;
  kind: SectionKind;
  body: string | null;
  anchor: string | null;
  items: SectionItem[];
};

export type SitePage = {
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  sections: SiteSection[];
};

export type SiteConfig = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  theme: TenantTheme;
  contact: TenantContact;
};
