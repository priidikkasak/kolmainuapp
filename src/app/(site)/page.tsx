import Link from "next/link";
import { BentoTile } from "@/components/bento-tile";
import { NewsCompact, Section } from "@/components/primitives";
import { getHomeTiles, getNews, getNextEvent } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";
import { formatDayMonth, formatTime } from "@/lib/date";

export default async function Home() {
  const [site, tiles, next, news] = await Promise.all([
    getSiteConfig(),
    getHomeTiles(),
    getNextEvent(),
    getNews(3),
  ]);

  return (
    <>
      <section className="py-2">
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
          {site.homeTitle}
        </h1>
        {site.homeSubtitle ? (
          <p className="mt-1.5 text-[15px] font-medium text-ink-2 tracking-tight">
            {site.homeSubtitle}
          </p>
        ) : null}
      </section>

      {next ? (
        <Link
          href="/kalender"
          prefetch
          className="mt-3 flex items-center gap-4 bg-surface rounded-[18px] px-5 py-[18px] transition-transform active:scale-[0.99]"
        >
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-ink-3 tracking-[0.06em] uppercase mb-1">
              Järgmine {formatDayMonth(next.startsAt)}
            </div>
            <div className="text-[16px] font-semibold text-ink tracking-tight leading-[1.25]">
              {next.title}
            </div>
            {next.location || next.meta ? (
              <div className="mt-0.5 text-[13px] font-medium text-ink-3">
                {[next.location, next.meta].filter(Boolean).join(", ")}
              </div>
            ) : null}
          </div>
          <div className="text-[22px] font-semibold text-ink tabular-nums whitespace-nowrap tracking-[-0.02em]">
            {formatTime(next.startsAt)}
          </div>
        </Link>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5 mt-6">
        {tiles.map((tile, i) => (
          <BentoTile
            key={tile.id}
            href={tile.href}
            image={tile.imageUrl ?? "/images/galerii.jpg"}
            label={tile.label}
            sublabel={tile.sublabel ?? ""}
            priority={i < 4}
          />
        ))}
      </div>

      {news.length ? (
        <Section label="Viimased teated" more={{ href: "/sundmused", label: "Kõik →" }}>
          <div className="flex flex-col gap-2">
            {news.map((item) => (
              <NewsCompact
                key={item.id}
                date={formatDayMonth(item.publishedAt)}
                title={item.title}
                href={item.href ?? "/sundmused"}
              />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
