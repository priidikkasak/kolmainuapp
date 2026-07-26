import type { Metadata } from "next";
import {
  PageTitle,
  Section,
  List,
  ListItem,
  Info,
  InfoRow,
  Prose,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Kogukonnamaja",
};

export default function KogukondPage() {
  return (
    <>
      <PageTitle
        title="Kogukonnamaja"
        subtitle="Hoolime üksteisest, eriti neist, kes seda enim vajavad."
      />

      <Prose>
        <p>
          Kolmainu koguduse Kogukonnamaja pakub tuge intellektipuudega
          inimestele ja nende peredele. Meie eesmärk on igaühele elu keskel
          koht, kuhu kuuluda.
        </p>
      </Prose>

      <Section label="Teenused">
        <List>
          <ListItem
            title="Kogukonnas elamise teenus"
            meta="Intellektipuudega täiskasvanutele"
          />
          <ListItem
            title="Toetatud töötamine"
            meta="Erihoolekandeteenus"
          />
          <ListItem
            title="Igapäevaelu toetamine"
            meta="Perede toetus ja nõustamine"
          />
          <ListItem title="Diakoonia" meta="Abi peredele ja üksikutele" />
        </List>
      </Section>

      <Section label="Võta ühendust">
        <Prose>
          <p>
            Kui tead peret või inimest, kes vajab abi, või soovid ise
            vabatahtlikuna kaasa aidata, kirjuta või helista. Iga käepaar loeb.
          </p>
        </Prose>
        <div className="mt-4">
          <Info>
            <InfoRow label="Telefon">
              <a href="tel:+3723243928">324 3928</a>
            </InfoRow>
            <InfoRow label="E-post">
              <a href="mailto:kogukonnamaja@kolmainu.ee">
                kogukonnamaja@kolmainu.ee
              </a>
            </InfoRow>
          </Info>
        </div>
      </Section>
    </>
  );
}
