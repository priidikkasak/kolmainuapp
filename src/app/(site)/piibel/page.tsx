import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { Verse } from "@/components/primitives";
import { getPage, getVerseOfDay } from "@/lib/content";

export const metadata: Metadata = {
  title: "Piibel",
};

export default async function PiibelPage() {
  const [page, verse] = await Promise.all([getPage("piibel"), getVerseOfDay()]);
  if (!page) notFound();

  return (
    <PageBody page={page}>
      {verse ? (
        <Verse
          text={verse.text}
          reference={verse.reference}
          bg={verse.imageUrl ?? "/images/verse-bg-piibel.jpg"}
        />
      ) : null}
    </PageBody>
  );
}
