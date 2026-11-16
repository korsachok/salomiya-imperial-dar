"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";

export function AdminForm({
  action,
  children,
  submitLabel = "Сохранить",
  className,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="admin-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? "Сохраняем…" : submitLabel}
        </button>
        {state.error ? <p className="admin-error-text">{state.error}</p> : null}
        {state.ok ? <p className="admin-ok-text">Сохранено</p> : null}
      </div>
    </form>
  );
}
