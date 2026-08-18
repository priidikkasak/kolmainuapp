import Link from "next/link";
import { BentoTile } from "@/components/bento-tile";
import { getHomeTiles } from "@/lib/content";

export default async function Home() {
  const tiles = await getHomeTiles();

  // 90px header block + 116px layout bottom padding: what is left is the CTA's to fill.
  return (
    <div
      className="flex flex-col"
      style={{
        minHeight:
          "calc(100dvh - 90px - 116px - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      }}
    >
      <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-2.5">
        {tiles.map((tile, i) => (
          <BentoTile
            key={tile.id}
            href={tile.href}
            image={tile.imageUrl ?? "/images/galerii.jpg"}
            label={tile.label}
            priority={i < 4}
          />
        ))}
      </div>

      <Link
        href="/anneta"
        prefetch
        className="mt-2.5 flex h-[64px] w-full shrink-0 items-center justify-center gap-2.5 rounded-[22px] border-[3px] border-ink px-5 text-[18px] font-semibold tracking-tight text-ink transition-transform active:scale-[0.98]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[21px] w-[21px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20s-7-4.4-7-9.3A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3z" />
        </svg>
        Anneta
      </Link>
    </div>
  );
}
