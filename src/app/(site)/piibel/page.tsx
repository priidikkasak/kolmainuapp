import type { Metadata } from "next";
import {
  PageTitle,
  Section,
  List,
  ListItem,
  Verse,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Piibel",
};

export default function PiibelPage() {
  return (
    <>
      <PageTitle
        title="Piibel"
        subtitle="Kirjakoht päevaks ja igapäevane lugemine."
      />

      <Verse
        text="Vaikige ja teadke, et mina olen Jumal."
        reference="Psalm 46:11"
        bg="/images/verse-bg-piibel.jpg"
      />

      <Section label="Loe edasi">
        <List>
          <ListItem
            title="Vana Testament"
            meta="39 raamatut, 929 peatükki"
            aside="Ava"
            href="#"
          />
          <ListItem
            title="Uus Testament"
            meta="27 raamatut, 260 peatükki"
            aside="Ava"
            href="#"
          />
          <ListItem
            title="Lugemiskava"
            meta="Piibel läbi ühe aastaga"
            aside="Alusta"
            href="#"
          />
        </List>
      </Section>

      <Section label="Viimased lugemised">
        <List>
          <ListItem
            title="Psalm 23"
            meta="Issand on mu karjane"
            aside="Eile"
          />
          <ListItem title="Matteus 5" meta="Mäejutlus" aside="3 päeva" />
        </List>
      </Section>
    </>
  );
}
