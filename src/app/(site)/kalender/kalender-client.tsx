"use client";

import { useState } from "react";
import { PageTitle, List, ListItem } from "@/components/primitives";

type EventType = "teenistus" | "palvus" | "koor" | "noored";
type Filter = "all" | EventType;

type CalEvent = {
  title: string;
  meta?: string;
  aside?: string;
  type: EventType;
};

type CalGroup = {
  date: string;
  weekday: string;
  events: CalEvent[];
};

const groups: CalGroup[] = [
  {
    date: "26. juuli",
    weekday: "Pühapäev",
    events: [
      {
        title: "Jumalateenistus armulauaga",
        meta: "Kirikusaal, Tauno Toompuu",
        aside: "11.00",
        type: "teenistus",
      },
      {
        title: "Noorteõhtu",
        meta: "Kogudusesaalis",
        aside: "17.00",
        type: "noored",
      },
    ],
  },
  {
    date: "29. juuli",
    weekday: "Kolmapäev",
    events: [
      {
        title: "Palvusetund",
        meta: "Vaikimine ja palve altari ees",
        aside: "18.00",
        type: "palvus",
      },
    ],
  },
  {
    date: "2. august",
    weekday: "Pühapäev",
    events: [
      {
        title: "Jumalateenistus",
        meta: "Kirikusaal, Tauno Toompuu",
        aside: "11.00",
        type: "teenistus",
      },
    ],
  },
  {
    date: "6. august",
    weekday: "Neljapäev",
    events: [
      {
        title: "Kammerkoori proov",
        meta: "Kogudusesaalis, uus hooaeg",
        aside: "19.00",
        type: "koor",
      },
    ],
  },
  {
    date: "9. august",
    weekday: "Pühapäev",
    events: [
      {
        title: "Jumalateenistus armulauaga",
        meta: "Kirikusaal, Tauno Toompuu",
        aside: "11.00",
        type: "teenistus",
      },
    ],
  },
  {
    date: "15. kuni 20. august",
    weekday: "Laager",
    events: [
      {
        title: "Suvine leerilaager",
        meta: "Ontikal, registreerimine 15. augustini",
        aside: "6 päeva",
        type: "noored",
      },
    ],
  },
];

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Kõik" },
  { key: "teenistus", label: "Teenistused" },
  { key: "palvus", label: "Palvused" },
  { key: "koor", label: "Muusika" },
  { key: "noored", label: "Noortele" },
];

export default function KalenderClient() {
  const [active, setActive] = useState<Filter>("all");

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      events:
        active === "all" ? g.events : g.events.filter((e) => e.type === active),
    }))
    .filter((g) => g.events.length > 0);

  return (
    <>
      <PageTitle title="Kalender" subtitle="Juuli ja august 2026" />

      <div className="flex border-b border-line -mx-1">
        {filters.map((f) => {
          const isActive = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={`flex-1 text-center py-3.5 text-[13px] tracking-tight relative ${
                isActive
                  ? "font-semibold text-ink after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-[-1px] after:h-[2px] after:bg-ink after:rounded-full"
                  : "font-medium text-ink-3"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visibleGroups.map((group) => (
        <section key={group.date} className="pt-8">
          <div className="flex items-baseline justify-between mb-3.5">
            <span className="text-[17px] font-semibold text-ink tracking-[-0.02em]">
              {group.date}
            </span>
            <span className="text-[13px] font-medium text-ink-3">
              {group.weekday}
            </span>
          </div>
          <List>
            {group.events.map((e) => (
              <ListItem
                key={e.title + (e.aside ?? "")}
                title={e.title}
                meta={e.meta}
                aside={e.aside}
              />
            ))}
          </List>
        </section>
      ))}
    </>
  );
}
