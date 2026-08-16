import type { Metadata } from "next";
import {
  PageTitle,
  Section,
  List,
  ListItem,
  NewsCompact,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Sündmused",
};

export default function SundmusedPage() {
  return (
    <>
      <PageTitle
        title="Sündmused"
        subtitle="Erilised sündmused ja üritused Kolmainu koguduses."
      />

      <Section label="Selle kuu tähtsündmused">
        <div className="flex flex-col gap-2">
          <NewsCompact
            date="15. kuni 20. august"
            title="Suvine leerilaager Ontikal"
            href="#"
          />
          <NewsCompact
            date="6. august"
            title="Kammerkoori uue hooaja avaproov"
            href="#"
          />
          <NewsCompact
            date="5. august"
            title="Kiriku katuseremont algab"
            href="#"
          />
          <NewsCompact
            date="3. august"
            title="Nelja koguduse ühine palvusõhtu"
            href="#"
          />
        </div>
      </Section>

      <Section label="Iganädalased">
        <List>
          <ListItem
            title="Jumalateenistus armulauaga"
            meta="Iga pühapäev"
            aside="11.00"
          />
          <ListItem
            title="Orelkontsert"
            meta="Iga kolmapäev"
            aside="18.00"
          />
          <ListItem
            title="Palvusetund"
            meta="Iga kolmapäev"
            aside="18.00"
          />
          <ListItem
            title="Kammerkoori proov"
            meta="Iga neljapäev"
            aside="19.00"
          />
        </List>
      </Section>

      <Section>
        <List>
          <ListItem
            title="Ava täielik kalender"
            meta="Kõik teenistused ja sündmused"
            aside="→"
            href="/kalender"
          />
        </List>
      </Section>
    </>
  );
}
