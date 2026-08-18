import type {
  GalleryGroup,
  HomeTile,
  NewsItem,
  Sermon,
  SiteConfig,
  SiteEvent,
  SitePage,
  Verse,
  WeeklyService,
} from "@/lib/content-types";
import { fromLocalInput, zoned } from "@/lib/date";

/**
 * Bundled starter content for the Kolmainu tenant.
 *
 * Two jobs: it is what the public site renders before a database exists, and it
 * is what `npm run db:seed` writes into a fresh tenant. Dates are generated
 * relative to today so the demo calendar never looks abandoned.
 */

function at(daysFromNow: number, hour: number, minute = 0) {
  const base = new Date(Date.now() + daysFromNow * 86_400_000);
  const { year, month, day } = zoned(base);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    fromLocalInput(`${year}-${p(month)}-${p(day)}T${p(hour)}:${p(minute)}`) ?? base
  );
}

/** Days until the next occurrence of `weekday` (0 = Sunday), today included. */
function untilWeekday(weekday: number, weeksAhead = 0) {
  const today = zoned(new Date()).weekday;
  return ((weekday - today + 7) % 7) + weeksAhead * 7;
}

function onWeekday(weekday: number, weeksAhead: number, hour: number, minute = 0) {
  return at(untilWeekday(weekday, weeksAhead), hour, minute);
}

export const seedConfig: SiteConfig = {
  slug: "kolmainu",
  name: "EELK Rakvere Kolmainu kogudus",
  shortName: "Kolmainu",
  tagline: "Oled oodatud.",
  description: "Kolmainu koguduse äpp — jumalateenistused, sündmused, annetused",
  logoUrl: "/icons/logo.png",
  theme: {},
  contact: {
    phone: "324 3928",
    email: "rakvere@eelk.ee",
    addressChurch: "Pikk 19, 44311 Rakvere",
    addressOffice: "Pikk 21, 44311 Rakvere",
    mapsUrl: "https://maps.google.com/?q=Kolmainu+kirik+Rakvere",
    facebook: "Kolmainu kirik",
    instagram: "@kolmainu.rakvere",
    website: "https://kolmainu.ee",
    iban: "EE23 1010 2200 4587 5006",
    ibanOwner: "Kolmainu kogudus",
    ibanReference: "Annetus",
  },
};

export const seedHomeTiles: HomeTile[] = [
  { id: "t1", href: "/sundmused", label: "Sündmused", sublabel: "Erilised üritused", imageUrl: "/images/sundmused.jpg" },
  { id: "t2", href: "/talitused", label: "Talitused", sublabel: "Ristimine, matus, leer", imageUrl: "/images/talitused.jpg" },
  { id: "t3", href: "/muusika", label: "Muusika", sublabel: "Koor ja orelkontserdid", imageUrl: "/images/muusika.jpg" },
  { id: "t4", href: "/kogukond", label: "Kogukonnamaja", sublabel: "Hoolekanne ja tugi", imageUrl: "/images/kogukond.jpg" },
  { id: "t5", href: "/anneta", label: "Anneta", sublabel: "Toeta koguduse tööd", imageUrl: "/images/anneta.jpg" },
  { id: "t6", href: "/galerii", label: "Galerii", sublabel: "Fotod ja hetked", imageUrl: "/images/galerii.jpg" },
];

export const seedWeeklyServices: WeeklyService[] = [
  { id: "w1", title: "Jumalateenistus armulauaga", weekday: 0, time: "11.00", meta: "Iga pühapäev" },
  { id: "w2", title: "Orelkontsert", weekday: 3, time: "18.00", meta: "Iga kolmapäev" },
  { id: "w3", title: "Palvusetund", weekday: 3, time: "18.00", meta: "Iga kolmapäev" },
  { id: "w4", title: "Kammerkoori proov", weekday: 4, time: "19.00", meta: "Iga neljapäev" },
];

