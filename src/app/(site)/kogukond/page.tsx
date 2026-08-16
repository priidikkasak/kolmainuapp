import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kogukonnamaja",
};

export default async function KogukondPage() {
  const page = await getPage("kogukond");
  if (!page) notFound();
  return <PageBody page={page} />;
}
