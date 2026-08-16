# Kolmainu

Mobile-first PWA for a congregation, with an Estonian-language admin panel.
Multi-tenant: one deploy can serve several congregations, resolved from the
request host.

## Development

```bash
npm run dev
```

Without `DATABASE_URL` the site renders the bundled content in
`src/content/seed.ts`, so it runs on a bare checkout. `/admin/seadistus`
explains how to switch to the database.

## Enabling the CMS

1. Provision any Postgres (Neon, Supabase, Vercel Postgres).
2. Copy `.env.example` to `.env.local` and fill `DATABASE_URL`, `AUTH_SECRET`
   (`openssl rand -base64 32`) and, for image uploads, `BLOB_READ_WRITE_TOKEN`.
3. `npm run db:push` — creates the tables.
4. `ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run db:seed` — creates the congregation,
   the starter content and the first admin account.
5. Log in at `/admin`.

## Architecture

| Path | Role |
| --- | --- |
| `src/db/schema.ts` | Tables. Every content row carries `tenant_id`. |
| `src/lib/tenant.ts` | Host → tenant. Falls back to `DEFAULT_TENANT`. |
| `src/lib/content.ts` | Read side. DB when present, seed content otherwise. |
| `src/content/seed.ts` | Starter content, also used by `db:seed`. |
| `src/admin/resources.ts` | Field definitions per content type — the CMS spine. |
| `src/app/(site)` | Public app. |
| `src/app/admin` | Admin panel, generated from the resource definitions. |
| `src/proxy.ts` | Gates `/admin`; the real check runs in `src/admin/guard.ts`. |

Adding a content type means adding a table and one entry in
`src/admin/resources.ts` — list, form, validation and delete come for free.

## Adding another congregation

1. Insert a row into `tenants` with its own `slug`, `domain`, `theme` and
   `contact` (or run `DEFAULT_TENANT=<slug> npm run db:seed`).
2. Point the domain at the same Vercel project.
3. Create its admin user with that `tenant_id`.

Colours, logo, contact details, home tiles and page copy are per tenant, so no
code changes are needed.
