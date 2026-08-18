import type { PgTable } from "drizzle-orm/pg-core";
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
  users,
  verses,
  weeklyServices,
} from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { formatDayMonth, formatLongDate, formatTime, ET_WEEKDAYS } from "@/lib/date";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "datetime"
  | "bool"
  | "select"
  | "image"
  | "ref"
  | "password";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** For `ref` fields: which resource supplies the dropdown. */
  refResource?: string;
  /** Column is written on create but left untouched when left blank on edit. */
  optionalOnEdit?: boolean;
};

export type Row = Record<string, unknown>;

export type Resource = {
  key: string;
  label: string;
  singular: string;
  description?: string;
  table: PgTable;
  fields: Field[];
  /** Column used as the dropdown label when another resource references this one. */
  labelColumn: string;
  orderBy: { name: string; dir: "asc" | "desc" }[];
  title: (row: Row) => string;
  meta?: (row: Row) => string | null;
  /** Hidden from the admin sidebar; still reachable and used for `ref` lookups. */
  hidden?: boolean;
  /** Rows are global rather than tenant-scoped. */
  global?: boolean;
  beforeSave?: (values: Row, isCreate: boolean) => Row;
};

const KINDS = [
  { value: "teenistus", label: "Teenistus" },
  { value: "palvus", label: "Palvus" },
  { value: "koor", label: "Muusika" },
  { value: "noored", label: "Noortele" },
  { value: "muu", label: "Muu" },
];

const WEEKDAYS = ET_WEEKDAYS.map((label, value) => ({ value: String(value), label }));

const SECTION_KINDS = [
  { value: "prose", label: "Tekst" },
  { value: "list", label: "Loend" },
  { value: "info", label: "Info read" },
];

const PAGE_SLUGS = [
  { value: "meist", label: "Kogudus (/meist)" },
  { value: "talitused", label: "Talitused (/talitused)" },
  { value: "muusika", label: "Muusika (/muusika)" },
  { value: "kogukond", label: "Kogukonnamaja (/kogukond)" },
  { value: "piibel", label: "Piibel (/piibel)" },
  { value: "anneta", label: "Anneta (/anneta)" },
];

const asDate = (v: unknown) => (v instanceof Date ? v : null);
const asText = (v: unknown) => (typeof v === "string" ? v : null);

