"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signIn, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="admin-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="admin-input"
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input"
        />
      </div>
      <button type="submit" className="admin-btn w-full" disabled={pending}>
        {pending ? "Проверяем…" : "Войти"}
      </button>
      {state.error ? <p className="admin-error-text">{state.error}</p> : null}
    </form>
  );
}
