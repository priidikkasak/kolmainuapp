import { BentoTile } from "@/components/bento-tile";
import { getHomeTiles } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";

export default async function Home() {
  const [site, tiles] = await Promise.all([getSiteConfig(), getHomeTiles()]);

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
    </>
  );
}
