"use client";

import { useActionState } from "react";
import { saveSettingsAction, type ActionState } from "@/admin/actions";
import type { TenantContact, TenantTheme } from "@/db/schema";
import { SubmitButton } from "./resource-form";
import { ErrorNote, FieldShell, OkNote, inputClass } from "./ui";
import { ImageInput } from "./image-input";

type Values = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  domain: string;
  contact: TenantContact;
  theme: TenantTheme;
};

const CONTACT_FIELDS: { key: keyof TenantContact; label: string; placeholder?: string }[] = [
  { key: "phone", label: "Telefon", placeholder: "324 3928" },
  { key: "email", label: "E-post", placeholder: "info@kogudus.ee" },
  { key: "addressChurch", label: "Kiriku aadress" },
  { key: "addressOffice", label: "Kantselei aadress" },
  { key: "mapsUrl", label: "Kaardi link" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Koduleht" },
  { key: "iban", label: "Konto (IBAN)" },
  { key: "ibanOwner", label: "Saaja" },
  { key: "ibanReference", label: "Selgitus" },
];

const THEME_FIELDS: { key: keyof TenantTheme; label: string; fallback: string }[] = [
  { key: "bg", label: "Taust", fallback: "#f7f4ec" },
  { key: "surface", label: "Kaardid", fallback: "#ffffff" },
  { key: "ink", label: "Tekst", fallback: "#0d0b08" },
  { key: "ink2", label: "Tekst 2", fallback: "#3a352d" },
  { key: "ink3", label: "Tekst 3", fallback: "#79736a" },
  { key: "line", label: "Jooned", fallback: "#ece7d9" },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function SettingsForm({ values }: { values: Values }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSettingsAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
      {state.ok ? <OkNote>Salvestatud.</OkNote> : null}

      <Group title="Kogudus">
        <FieldShell label="Nimi" htmlFor="name">
          <input id="name" name="name" defaultValue={values.name} required className={inputClass} />
        </FieldShell>
        <FieldShell label="Lühinimi" help="Kuvatakse äpi nimena" htmlFor="shortName">
          <input
            id="shortName"
            name="shortName"
            defaultValue={values.shortName}
            required
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Logo" htmlFor="logoUrl">
          <ImageInput name="logoUrl" defaultValue={values.logoUrl} />
        </FieldShell>
        <FieldShell label="Kirjeldus" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={values.description}
            className={inputClass}
          />
        </FieldShell>
        <FieldShell label="Domeen" help="Nt kolmainu.ee — seob selle koguduse aadressiga" htmlFor="domain">
          <input id="domain" name="domain" defaultValue={values.domain} className={inputClass} />
        </FieldShell>
      </Group>

      <Group title="Kontakt ja annetused">
        {CONTACT_FIELDS.map((f) => (
          <FieldShell key={f.key} label={f.label} htmlFor={`contact-${f.key}`}>
            <input
              id={`contact-${f.key}`}
              name={`contact.${f.key}`}
              defaultValue={values.contact[f.key] ?? ""}
              placeholder={f.placeholder}
              className={inputClass}
            />
          </FieldShell>
        ))}
      </Group>

      <Group title="Värvid">
        <div className="grid grid-cols-2 gap-3">
          {THEME_FIELDS.map((f) => (
            <FieldShell key={f.key} label={f.label} htmlFor={`theme-${f.key}`}>
              <input
                id={`theme-${f.key}`}
                name={`theme.${f.key}`}
                defaultValue={values.theme[f.key] ?? ""}
                placeholder={f.fallback}
                className={inputClass}
              />
            </FieldShell>
          ))}
        </div>
      </Group>

      <SubmitButton />
    </form>
  );
}
