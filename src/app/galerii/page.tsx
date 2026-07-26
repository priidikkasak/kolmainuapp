import type { Metadata } from "next";
import { PageTitle } from "@/components/primitives";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Galerii",
};

const categories = [
  { slug: "outside", title: "Kirikuhoone", count: 14 },
  { slug: "inside", title: "Kirikusaal", count: 27 },
  { slug: "orel", title: "Orel", count: 3 },
  { slug: "paintings", title: "Maalid", count: 4 },
  { slug: "statues", title: "Skulptuurid ja detailid", count: 12 },
  { slug: "people", title: "Kogudus", count: 5 },
];

export default function GaleriiPage() {
  const groups = categories.map((cat) => ({
    title: cat.title,
    count: cat.count,
    photos: Array.from({ length: cat.count }, (_, i) => ({
      src: `/gallery/${cat.slug}/${i + 1}.jpeg`,
      alt: `${cat.title} ${i + 1}`,
    })),
  }));

  return (
    <>
      <PageTitle title="Galerii" subtitle="Hetked koguduse elust ja kirikust." />
      <GalleryClient groups={groups} />
    </>
  );
}
