"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteResourceAction, saveResourceAction, type ActionState } from "@/admin/actions";
import type { FormValue, SerializableField } from "@/admin/form-values";
import { ErrorNote, FieldShell, inputClass } from "./ui";
import { ImageInput } from "./image-input";

export function SubmitButton({ label = "Salvesta" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[14px] bg-ink py-4 text-[16px] font-semibold tracking-tight text-white transition-transform active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? "Salvestan…" : label}
    </button>
  );
}

function FieldInput({
  field,
  value,
}: {
  field: SerializableField;
  value: FormValue;
}) {
  const id = `f-${field.name}`;

  if (field.type === "bool") {
    return (
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-4 rounded-[12px] bg-bg px-4 py-3.5"
      >
        <span className="text-[15px] font-medium tracking-tight text-ink">{field.label}</span>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={value === true}
          className="h-6 w-6 accent-[var(--ink)]"
        />
      </label>
    );
  }

  const common = { id, name: field.name, required: field.required, className: inputClass };

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} rows={5} defaultValue={String(value)} />;
      break;
    case "select":
      control = (
        <select {...common} defaultValue={String(value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "ref":
      control = (
        <select {...common} defaultValue={String(value)}>
          <option value="">- vali -</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = (
        <ImageInput name={field.name} defaultValue={String(value)} required={field.required} />
      );
      break;
    case "number":
      control = <input {...common} type="number" inputMode="numeric" defaultValue={String(value)} />;
      break;
    case "datetime":
      control = <input {...common} type="datetime-local" defaultValue={String(value)} />;
      break;
    case "password":
      control = <input {...common} type="password" autoComplete="new-password" />;
      break;
    default:
      control = (
        <input {...common} type="text" placeholder={field.placeholder} defaultValue={String(value)} />
      );
  }

  return (
    <FieldShell label={field.label} help={field.help} htmlFor={id}>
      {control}
    </FieldShell>
  );
}

export function ResourceForm({
  resourceKey,
  id,
  fields,
  values,
  backHref,
}: {
  resourceKey: string;
  id: string | null;
  fields: SerializableField[];
  values: Record<string, FormValue>;
  backHref: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveResourceAction, {});

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="__resource" value={resourceKey} />
        {id ? <input type="hidden" name="__id" value={id} /> : null}

        {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}

        {fields.map((field) => (
          <FieldInput key={field.name} field={field} value={values[field.name] ?? ""} />
        ))}

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>

      <div className="flex items-center justify-between">
        <Link href={backHref} className="text-[14px] font-medium text-ink-3">
          ← Tagasi
        </Link>
        {id ? (
          <form action={deleteResourceAction}>
            <input type="hidden" name="__resource" value={resourceKey} />
            <input type="hidden" name="__id" value={id} />
            <button
              type="submit"
              className="text-[14px] font-medium text-[#8a1c1c]"
              onClick={(e) => {
                if (!confirm("Kustutada jäädavalt?")) e.preventDefault();
              }}
            >
              Kustuta
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
