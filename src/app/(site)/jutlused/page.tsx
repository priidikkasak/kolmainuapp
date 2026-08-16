import type { Metadata } from "next";
import {
  PageTitle,
  Section,
  List,
  ListItem,
  Verse,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Jutlused",
};

export default function JutlusedPage() {
  return (
    <>
      <PageTitle title="Jutlused" subtitle="Kuula ja loe koguduse jutlusi." />

      <Section label="Viimased jutlused">
        <List>
          <ListItem
            title="Vaikimise õnnistus"
            meta="19. juuli, õp. Tauno Toompuu"
            aside="18 min"
            href="#"
          />
          <ListItem
            title="Halastuse teekond"
            meta="12. juuli, õp. Tauno Toompuu"
            aside="22 min"
            href="#"
          />
          <ListItem
            title="Hea karjase kutse"
            meta="5. juuli, õp. Tauno Toompuu"
            aside="20 min"
            href="#"
          />
          <ListItem
            title="Rõõmust andmisest"
            meta="28. juuni, õp. Tauno Toompuu"
            aside="16 min"
            href="#"
          />
          <ListItem
            title="Uskuda, armastada, teenida"
            meta="21. juuni, õp. Tauno Toompuu"
            aside="24 min"
            href="#"
          />
        </List>
      </Section>

      <Section label="Kuula uuesti">
        <List>
          <ListItem
            title="Nelipühi jutlus"
            meta="Kirjakoht: Ap. teod 2:1-13"
            aside="26 min"
            href="#"
          />
          <ListItem
            title="Ülestõusmispüha"
            meta="Kirjakoht: Markuse 16:1-8"
            aside="28 min"
            href="#"
          />
          <ListItem
            title="Suur reede"
            meta="Kirjakoht: Johannese 19:16-37"
            aside="30 min"
            href="#"
          />
        </List>
      </Section>

      <Section label="Kirjakoht päevaks">
        <Verse
          text="Vaikige ja teadke, et mina olen Jumal."
          reference="Psalm 46:11"
        />
      </Section>
    </>
  );
}
