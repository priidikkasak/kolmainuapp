import Link from "next/link";
import { BentoTile } from "@/components/bento-tile";
import { getHomeTiles } from "@/lib/content";

export default async function Home() {
  const tiles = await getHomeTiles();

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
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
        className="mt-2.5 flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-[22px] bg-ink px-5 text-[17px] font-semibold tracking-tight text-bg shadow-[0_8px_22px_-8px_rgba(13,11,8,0.55)] transition-transform active:scale-[0.98]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[20px] w-[20px]"
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
    </>
  );
}
