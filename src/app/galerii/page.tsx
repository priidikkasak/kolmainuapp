import type { Metadata } from "next";
import Image from "next/image";
import { PageTitle } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Galerii",
};

type Category = {
  slug: string;
  title: string;
  ext: "jpeg" | "jpg";
  count: number;
};

const categories: Category[] = [
  { slug: "outside", title: "Kirikuhoone", ext: "jpeg", count: 14 },
  { slug: "inside", title: "Kirikusaal", ext: "jpeg", count: 27 },
  { slug: "orel", title: "Orel", ext: "jpeg", count: 3 },
  { slug: "paintings", title: "Maalid", ext: "jpeg", count: 4 },
  { slug: "statues", title: "Skulptuurid ja detailid", ext: "jpeg", count: 12 },
  { slug: "people", title: "Kogudus", ext: "jpeg", count: 5 },
];

export default function GaleriiPage() {
  return (
    <>
      <PageTitle title="Galerii" subtitle="Hetked koguduse elust ja kirikust." />

      <div className="flex flex-col gap-8">
        {categories.map((cat) => (
          <section key={cat.slug}>
            <div className="text-[17px] font-semibold text-ink tracking-[-0.02em] mb-3">
              {cat.title}
              <span className="ml-2 text-[13px] font-medium text-ink-3">
                {cat.count}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: cat.count }, (_, i) => i + 1).map((n) => (
                <div
                  key={n}
                  className="relative aspect-square rounded-[10px] overflow-hidden bg-surface"
                >
                  <Image
                    src={`/gallery/${cat.slug}/${n}.${cat.ext}`}
                    alt={`${cat.title} ${n}`}
                    fill
                    sizes="(max-width: 520px) 33vw, 160px"
                    className="object-cover"
                    loading={cat.slug === "outside" && n <= 3 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
