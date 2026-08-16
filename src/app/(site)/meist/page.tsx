import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { Info, InfoRow, Section } from "@/components/primitives";
import { getPage } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";

export const metadata: Metadata = {
  title: "Kogudus",
};

export default async function MeistPage() {
  const [page, site] = await Promise.all([getPage("meist"), getSiteConfig()]);
  if (!page) notFound();
  const { contact } = site;

  return (
    <PageBody page={page}>
      {contact.addressChurch || contact.addressOffice ? (
        <Section label="Aadress">
          <Info>
            {contact.addressChurch ? (
              <InfoRow label="Kirik">{contact.addressChurch}</InfoRow>
            ) : null}
            {contact.addressOffice ? (
              <InfoRow label="Kantselei">{contact.addressOffice}</InfoRow>
            ) : null}
          </Info>
          {contact.mapsUrl ? (
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener"
              className="mt-3 flex items-center justify-center bg-surface rounded-[14px] px-5 py-[16px] text-[15px] font-medium text-ink transition-transform active:scale-[0.99]"
            >
              Ava kaardil
            </a>
          ) : null}
        </Section>
      ) : null}

      {contact.phone || contact.email ? (
        <Section label="Kontakt">
          <Info>
            {contact.phone ? (
              <InfoRow label="Telefon">
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

      {contact.facebook || contact.instagram || contact.website ? (
        <Section label="Sotsiaalmeedia">
          <Info>
            {contact.facebook ? <InfoRow label="Facebook">{contact.facebook}</InfoRow> : null}
            {contact.instagram ? <InfoRow label="Instagram">{contact.instagram}</InfoRow> : null}
            {contact.website ? (
              <InfoRow label="Koduleht">
                <a href={contact.website} target="_blank" rel="noopener">
                  {contact.website.replace(/^https?:\/\//, "")}
                </a>
              </InfoRow>
            ) : null}
          </Info>
        </Section>
      ) : null}
    </PageBody>
  );
}
