import Link from "next/link";
import { redirect } from "next/navigation";
import { hasDb } from "@/db/client";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { AdminTitle, ErrorNote } from "@/components/admin/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <div className="pt-10">
      <AdminTitle title="Sisuhaldus" subtitle="Logi sisse, et sisu muuta." />

      {hasDb ? (
        <LoginForm next={next ?? "/admin"} />
      ) : (
        <div className="flex flex-col gap-4">
          <ErrorNote>Andmebaas pole veel ühendatud.</ErrorNote>
          <Link href="/admin/seadistus" className="text-[15px] font-medium text-ink">
            Vaata seadistusjuhendit →
          </Link>
        </div>
      )}

      <div className="pt-8">
        <Link href="/" className="text-[14px] font-medium text-ink-3">
          ← Tagasi äppi
        </Link>
      </div>
    </div>
  );
}
