import type { Metadata } from "next";
import {
  List,
  ListItem,
  NewsCompact,
  PageTitle,
  Section,
} from "@/components/primitives";
import { getHighlightEvents, getNews, getWeeklyServices } from "@/lib/content";
import { ET_WEEKDAYS, formatDayMonth, formatRange, formatTime } from "@/lib/date";

export const metadata: Metadata = {
  title: "Sündmused",
};

export default async function SundmusedPage() {
  const [highlights, weekly, news] = await Promise.all([
    getHighlightEvents(8),
    getWeeklyServices(),
    getNews(6),
  ]);

  return (
    <>
      <PageTitle
        title="Sündmused"
        subtitle="Erilised sündmused ja üritused koguduses."
      />

      {highlights.length ? (
        <Section label="Tähtsündmused">
          <List>
            {highlights.map((event) => (
              <ListItem
                key={event.id}
                title={event.title}
                meta={[formatRange(event.startsAt, event.endsAt), event.location]
                  .filter(Boolean)
                  .join(" · ")}
                aside={event.endsAt ? undefined : formatTime(event.startsAt)}
              />
            ))}
          </List>
        </Section>
      ) : null}

      {weekly.length ? (
        <Section label="Iganädalased">
          <List>
            {weekly.map((service) => (
              <ListItem
                key={service.id}
                title={service.title}
                meta={service.meta ?? `Iga ${ET_WEEKDAYS[service.weekday].toLowerCase()}`}
                aside={service.time ?? undefined}
              />
            ))}
          </List>
        </Section>
      ) : null}

      {news.length ? (
        <Section label="Teated">
          <div className="flex flex-col gap-2">
            {news.map((item) => (
              <NewsCompact
                key={item.id}
                date={formatDayMonth(item.publishedAt)}
                title={item.title}
                href={item.href ?? undefined}
              />
            ))}
          </div>
        </Section>
      ) : null}

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
