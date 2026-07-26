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
  title: "Talitused",
};

export default function TalitusedPage() {
  return (
    <>
      <PageTitle
        title="Talitused"
        subtitle="Kirikliku talituse tellimine ja info."
      />

      <Section label="Sakramendid ja talitused">
        <List>
          <ListItem
            title="Ristimine"
            meta="Laste ja täiskasvanute ristimine"
            aside="Loe"
            href="#ristimine"
          />
          <ListItem
            title="Leer ja konfirmatsioon"
            meta="Leerikursused 3× aastas"
            aside="Loe"
            href="#leer"
          />
          <ListItem
            title="Laulatus"
            meta="Kirikliku abielu õnnistamine"
            aside="Loe"
            href="#laulatus"
          />
          <ListItem
            title="Matusetalitus"
            meta="Lahkunu ärasaatmine"
            aside="Loe"
            href="#matus"
          />
          <ListItem
            title="Armulaud"
            meta="Igal pühapäevasel jumalateenistusel"
            aside="11.00"
            href="#armulaud"
          />
        </List>
      </Section>

      <section id="ristimine">
        <Section label="Ristimine">
          <Prose>
            <p>
              Ristimine on kristliku elu algus, kus inimene võetakse Kristuse
              ihu ja koguduse osaduseks. Ristida saab nii lapsi kui
              täiskasvanuid.
            </p>
            <p>
              Ristimise tellimiseks võta ühendust koguduse kantseleiga vähemalt
              kaks nädalat ette. Vestleme, planeerime aja ja arutame vaderite
              valikut.
            </p>
          </Prose>
        </Section>
      </section>

      <section id="leer">
        <Section label="Leer">
          <Prose>
            <p>
              Leer on kirikliku elu õppetund, mille lõpul konfirmeeritakse
              leerilaps koguduse täisliikmeks. Kolmainu koguduses toimub kolm
              leerikursust aastas: kevadel, sügisel ja suvisel leerilaagril.
            </p>
            <p>
              Järgmine leerilaager toimub Ontikal 15. kuni 20. augustil.
              Registreerimine on avatud kuni 15. augustini.
            </p>
          </Prose>
        </Section>
      </section>

      <section id="laulatus">
        <Section label="Laulatus">
          <Prose>
            <p>
              Kirikliku laulatuse eelduseks on, et vähemalt üks abikaasadest on
              koguduse liige. Enne laulatust toimub kohtumine vaimulikuga, kus
              arutame talituse käiku ja kirikliku abielu tähendust.
            </p>
            <p>
              Laulatuse tellimiseks võta ühendust vähemalt kolm kuud enne
              planeeritud kuupäeva.
            </p>
          </Prose>
        </Section>
      </section>

      <section id="matus">
        <Section label="Matusetalitus">
          <Prose>
            <p>
              Matusetalitus võib toimuda kabelis, kirikus või kalmistul.
              Vaimuliku poole võib pöörduda ka öösel. Leinajaid ei jäeta üksi.
            </p>
            <p>
              Palun helista kantseleisse esimesel võimalusel pärast lahkumist,
              et koos plaanida sobiv aeg ja koht.
            </p>
          </Prose>
        </Section>
      </section>

      <Section label="Võta ühendust">
        <Info>
          <InfoRow label="Kantselei">
            <a href="tel:+3723243928">324 3928</a>
          </InfoRow>
          <InfoRow label="E-post">
            <a href="mailto:rakvere@eelk.ee">rakvere@eelk.ee</a>
          </InfoRow>
          <InfoRow label="Vaimulik">Õp. Tauno Toompuu</InfoRow>
        </Info>
      </Section>
    </>
  );
}
