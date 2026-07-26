import type { Metadata } from "next";
import {
  PageTitle,
  Section,
  Info,
  InfoRow,
  Prose,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Kogudus",
};

export default function MeistPage() {
  return (
    <>
      <PageTitle
        title="Kogudus"
        subtitle="EELK Rakvere Kolmainu kogudus, asutatud 1802. aastal."
      />

      <Prose>
        <p>
          Kolmainu kirik on Rakvere vanim ehitis. Kirikuhoone valmis 1802.
          aastal klassitsistlikus stiilis ja on pühendatud Püha Kolmainule.
          Kirik on olnud katkematult kasutuses üle kahe sajandi.
        </p>
        <p>
          Meie uksed on avatud igaühele: kes tuleb otsima, kes tänama, kes
          lihtsalt vaikima. Iga pühapäev kell 11 kutsume ühisele
          jumalateenistusele.
        </p>
      </Prose>

      <Section label="Aadress">
        <Info>
          <InfoRow label="Kirik">Pikk 19, 44311 Rakvere</InfoRow>
          <InfoRow label="Kantselei">Pikk 21, 44311 Rakvere</InfoRow>
        </Info>
        <a
          href="https://maps.google.com/?q=Kolmainu+kirik+Rakvere"
          target="_blank"
          rel="noopener"
          className="mt-3 flex items-center justify-center bg-surface rounded-[14px] px-5 py-[16px] text-[15px] font-medium text-ink transition-transform active:scale-[0.99]"
        >
          Ava kaardil
        </a>
      </Section>

      <Section label="Kantselei lahtiolekuajad">
        <Info>
          <InfoRow label="Teisipäeviti">10.00 - 14.00</InfoRow>
          <InfoRow label="Neljapäeviti">15.00 - 18.00</InfoRow>
        </Info>
      </Section>

      <Section label="Kontakt">
        <Info>
          <InfoRow label="Telefon">
            <a href="tel:+3723243928">324 3928</a>
          </InfoRow>
          <InfoRow label="E-post">
            <a href="mailto:rakvere@eelk.ee">rakvere@eelk.ee</a>
          </InfoRow>
        </Info>
      </Section>

      <Section label="Vaimulikud">
        <Info>
          <InfoRow label="Õpetaja">Tauno Toompuu</InfoRow>
        </Info>
      </Section>

      <Section label="Sotsiaalmeedia">
        <Info>
          <InfoRow label="Facebook">
            <a href="#">Kolmainu kirik</a>
          </InfoRow>
          <InfoRow label="Instagram">
            <a href="#">@kolmainu.rakvere</a>
          </InfoRow>
          <InfoRow label="Koduleht">
            <a href="https://kolmainu.ee" target="_blank" rel="noopener">
              kolmainu.ee
            </a>
          </InfoRow>
        </Info>
      </Section>
    </>
  );
}
