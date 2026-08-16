import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";
import AnnetaClient from "./anneta-client";

export const metadata: Metadata = {
  title: "Anneta",
};

export default async function AnnetaPage() {
  const [page, site] = await Promise.all([getPage("anneta"), getSiteConfig()]);

  return (
    <AnnetaClient
      title={page?.title ?? "Anneta"}
      subtitle={page?.subtitle ?? "Toeta koguduse tööd. Iga panus loeb."}
      iban={site.contact.iban ?? null}
      owner={site.contact.ibanOwner ?? site.name}
      reference={site.contact.ibanReference ?? "Annetus"}
    />
  );
}
