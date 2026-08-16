"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    key: "avaleht",
    href: "/",
    label: "Avaleht",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />
      </svg>
    ),
  },
  {
    key: "kalender",
    href: "/kalender",
    label: "Kalender",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    key: "jutlused",
    href: "/jutlused",
    label: "Jutlused",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 17c0 1.1.9 2 2 2h1v-6H6a2 2 0 0 0-2 2v2z" />
        <path d="M20 17c0 1.1-.9 2-2 2h-1v-6h1a2 2 0 0 1 2 2v2z" />
      </svg>
    ),
  },
  {
    key: "piibel",
    href: "/piibel",
    label: "Piibel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4a2 2 0 0 1 2-2h11v18H7a2 2 0 0 0-2 2V4z" />
        <path d="M12 6v9M8 10h8" />
      </svg>
    ),
  },
  {
    key: "meist",
    href: "/meist",
    label: "Meist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v6M9 6h6M4 21V11l8-4 8 4v10" />
        <path d="M10 21v-5h4v5" />
      </svg>
    ),
  },
];

export function BottomNav({ background }: { background: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-line"
      style={{
        background,
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto grid max-w-[520px] grid-cols-5 h-[76px] px-1">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.key}
              href={it.href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-[5px] py-[6px] text-[10px] font-medium tracking-tight transition-colors active:scale-[0.94] ${
                active ? "text-ink" : "text-ink-3"
              }`}
            >
              <span
                className={`h-6 w-6 [&_svg]:h-6 [&_svg]:w-6 ${
                  active ? "[&_svg]:stroke-2" : ""
                }`}
              >
                {it.icon}
              </span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