export const seedEvents: SiteEvent[] = [
  {
    id: "e1",
    title: "Jumalateenistus armulauaga",
    meta: "Õp. Tauno Toompuu",
    location: "Kirikusaal",
    startsAt: onWeekday(0, 0, 11),
    endsAt: null,
    kind: "teenistus",
    highlight: false,
  },
  {
    id: "e2",
    title: "Noorteõhtu",
    meta: null,
    location: "Kogudusesaalis",
    startsAt: onWeekday(0, 0, 17),
    endsAt: null,
    kind: "noored",
    highlight: false,
  },
  {
    id: "e3",
    title: "Palvusetund",
    meta: "Vaikimine ja palve altari ees",
    location: "Kirikusaal",
    startsAt: onWeekday(3, 0, 18),
    endsAt: null,
    kind: "palvus",
    highlight: false,
  },
  {
    id: "e4",
    title: "Kammerkoori proov",
    meta: "Uus hooaeg",
    location: "Kogudusesaalis",
    startsAt: onWeekday(4, 0, 19),
    endsAt: null,
    kind: "koor",
    highlight: true,
  },
  {
    id: "e5",
    title: "Jumalateenistus",
    meta: "Õp. Tauno Toompuu",
    location: "Kirikusaal",
    startsAt: onWeekday(0, 1, 11),
    endsAt: null,
    kind: "teenistus",
    highlight: false,
  },
  {
    id: "e6",
    title: "Orelkontsert",
    meta: "Andres Uibo",
    location: "Kirikusaal",
    startsAt: onWeekday(3, 1, 18),
    endsAt: null,
    kind: "koor",
    highlight: true,
  },
  {
    id: "e7",
    title: "Jumalateenistus armulauaga",
    meta: "Õp. Tauno Toompuu",
    location: "Kirikusaal",
    startsAt: onWeekday(0, 2, 11),
    endsAt: null,
    kind: "teenistus",
    highlight: false,
  },
  {
    id: "e8",
    title: "Suvine leerilaager",
    meta: "Registreerimine avatud",
    location: "Ontikal",
    startsAt: onWeekday(6, 2, 10),
    endsAt: onWeekday(4, 3, 16),
    kind: "noored",
    highlight: true,
  },
  {
    id: "e9",
    title: "Suvine koorikontsert",
    meta: "Kolmainu kammerkoor",
    location: "Kirikusaal",
    startsAt: onWeekday(6, 3, 19),
    endsAt: null,
    kind: "koor",
    highlight: true,
  },
];

export const seedNews: NewsItem[] = [
  {
    id: "n1",
    title: "Koorihooaeg algab augustis",
    excerpt: "Kammerkoor alustab uut hooaega. Uued lauljad on oodatud.",
    href: null,
    publishedAt: at(-3, 9),
  },
  {
    id: "n2",
    title: "Suvine leerilaager Ontikal",
    excerpt: "Registreerimine on avatud kuni laagri alguseni.",
    href: null,
    publishedAt: at(-7, 9),
  },
  {
    id: "n3",
    title: "Kiriku katuseremont algab",
    excerpt: "Tööd kestavad kaks kuud, teenistused toimuvad tavapäraselt.",
    href: null,
    publishedAt: at(-12, 9),
  },
  {
    id: "n4",
    title: "Nelja koguduse ühine palvusõhtu",
    excerpt: null,
    href: null,
    publishedAt: at(-16, 9),
  },
];

export const seedSermons: Sermon[] = [
  { id: "s1", title: "Vaikimise õnnistus", preacher: "õp. Tauno Toompuu", scripture: "Psalm 46:11", durationMin: 18, audioUrl: null, preachedAt: at(-4, 11) },
  { id: "s2", title: "Halastuse teekond", preacher: "õp. Tauno Toompuu", scripture: "Luuka 10:25-37", durationMin: 22, audioUrl: null, preachedAt: at(-11, 11) },
  { id: "s3", title: "Hea karjase kutse", preacher: "õp. Tauno Toompuu", scripture: "Johannese 10:11-16", durationMin: 20, audioUrl: null, preachedAt: at(-18, 11) },
  { id: "s4", title: "Rõõmust andmisest", preacher: "õp. Tauno Toompuu", scripture: "2. Korintlastele 9:7", durationMin: 16, audioUrl: null, preachedAt: at(-25, 11) },
  { id: "s5", title: "Uskuda, armastada, teenida", preacher: "õp. Tauno Toompuu", scripture: "1. Johannese 4:7-12", durationMin: 24, audioUrl: null, preachedAt: at(-32, 11) },
  { id: "s6", title: "Nelipühi jutlus", preacher: "õp. Tauno Toompuu", scripture: "Apostlite teod 2:1-13", durationMin: 26, audioUrl: null, preachedAt: at(-70, 11) },
  { id: "s7", title: "Ülestõusmispüha", preacher: "õp. Tauno Toompuu", scripture: "Markuse 16:1-8", durationMin: 28, audioUrl: null, preachedAt: at(-120, 11) },
  { id: "s8", title: "Suur reede", preacher: "õp. Tauno Toompuu", scripture: "Johannese 19:16-37", durationMin: 30, audioUrl: null, preachedAt: at(-122, 11) },
];

export const seedVerses: Verse[] = [
  { id: "v1", text: "Vaikige ja teadke, et mina olen Jumal.", reference: "Psalm 46:11", imageUrl: "/images/verse-bg.jpg" },
  { id: "v2", text: "Issand on mu karjane, mul pole millestki puudus.", reference: "Psalm 23:1", imageUrl: "/images/verse-bg-piibel.jpg" },
  { id: "v3", text: "Sinu sõna on mu jalale lambiks ja valguseks mu teerajal.", reference: "Psalm 119:105", imageUrl: "/images/verse-bg.jpg" },
  { id: "v4", text: "Armastage üksteist, nagu mina olen armastanud teid.", reference: "Johannese 15:12", imageUrl: "/images/verse-bg-piibel.jpg" },
];