export const RESOURCES: Resource[] = [
  {
    key: "sundmused",
    label: "Sündmused",
    singular: "Sündmus",
    description: "Kalendrisse ja sündmuste lehele",
    table: events,
    labelColumn: "title",
    orderBy: [{ name: "startsAt", dir: "desc" }],
    title: (r) => String(r.title),
    meta: (r) => {
      const d = asDate(r.startsAt);
      return d ? `${formatLongDate(d)} · ${formatTime(d)}` : null;
    },
    fields: [
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "startsAt", label: "Algus", type: "datetime", required: true },
      { name: "endsAt", label: "Lõpp", type: "datetime", help: "Täida ainult mitmepäevase sündmuse puhul" },
      { name: "kind", label: "Tüüp", type: "select", options: KINDS, required: true },
      { name: "location", label: "Koht", type: "text", placeholder: "Kirikusaal" },
      { name: "meta", label: "Lisainfo", type: "text", placeholder: "Õp. Tauno Toompuu" },
      { name: "highlight", label: "Tõsta esile", type: "bool", help: "Kuvatakse „Tähtsündmuste“ all" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "teenistused",
    label: "Iganädalased",
    singular: "Iganädalane teenistus",
    description: "Korduv nädalarütm",
    table: weeklyServices,
    labelColumn: "title",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.title),
    meta: (r) => {
      const day = ET_WEEKDAYS[Number(r.weekday) || 0];
      return [day, asText(r.time)].filter(Boolean).join(" · ");
    },
    fields: [
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "weekday", label: "Nädalapäev", type: "select", options: WEEKDAYS, required: true },
      { name: "time", label: "Kellaaeg", type: "text", placeholder: "11.00" },
      { name: "meta", label: "Lisainfo", type: "text", placeholder: "Iga pühapäev" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "teated",
    label: "Teated",
    singular: "Teade",
    description: "Avalehe uudisvoog",
    table: news,
    labelColumn: "title",
    orderBy: [{ name: "publishedAt", dir: "desc" }],
    title: (r) => String(r.title),
    meta: (r) => {
      const d = asDate(r.publishedAt);
      return d ? formatDayMonth(d) : null;
    },
    fields: [
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "excerpt", label: "Lühikokkuvõte", type: "textarea" },
      { name: "body", label: "Sisu", type: "textarea", help: "Tühi rida alustab uut lõiku" },
      { name: "publishedAt", label: "Kuupäev", type: "datetime", required: true },
      { name: "href", label: "Link", type: "text", placeholder: "https://…" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "jutlused",
    label: "Jutlused",
    singular: "Jutlus",
    table: sermons,
    labelColumn: "title",
    orderBy: [{ name: "preachedAt", dir: "desc" }],
    title: (r) => String(r.title),
    meta: (r) => {
      const d = asDate(r.preachedAt);
      return [d ? formatDayMonth(d) : null, asText(r.preacher)].filter(Boolean).join(" · ") || null;
    },
    fields: [
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "preachedAt", label: "Kuupäev", type: "datetime", required: true },
      { name: "preacher", label: "Jutlustaja", type: "text", placeholder: "õp. Tauno Toompuu" },
      { name: "scripture", label: "Kirjakoht", type: "text", placeholder: "Psalm 46:11" },
      { name: "durationMin", label: "Pikkus minutites", type: "number" },
      { name: "audioUrl", label: "Helifaili link", type: "text" },
      { name: "body", label: "Tekst", type: "textarea" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "kirjakohad",
    label: "Kirjakohad",
    singular: "Kirjakoht",
    description: "Päeva salm",
    table: verses,
    labelColumn: "reference",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.reference),
    meta: (r) => String(r.text ?? "").slice(0, 60),
    fields: [
      { name: "text", label: "Salm", type: "textarea", required: true },
      { name: "reference", label: "Viide", type: "text", required: true, placeholder: "Psalm 46:11" },
      { name: "imageUrl", label: "Taustapilt", type: "image" },
      { name: "showOn", label: "Näita kuupäeval", type: "datetime", help: "Tühjaks jättes rotreerub automaatselt" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "galerii",
    label: "Galerii kaustad",
    singular: "Galerii kaust",
    table: galleryCategories,
    labelColumn: "title",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.title),
    meta: (r) => String(r.slug),
    fields: [
      { name: "title", label: "Nimi", type: "text", required: true },
      { name: "slug", label: "Lühinimi", type: "text", required: true, placeholder: "kirikusaal" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "galerii-pildid",
    label: "Galerii pildid",
    singular: "Pilt",
    table: galleryImages,
    labelColumn: "alt",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.alt || r.url),
    meta: (r) => String(r.url),
    fields: [
      { name: "categoryId", label: "Kaust", type: "ref", refResource: "galerii", required: true },
      { name: "url", label: "Pilt", type: "image", required: true },
      { name: "alt", label: "Kirjeldus", type: "text", help: "Ekraanilugejale ja SEO jaoks" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
    ],
  },
  {
    key: "avaleht",
    label: "Avalehe plaadid",
    singular: "Plaat",
    description: "Avalehe ruudustik",
    table: homeTiles,
    labelColumn: "label",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.label),
    meta: (r) => String(r.href),
    fields: [
      { name: "label", label: "Pealkiri", type: "text", required: true },
      { name: "href", label: "Link", type: "text", required: true, placeholder: "/sundmused" },
      { name: "imageUrl", label: "Pilt", type: "image" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "lehed",
    label: "Lehed",
    singular: "Leht",
    description: "Pealkirjad ja sissejuhatused",
    table: pages,
    labelColumn: "title",
    orderBy: [{ name: "slug", dir: "asc" }],
    title: (r) => String(r.title),
    meta: (r) => `/${r.slug}`,
    fields: [
      { name: "slug", label: "Leht", type: "select", options: PAGE_SLUGS, required: true },
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "subtitle", label: "Alapealkiri", type: "textarea" },
      { name: "intro", label: "Sissejuhatus", type: "textarea", help: "Tühi rida alustab uut lõiku" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "lehe-osad",
    label: "Lehe osad",
    singular: "Lehe osa",
    description: "Plokid lehtedel",
    table: pageSections,
    labelColumn: "label",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.label || r.kind),
    meta: (r) => `/${r.pageSlug}`,
    fields: [
      { name: "pageSlug", label: "Leht", type: "select", options: PAGE_SLUGS, required: true },
      { name: "label", label: "Pealkiri", type: "text" },
      { name: "kind", label: "Tüüp", type: "select", options: SECTION_KINDS, required: true },
      { name: "body", label: "Tekst", type: "textarea", help: "Ainult tüübi „Tekst“ puhul" },
      { name: "anchor", label: "Ankur", type: "text", help: "Nt „ristimine“, et lingid #ristimine töötaks" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
      { name: "published", label: "Avaldatud", type: "bool" },
    ],
  },
  {
    key: "lehe-read",
    label: "Lehe read",
    singular: "Rida",
    description: "Loendi ja inforidade sisu",
    table: sectionItems,
    labelColumn: "title",
    orderBy: [{ name: "sortOrder", dir: "asc" }],
    title: (r) => String(r.title),
    meta: (r) => asText(r.meta) ?? asText(r.aside),
    fields: [
      { name: "sectionId", label: "Lehe osa", type: "ref", refResource: "lehe-osad", required: true },
      { name: "title", label: "Pealkiri", type: "text", required: true },
      { name: "meta", label: "Lisainfo", type: "text" },
      { name: "aside", label: "Parem serv", type: "text", placeholder: "11.00" },
      { name: "href", label: "Link", type: "text" },
      { name: "sortOrder", label: "Järjekord", type: "number" },
    ],
  },
  {
    key: "kasutajad",
    label: "Kasutajad",
    singular: "Kasutaja",
    description: "Kes pääseb sisuhaldusse",
    table: users,
    labelColumn: "email",
    orderBy: [{ name: "email", dir: "asc" }],
    title: (r) => String(r.name || r.email),
    meta: (r) => String(r.email),
    fields: [
      { name: "email", label: "E-post", type: "text", required: true },
      { name: "name", label: "Nimi", type: "text" },
      {
        name: "passwordHash",
        label: "Parool",
        type: "password",
        optionalOnEdit: true,
        help: "Muutmisel jäta tühjaks, kui parool ei muutu",
      },
    ],
    beforeSave: (values, isCreate) => {
      const raw = values.passwordHash;
      if (typeof raw === "string" && raw.length > 0) {
        return { ...values, passwordHash: hashPassword(raw) };
      }
      if (isCreate) throw new Error("Parool on kohustuslik.");
      const rest = { ...values };
      delete rest.passwordHash;
      return rest;
    },
  },
];

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((r) => r.key === key);
}

export const VISIBLE_RESOURCES = RESOURCES.filter((r) => !r.hidden);
