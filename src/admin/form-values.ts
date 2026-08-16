import { toLocalInput } from "@/lib/date";
import type { Field } from "./resources";

export type FormValue = string | boolean;

/** Turn a database value into something an `<input>` can hold. */
export function toInputValue(field: Field, value: unknown): FormValue {
  if (field.type === "bool") return value === true;
  if (field.type === "password") return "";
  if (value === null || value === undefined) return "";
  if (field.type === "datetime") {
    return value instanceof Date ? toLocalInput(value) : String(value);
  }
  return String(value);
}

export function defaultValue(field: Field): FormValue {
  if (field.type === "bool") return field.name === "published";
  if (field.type === "number") return "0";
  if (field.type === "select") return field.options?.[0]?.value ?? "";
  return "";
}

export type SerializableField = Field & { options?: { value: string; label: string }[] };