const galleryCategories = [
  { slug: "outside", title: "Kirikuhoone", count: 14 },
  { slug: "inside", title: "Kirikusaal", count: 27 },
  { slug: "orel", title: "Orel", count: 3 },
  { slug: "paintings", title: "Maalid", count: 4 },
  { slug: "statues", title: "Skulptuurid ja detailid", count: 12 },
  { slug: "people", title: "Kogudus", count: 5 },
];

export const seedGallery: GalleryGroup[] = galleryCategories.map((cat) => ({
  id: cat.slug,
  title: cat.title,
  photos: Array.from({ length: cat.count }, (_, i) => ({
    src: `/gallery/${cat.slug}/${i + 1}.jpeg`,
    alt: `${cat.title} ${i + 1}`,
  })),
}));

export const seedPages: SitePage[] = [
  {
    slug: "meist",
    title: "Kogudus",
    subtitle: "EELK Rakvere Kolmainu kogudus, asutatud 1802. aastal.",
    intro:
      "Kolmainu kirik on Rakvere vanim ehitis. Kirikuhoone valmis 1802. aastal klassitsistlikus stiilis ja on pühendatud Püha Kolmainule. Kirik on olnud katkematult kasutuses üle kahe sajandi.\n\nMeie uksed on avatud igaühele: kes tuleb otsima, kes tänama, kes lihtsalt vaikima. Iga pühapäev kell 11 kutsume ühisele jumalateenistusele.",
    sections: [
      {
        id: "meist-kantselei",
        label: "Kantselei lahtiolekuajad",
        kind: "info",
        body: null,
        anchor: null,
        items: [
          { id: "mk1", title: "Teisipäeviti", meta: null, aside: "10.00 - 14.00", href: null },
          { id: "mk2", title: "Neljapäeviti", meta: null, aside: "15.00 - 18.00", href: null },
        ],
      },
      {
        id: "meist-vaimulikud",
        label: "Vaimulikud",
        kind: "info",
        body: null,
        anchor: null,
        items: [{ id: "mv1", title: "Õpetaja", meta: null, aside: "Tauno Toompuu", href: null }],
      },
    ],
  },
  {
    slug: "talitused",
    title: "Talitused",
    subtitle: "Kirikliku talituse tellimine ja info.",
    intro: null,
    sections: [
      {
        id: "tal-loend",
        label: "Sakramendid ja talitused",
        kind: "list",
        body: null,
        anchor: null,
        items: [
          { id: "tl1", title: "Ristimine", meta: "Laste ja täiskasvanute ristimine", aside: "Loe", href: "#ristimine" },
          { id: "tl2", title: "Leer ja konfirmatsioon", meta: "Leerikursused 3× aastas", aside: "Loe", href: "#leer" },
          { id: "tl3", title: "Laulatus", meta: "Kirikliku abielu õnnistamine", aside: "Loe", href: "#laulatus" },
          { id: "tl4", title: "Matusetalitus", meta: "Lahkunu ärasaatmine", aside: "Loe", href: "#matus" },
          { id: "tl5", title: "Armulaud", meta: "Igal pühapäevasel jumalateenistusel", aside: "11.00", href: null },
        ],
      },
      {
        id: "tal-ristimine",
        label: "Ristimine",
        kind: "prose",
        anchor: "ristimine",
        body:
          "Ristimine on kristliku elu algus, kus inimene võetakse Kristuse ihu ja koguduse osaduseks. Ristida saab nii lapsi kui täiskasvanuid.\n\nRistimise tellimiseks võta ühendust koguduse kantseleiga vähemalt kaks nädalat ette. Vestleme, planeerime aja ja arutame vaderite valikut.",
        items: [],
      },
      {
        id: "tal-leer",
        label: "Leer",
        kind: "prose",
        anchor: "leer",
        body:
          "Leer on kirikliku elu õppetund, mille lõpul konfirmeeritakse leerilaps koguduse täisliikmeks. Kolmainu koguduses toimub kolm leerikursust aastas: kevadel, sügisel ja suvisel leerilaagril.\n\nJärgmine leerilaager toimub Ontikal. Registreerimine on avatud kuni laagri alguseni.",
        items: [],
      },
      {
        id: "tal-laulatus",
        label: "Laulatus",
        kind: "prose",
        anchor: "laulatus",
        body:
          "Kirikliku laulatuse eelduseks on, et vähemalt üks abikaasadest on koguduse liige. Enne laulatust toimub kohtumine vaimulikuga, kus arutame talituse käiku ja kirikliku abielu tähendust.\n\nLaulatuse tellimiseks võta ühendust vähemalt kolm kuud enne planeeritud kuupäeva.",
        items: [],
      },
      {
        id: "tal-matus",
        label: "Matusetalitus",
        kind: "prose",
        anchor: "matus",
        body:
          "Matusetalitus võib toimuda kabelis, kirikus või kalmistul. Vaimuliku poole võib pöörduda ka öösel. Leinajaid ei jäeta üksi.\n\nPalun helista kantseleisse esimesel võimalusel pärast lahkumist, et koos plaanida sobiv aeg ja koht.",
        items: [],
      },
    ],
  },
  {
    slug: "muusika",
    title: "Muusika",
    subtitle: "Koor, orel ja koguduse muusikaelu.",
    intro: null,
    sections: [
      {
        id: "mus-koor",
        label: "Kammerkoor",
        kind: "prose",
        anchor: null,
        body:
          "Kolmainu kammerkoor teenib jumalateenistustel ja esineb kontsertidel. Uued lauljad on alati oodatud. Eelnevat kogemust ei nõuta.",
        items: [],
      },
      {
        id: "mus-proovid",
        label: "Proovid ja kontakt",
        kind: "info",
        anchor: null,
        body: null,
        items: [
          { id: "mp1", title: "Proovid", meta: null, aside: "Neljapäeviti 19.00 kuni 21.00", href: null },
          { id: "mp2", title: "Kontakt", meta: null, aside: "koor@kolmainu.ee", href: "mailto:koor@kolmainu.ee" },
        ],
      },
      {
        id: "mus-orel",
        label: "Kirikuorel",
        kind: "prose",
        anchor: null,
        body:
          "Kolmainu kiriku orel on ehitatud 1902. aastal Saueri firma poolt Frankfurdis. Instrument on üks Rakvere paremini säilinud ajaloolisi oreleid ning meelitab kokku külalisorganiste kogu Eestist.\n\nIga kolmapäev kell 18.00 toimub tasuta orelkontsert, mõtisklushetk keset nädalat.",
        items: [],
      },
    ],
  },
  {
    slug: "kogukond",
    title: "Kogukonnamaja",
    subtitle: "Hoolime üksteisest, eriti neist, kes seda enim vajavad.",
    intro:
      "Kolmainu koguduse Kogukonnamaja pakub tuge intellektipuudega inimestele ja nende peredele. Meie eesmärk on igaühele elu keskel koht, kuhu kuuluda.",
    sections: [
      {
        id: "kog-teenused",
        label: "Teenused",
        kind: "list",
        anchor: null,
        body: null,
        items: [
          { id: "kt1", title: "Kogukonnas elamise teenus", meta: "Intellektipuudega täiskasvanutele", aside: null, href: null },
          { id: "kt2", title: "Toetatud töötamine", meta: "Erihoolekandeteenus", aside: null, href: null },
          { id: "kt3", title: "Igapäevaelu toetamine", meta: "Perede toetus ja nõustamine", aside: null, href: null },
          { id: "kt4", title: "Diakoonia", meta: "Abi peredele ja üksikutele", aside: null, href: null },
        ],
      },
      {
        id: "kog-kontakt",
        label: "Võta ühendust",
        kind: "prose",
        anchor: null,
        body:
          "Kui tead peret või inimest, kes vajab abi, või soovid ise vabatahtlikuna kaasa aidata, kirjuta või helista. Iga käepaar loeb.",
        items: [],
      },
      {
        id: "kog-kontaktid",
        label: null,
        kind: "info",
        anchor: null,
        body: null,
        items: [
          { id: "kk1", title: "Telefon", meta: null, aside: "324 3928", href: "tel:+3723243928" },
          { id: "kk2", title: "E-post", meta: null, aside: "kogukonnamaja@kolmainu.ee", href: "mailto:kogukonnamaja@kolmainu.ee" },
        ],
      },
    ],
  },
  {
    slug: "piibel",
    title: "Piibel",
    subtitle: "Kirjakoht päevaks ja igapäevane lugemine.",
    intro: null,
    sections: [
      {
        id: "pii-loe",
        label: "Loe edasi",
        kind: "list",
        anchor: null,
        body: null,
        items: [
          { id: "pl1", title: "Vana Testament", meta: "39 raamatut, 929 peatükki", aside: "Ava", href: "https://piibel.net" },
          { id: "pl2", title: "Uus Testament", meta: "27 raamatut, 260 peatükki", aside: "Ava", href: "https://piibel.net" },
          { id: "pl3", title: "Lugemiskava", meta: "Piibel läbi ühe aastaga", aside: "Alusta", href: "https://piibel.net" },
        ],
      },
    ],
  },
  {
    slug: "anneta",
    title: "Anneta",
    subtitle: "Toeta koguduse tööd. Iga panus loeb.",
    intro: null,
    sections: [],
  },
];
