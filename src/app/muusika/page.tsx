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
  title: "Muusika",
};

export default function MuusikaPage() {
  return (
    <>
      <PageTitle title="Muusika" subtitle="Koor, orel ja koguduse muusikaelu." />

      <Section label="Tulevad kontserdid">
        <List>
          <ListItem
            title="Orelkontsert"
            meta="Kolmapäev, 29. juuli · Andres Uibo"
            aside="18.00"
          />
          <ListItem
            title="Orelkontsert"
            meta="Kolmapäev, 5. august · Ines Maidre"
            aside="18.00"
          />
          <ListItem
            title="Suvine korikontsert"
            meta="Laupäev, 15. august · Kolmainu kammerkoor"
            aside="19.00"
          />
        </List>
      </Section>

      <Section label="Kammerkoor">
        <Prose>
          <p>
            Kolmainu kammerkoor teenib jumalateenistustel ja esineb
            kontsertidel. Uued lauljad on alati oodatud. Eelnevat kogemust ei
            nõuta.
          </p>
        </Prose>
        <div className="mt-4">
          <Info>
            <InfoRow label="Proovid">Neljapäeviti 19.00 kuni 21.00</InfoRow>
            <InfoRow label="Uus hooaeg">Algab 6. augustil</InfoRow>
            <InfoRow label="Kontakt">
              <a href="mailto:koor@kolmainu.ee">koor@kolmainu.ee</a>
            </InfoRow>
          </Info>
        </div>
      </Section>

      <Section label="Kirikuorel">
        <Prose>
          <p>
            Kolmainu kiriku orel on ehitatud 1902. aastal Sauer&apos;i firma
            poolt Frankfurdis. Instrument on üks Rakvere paremini säilinud
            ajaloolisi oreleid ning meelitab kokku külalisorganiste kogu
            Eestist.
          </p>
          <p>
            Iga kolmapäev kell 18.00 toimub tasuta orelkontsert, mõtisklushetk
            keset nädalat.
          </p>
        </Prose>
      </Section>
    </>
  );
}
