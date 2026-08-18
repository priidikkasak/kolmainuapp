import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meditatsioon",
};

export default async function MeditatsioonPage() {
  const page = await getPage("meditatsioon");
  if (!page) notFound();
  return <PageBody page={page} />;
}
