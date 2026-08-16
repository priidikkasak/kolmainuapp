import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/page-sections";
import { List, ListItem, Section } from "@/components/primitives";
import { getPage, getUpcomingEvents } from "@/lib/content";
import { formatLongDate, formatTime } from "@/lib/date";

export const metadata: Metadata = {
  title: "Muusika",
};

export default async function MuusikaPage() {
  const [page, events] = await Promise.all([getPage("muusika"), getUpcomingEvents(60)]);
  if (!page) notFound();
  const concerts = events.filter((e) => e.kind === "koor").slice(0, 6);

  return (
    <PageBody page={page}>
      {concerts.length ? (
        <Section label="Tulevad kontserdid">
          <List>
            {concerts.map((event) => (
              <ListItem
                key={event.id}
                title={event.title}
                meta={[formatLongDate(event.startsAt), event.meta].filter(Boolean).join(" · ")}
                aside={formatTime(event.startsAt)}
              />
            ))}
          </List>
        </Section>
      ) : null}
    </PageBody>
  );
}
