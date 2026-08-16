import type { Metadata } from "next";
import { getUpcomingEvents } from "@/lib/content";
import {
  ET_MONTHS,
  formatDayCount,
  formatDayMonth,
  formatRange,
  formatTime,
  formatWeekday,
  zoned,
} from "@/lib/date";
import KalenderClient, { type CalGroup } from "./kalender-client";

export const metadata: Metadata = {
  title: "Kalender",
};

export default async function KalenderPage() {
  const events = await getUpcomingEvents(80);

  const groups: CalGroup[] = [];
  for (const event of events) {
    const { year, month, day } = zoned(event.startsAt);
    const key = `${year}-${month}-${day}`;
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = {
        key,
        date: event.endsAt
          ? formatRange(event.startsAt, event.endsAt)
          : formatDayMonth(event.startsAt),
        weekday: event.endsAt ? "Mitmepäevane" : formatWeekday(event.startsAt),
        events: [],
      };
      groups.push(group);
    }
    group.events.push({
      id: event.id,
      title: event.title,
      meta: [event.location, event.meta].filter(Boolean).join(", ") || null,
      aside: formatDayCount(event.startsAt, event.endsAt) ?? formatTime(event.startsAt),
      kind: event.kind,
    });
  }

  const months = Array.from(
    new Set(events.map((e) => zoned(e.startsAt).month))
  ).slice(0, 2);
  const year = events.length ? zoned(events[0].startsAt).year : new Date().getFullYear();
  const subtitle = months.length
    ? `${months.map((m) => ET_MONTHS[m - 1]).join(" ja ")} ${year}`.replace(/^./, (c) =>
        c.toUpperCase()
      )
    : "Tulevased sündmused";

  return <KalenderClient groups={groups} subtitle={subtitle} />;
}
