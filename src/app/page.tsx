import Link from "next/link";
import { BentoTile } from "@/components/bento-tile";
import { Section, NewsCompact } from "@/components/primitives";

const tiles = [
  { href: "/sundmused", image: "/images/sundmused.jpg", label: "Sündmused", sublabel: "Erilised üritused" },
  { href: "/talitused", image: "/images/talitused.jpg", label: "Talitused", sublabel: "Ristimine, matus, leer" },
  { href: "/muusika", image: "/images/muusika.jpg", label: "Muusika", sublabel: "Koor ja orelkontserdid" },
  { href: "/kogukond", image: "/images/kogukond.jpg", label: "Kogukonnamaja", sublabel: "Hoolekanne ja tugi" },
  { href: "/anneta", image: "/images/anneta.jpg", label: "Anneta", sublabel: "Toeta koguduse tööd" },
  { href: "/galerii", image: "/images/galerii.jpg", label: "Galerii", sublabel: "Fotod ja hetked" },
] as const;

export default function Home() {
  return (
    <>
      <section className="py-2">
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
          Tere tulemast
        </h1>
        <p className="mt-1.5 text-[15px] font-medium text-ink-2 tracking-tight">
          Oled oodatud.
        </p>
      </section>

      <Link
        href="/kalender"
        prefetch
        className="mt-3 flex items-center gap-4 bg-surface rounded-[18px] px-5 py-[18px] transition-transform active:scale-[0.99]"
      >
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-ink-3 tracking-[0.06em] uppercase mb-1">
            Järgmine missa
          </div>
          <div className="text-[16px] font-semibold text-ink tracking-tight leading-[1.25]">
            Jumalateenistus armulauaga
          </div>
          <div className="mt-0.5 text-[13px] font-medium text-ink-3">
            Kirikusaal, õp. Tauno Toompuu
          </div>
        </div>
        <div className="text-[22px] font-semibold text-ink tabular-nums whitespace-nowrap tracking-[-0.02em]">
          11.00
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2.5 mt-6">
        {tiles.map((t, i) => (
          <BentoTile key={t.href} {...t} priority={i < 4} />
        ))}
      </div>

      <Section label="Viimased teated" more={{ href: "/sundmused", label: "Kõik →" }}>
        <div className="flex flex-col gap-2">
          <NewsCompact date="22. juuli" title="Koorihooaeg algab augustis" href="/sundmused" />
          <NewsCompact date="18. juuli" title="Suvine leerilaager Ontikal" href="/sundmused" />
        </div>
      </Section>
    </>
  );
}
