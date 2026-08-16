import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { Info, InfoRow, Section } from "@/components/primitives";
import { getPage } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";

export const metadata: Metadata = {
  title: "Talitused",
};

export default async function TalitusedPage() {
  const [page, site] = await Promise.all([getPage("talitused"), getSiteConfig()]);
  if (!page) notFound();
  const { contact } = site;

  return (
    <>
      <PageBody page={page} />

      {contact.phone || contact.email ? (
        <Section label="Võta ühendust">
          <Info>
            {contact.phone ? (
              <InfoRow label="Kantselei">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </InfoRow>
            ) : null}
            {contact.email ? (
              <InfoRow label="E-post">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </InfoRow>
            ) : null}
          </Info>
        </Section>
      ) : null}
    </>
  );
}
