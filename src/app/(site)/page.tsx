import { BentoTile } from "@/components/bento-tile";
import { getHomeTiles } from "@/lib/content";

export default async function Home() {
  const tiles = await getHomeTiles();

  return (
    <div className="grid grid-cols-2 gap-2.5">
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
  );
}
