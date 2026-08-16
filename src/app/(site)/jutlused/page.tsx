import type { Metadata } from "next";
import { List, ListItem, PageTitle, Section, Verse } from "@/components/primitives";
import { getSermons, getVerseOfDay } from "@/lib/content";
import { formatDayMonth } from "@/lib/date";

export const metadata: Metadata = {
  title: "Jutlused",
};

export default async function JutlusedPage() {
  const [sermons, verse] = await Promise.all([getSermons(20), getVerseOfDay()]);
  const recent = sermons.slice(0, 5);
  const archive = sermons.slice(5);

  return (
    <>
      <PageTitle title="Jutlused" subtitle="Kuula ja loe koguduse jutlusi." />

      {recent.length ? (
        <Section label="Viimased jutlused">
          <List>
            {recent.map((sermon) => (
              <ListItem
                key={sermon.id}
                title={sermon.title}
                meta={[formatDayMonth(sermon.preachedAt), sermon.preacher]
                  .filter(Boolean)
                  .join(", ")}
                aside={sermon.durationMin ? `${sermon.durationMin} min` : undefined}
                href={sermon.audioUrl ?? undefined}
              />
            ))}
          </List>
        </Section>
      ) : null}

      {archive.length ? (
        <Section label="Kuula uuesti">
          <List>
            {archive.map((sermon) => (
              <ListItem
                key={sermon.id}
                title={sermon.title}
                meta={sermon.scripture ? `Kirjakoht: ${sermon.scripture}` : undefined}
                aside={sermon.durationMin ? `${sermon.durationMin} min` : undefined}
                href={sermon.audioUrl ?? undefined}
              />
            ))}
          </List>
        </Section>
      ) : null}

      {verse ? (
        <Section label="Kirjakoht päevaks">
          <Verse
            text={verse.text}
            reference={verse.reference}
            bg={verse.imageUrl ?? "/images/verse-bg.jpg"}
          />
        </Section>
      ) : null}
    </>
  );
}
