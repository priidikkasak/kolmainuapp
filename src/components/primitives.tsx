import Link from "next/link";
import type { ReactNode } from "react";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-3 pb-8">
      <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2.5 text-[16px] font-normal text-ink-2 tracking-tight max-w-[34ch]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function SectionLabel({
  children,
  more,
}: {
  children: ReactNode;
  more?: { href: string; label: string };
}) {
  return (
    <div className="flex justify-between items-baseline mb-3.5 text-[17px] font-semibold text-ink tracking-[-0.02em]">
      <span>{children}</span>
      {more ? (
        <Link href={more.href} className="text-[13px] font-medium text-ink-3">
          {more.label}
        </Link>
      ) : null}
    </div>
  );
}

export function Section({ label, more, children, className = "" }: {
  label?: string;
  more?: { href: string; label: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`pt-8 ${className}`}>
      {label ? <SectionLabel more={more}>{label}</SectionLabel> : null}
      {children}
    </section>
  );
}

/* List — individual cards with gaps */
export function List({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function ListItem({
  title,
  meta,
  aside,
  href,
}: {
  title: string;
  meta?: string;
  aside?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex-1 min-w-0">
        <div className="text-[16px] font-medium text-ink leading-[1.3] tracking-tight">{title}</div>
        {meta ? <div className="mt-[3px] text-[13px] text-ink-3 leading-[1.4]">{meta}</div> : null}
      </div>
      {aside ? (
        <div className="text-[15px] font-medium text-ink tabular-nums whitespace-nowrap tracking-tight">
          {aside}
        </div>
      ) : null}
    </>
  );
  const cls = "flex items-center gap-4 px-5 py-[18px] bg-surface rounded-[14px] transition-transform active:scale-[0.99]";
  return href ? (
    <Link href={href} prefetch className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/* Info rows — key/value pairs, individual cards */
export function Info({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function InfoRow({
  label,
  children,
  variant,
}: {
  label: string;
  children: ReactNode;
  variant?: "account";
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 items-baseline px-5 py-[18px] bg-surface rounded-[14px]">
      <div className="text-[13px] font-medium text-ink-3 tracking-tight">{label}</div>
      <div
        className={`text-[15px] font-medium text-ink leading-[1.5] break-words ${
          variant === "account" ? "text-[13px] tabular-nums whitespace-nowrap tracking-tight" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* News card */
export function NewsCard({
  date,
  title,
  excerpt,
  href,
}: {
  date: string;
  title: string;
  excerpt?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-[12px] font-medium text-ink-3 mb-2">{date}</div>
      <h3 className="text-[18px] font-semibold text-ink leading-[1.25] tracking-tight mb-2">{title}</h3>
      {excerpt ? (
        <p className="text-[14px] text-ink-2 leading-[1.5]">{excerpt}</p>
      ) : null}
    </>
  );
  const cls = "bg-surface rounded-[16px] px-[22px] pt-[22px] pb-6 transition-transform active:scale-[0.99]";
  return href ? (
    <Link href={href} prefetch className={`block ${cls}`}>{inner}</Link>
  ) : (
    <article className={cls}>{inner}</article>
  );
}

/* News compact (used on home) */
export function NewsCompact({
  date,
  title,
  href,
}: {
  date: string;
  title: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-[12px] font-medium text-ink-3 mb-1">{date}</div>
      <div className="text-[15px] font-semibold text-ink leading-[1.3] tracking-tight">{title}</div>
    </>
  );
  const cls = "bg-surface rounded-[14px] px-[18px] py-4 transition-transform active:scale-[0.99]";
  return href ? (
    <Link href={href} prefetch className={`block ${cls}`}>{inner}</Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/* Verse block with atmospheric background */
export function Verse({
  text,
  reference,
  bg = "/images/verse-bg.jpg",
}: {
  text: string;
  reference: string;
  bg?: string;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] my-5 mb-3 min-h-[280px] px-6 pt-24 pb-8 text-center flex flex-col justify-end items-center isolate bg-surface"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.72) 100%), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p
        className="text-[22px] font-medium leading-[1.35] tracking-[-0.02em] text-white max-w-[26ch] mx-auto mb-3"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
      >
        {text}
      </p>
      <div
        className="text-[13px] font-medium tracking-tight"
        style={{ color: "rgba(255,255,255,0.82)", textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
      >
        {reference}
      </div>
    </section>
  );
}

/* Prose block */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="pt-1 [&>p]:text-[16px] [&>p]:leading-[1.6] [&>p]:text-ink-2 [&>p]:mb-4 [&>p]:max-w-[40ch] [&>p:last-child]:mb-0">
      {children}
    </div>
  );
}
