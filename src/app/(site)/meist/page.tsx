import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { Info, InfoRow, Section } from "@/components/primitives";
import { getPage } from "@/lib/content";
import { getSiteConfig } from "@/lib/tenant";

export const metadata: Metadata = {
  title: "Kogudus",
};

/** A social field holds either a plain name or a full profile URL; only the URL links out. */
function socialValue(value: string) {
  if (!/^https?:\/\//.test(value)) return value;
  const clean = value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const handle = clean.startsWith("instagram.com/")
    ? `@${clean.slice("instagram.com/".length)}`
    : clean.replace(/^facebook\.com\//, "");
  return (
    <a href={value} target="_blank" rel="noopener">
      {handle}
    </a>
  );
}

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
              className="mt-3 flex min-h-[54px] items-center justify-center gap-2 rounded-[14px] bg-ink px-5 text-[16px] font-semibold tracking-tight text-bg shadow-[0_8px_22px_-8px_rgba(13,11,8,0.55)] transition-transform active:scale-[0.98]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[19px] w-[19px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 5.2-6.2 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              Ava kaardil
              <span className="sr-only">(avaneb uues aknas)</span>
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
            {contact.facebook ? (
              <InfoRow label="Facebook">{socialValue(contact.facebook)}</InfoRow>
            ) : null}
            {contact.instagram ? (
              <InfoRow label="Instagram">{socialValue(contact.instagram)}</InfoRow>
            ) : null}
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
