import type { Metadata } from "next";
import { PageTitle } from "@/components/primitives";
import { getGallery } from "@/lib/content";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Galerii",
};

export default async function GaleriiPage() {
  const groups = await getGallery();

  return (
    <>
      <PageTitle title="Galerii" subtitle="Hetked koguduse elust ja kirikust." />
      <GalleryClient
        groups={groups.map((g) => ({
          title: g.title,
          count: g.photos.length,
          photos: g.photos,
        }))}
      />
    </>
  );
}
