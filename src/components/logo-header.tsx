"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DAYS = ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"];
const MONTHS = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

export function LogoHeader() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(formatDate(new Date()));
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 py-[22px] pb-10 min-h-9">
      <Link href="/" aria-label="Avaleht" className="inline-flex items-center flex-shrink-0 active:opacity-60 transition-opacity">
        <Image
          src="/icons/logo.png"
          alt="Kolmainu"
          width={190}
          height={30}
          priority
          className="h-[30px] w-auto max-w-[190px] object-contain"
        />
      </Link>
      <span className="text-[12px] font-medium text-ink-3 tracking-tight text-right whitespace-nowrap">
        {date}
      </span>
    </header>
  );
}
