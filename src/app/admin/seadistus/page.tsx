import Link from "next/link";
import { hasDb } from "@/db/client";
import { AdminCard, AdminTitle, OkNote } from "@/components/admin/ui";

const STEPS = [
  {
    title: "1. Loo Postgres andmebaas",
    body: "Vercel → Storage → Create Database → Neon (või mõni muu Postgres). Kopeeri ühenduse string.",
  },
  {
    title: "2. Lisa keskkonnamuutujad",
    body: "DATABASE_URL = ühenduse string\nAUTH_SECRET = juhuslik pikk string (openssl rand -base64 32)\nBLOB_READ_WRITE_TOKEN = Vercel Blob token (piltide üleslaadimiseks)",
  },
  {
    title: "3. Loo tabelid",
    body: "npm run db:push",
  },
  {
    title: "4. Lisa kogudus ja esimene kasutaja",
    body: "ADMIN_EMAIL=sinu@email.ee ADMIN_PASSWORD=... npm run db:seed",
  },
  {
    title: "5. Logi sisse",
    body: "Ava /admin ja logi sisse loodud kasutajaga.",
  },
];

export default function SetupPage() {
  return (
    <div className="pt-6">
      <AdminTitle
        title="Seadistus"
        subtitle="Äpp töötab praegu kaasapandud näidissisuga. Sisuhalduse sisselülitamiseks:"
      />

      {hasDb ? (
        <div className="mb-6">
          <OkNote>Andmebaas on ühendatud.</OkNote>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {STEPS.map((step) => (
          <AdminCard key={step.title}>
            <div className="text-[15px] font-semibold tracking-tight text-ink">
              {step.title}
            </div>
            <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.6] text-ink-2">
              {step.body}
            </pre>
          </AdminCard>
        ))}
      </div>

      <div className="pt-8 flex gap-5">
        <Link href="/admin/login" className="text-[14px] font-medium text-ink">
          Sisselogimine →
        </Link>
        <Link href="/" className="text-[14px] font-medium text-ink-3">
          ← Tagasi äppi
        </Link>
      </div>
    </div>
  );
}
