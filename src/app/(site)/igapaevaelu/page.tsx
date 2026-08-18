import type { Metadata } from "next";
import { PageTitle } from "@/components/primitives";
import { getDailyPhotos } from "@/lib/content";
import { GalleryClient } from "../galerii/gallery-client";

export const metadata: Metadata = {
  title: "Igapäevaelu",
};

export default async function IgapaevaeluPage() {
  const photos = await getDailyPhotos();

  return (
    <>
      <PageTitle title="Hetked koguduse elust" subtitle="Pildid koguduse nädalast - teenistused, kohtumised ja vaikne argipäev." />
      {photos.length ? (
        <GalleryClient groups={[{ title: "", count: photos.length, photos }]} />
      ) : (
        <p className="text-[15px] text-ink-3">Pilte pole veel lisatud.</p>
      )}
    </>
  );
}
