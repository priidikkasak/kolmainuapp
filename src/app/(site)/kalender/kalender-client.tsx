"use client";

import { useState } from "react";
import { List, ListItem, PageTitle } from "@/components/primitives";
import type { EventKind } from "@/lib/content-types";

type Filter = "all" | EventKind;

export type CalEvent = {
  id: string;
  title: string;
  meta: string | null;
  aside: string | null;
  kind: EventKind;
};

export type CalGroup = {
  key: string;
  date: string;
  weekday: string;
  events: CalEvent[];
};

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Kõik" },
  { key: "teenistus", label: "Teenistused" },
  { key: "palvus", label: "Palvused" },
  { key: "koor", label: "Muusika" },
  { key: "noored", label: "Noortele" },
];

export default function KalenderClient({
  groups,
  subtitle,
}: {
  groups: CalGroup[];
  subtitle: string;
}) {
  const [active, setActive] = useState<Filter>("all");

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      events: active === "all" ? g.events : g.events.filter((e) => e.kind === active),
    }))
    .filter((g) => g.events.length > 0);

  return (
    <>
      <PageTitle title="Kalender" subtitle={subtitle} />

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

      {visibleGroups.length === 0 ? (
        <p className="pt-10 text-[15px] text-ink-3">Selles vaates pole sündmusi.</p>
      ) : null}

      {visibleGroups.map((group) => (
        <section key={group.key} className="pt-8">
          <div className="flex items-baseline justify-between mb-3.5">
            <span className="text-[17px] font-semibold text-ink tracking-[-0.02em]">
              {group.date}
            </span>
            <span className="text-[13px] font-medium text-ink-3">{group.weekday}</span>
          </div>
          <List>
            {group.events.map((e) => (
              <ListItem
                key={e.id}
                title={e.title}
                meta={e.meta ?? undefined}
                aside={e.aside ?? undefined}
              />
            ))}
          </List>
        </section>
      ))}
    </>
  );
}
