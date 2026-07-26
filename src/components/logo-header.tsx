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
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 py-[18px] mb-6 min-h-9 -mx-5 px-5"
      style={{
        background: "rgba(247, 244, 236, 0.85)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        paddingTop: "calc(18px + env(safe-area-inset-top))",
        marginTop: "calc(-1 * env(safe-area-inset-top))",
      }}
    >
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
