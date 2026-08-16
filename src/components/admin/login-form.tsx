"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/admin/actions";
import { SubmitButton } from "./resource-form";
import { ErrorNote, FieldShell, inputClass } from "./ui";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}

      <FieldShell label="E-post" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </FieldShell>

      <FieldShell label="Parool" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </FieldShell>

      <div className="pt-2">
        <SubmitButton label="Logi sisse" />
      </div>
    </form>
  );
}
