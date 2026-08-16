import Link from "next/link";
import { logoutAction } from "@/admin/actions";
import { requireAdmin } from "@/admin/guard";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant, session } = await requireAdmin();

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
        <Link href="/admin" className="min-w-0">
          <div className="text-[15px] font-semibold tracking-tight text-ink truncate">
            {tenant.shortName}
          </div>
          <div className="text-[12px] text-ink-3 truncate">{session.email}</div>
        </Link>
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="text-[13px] font-medium text-ink-3">
            Vaata äppi
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-[13px] font-medium text-ink-3">
              Logi välja
            </button>
          </form>
        </div>
      </header>
      <main className="pt-6">{children}</main>
    </>
  );
}
