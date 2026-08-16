import Link from "next/link";
import type { ReactNode } from "react";

export function AdminTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string | null;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pt-2 pb-6">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-[14px] text-ink-3 tracking-tight">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface rounded-[16px] px-5 py-5 ${className}`}>{children}</div>
  );
}

export function AdminRow({
  href,
  title,
  meta,
  badge,
}: {
  href: string;
  title: string;
  meta?: string | null;
  badge?: string | null;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 bg-surface rounded-[14px] px-[18px] py-4 transition-transform active:scale-[0.99]"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-ink leading-[1.3] tracking-tight truncate">
          {title}
        </div>
        {meta ? (
          <div className="mt-[3px] text-[13px] text-ink-3 leading-[1.4] truncate">{meta}</div>
        ) : null}
      </div>
      {badge ? (
        <span className="shrink-0 rounded-full bg-bg px-2.5 py-1 text-[11px] font-medium text-ink-3">
          {badge}
        </span>
      ) : null}
      <span className="shrink-0 text-ink-4" aria-hidden>
        →
      </span>
    </Link>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface rounded-[14px] px-5 py-8 text-center text-[14px] text-ink-3">
      {children}
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-[12px] bg-[#fdecec] px-4 py-3 text-[14px] font-medium text-[#8a1c1c]"
    >
      {children}
    </div>
  );
}

export function OkNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="rounded-[12px] bg-[#e9f4ec] px-4 py-3 text-[14px] font-medium text-[#1e5c33]"
    >
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-[12px] border border-line-strong bg-surface px-4 py-3 text-[16px] text-ink tracking-tight outline-none focus:border-ink placeholder:text-ink-4";

export function FieldShell({
  label,
  help,
  htmlFor,
  children,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-ink-2 tracking-tight"
      >
        {label}
      </label>
      {children}
      {help ? <p className="text-[12px] text-ink-3 leading-[1.4]">{help}</p> : null}
    </div>
  );
}
