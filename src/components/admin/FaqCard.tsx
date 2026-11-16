"use client";

import { FaqForm, type FaqFields } from "./FaqForm";
import type { ActionState } from "@/app/admin/actions";

export function FaqCard({
  item,
  action,
  deleteAction,
}: {
  item: FaqFields & { id: string };
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  deleteAction: (form: FormData) => Promise<void>;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-xl font-light">{item.question}</p>
          <p className="mt-2 line-clamp-2 text-sm text-ink-soft/70">{item.answer}</p>
        </div>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button type="submit" className="admin-btn admin-btn-danger">
            Удалить
          </button>
        </form>
      </div>
      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60">
          Изменить
        </summary>
        <div className="mt-4">
          <FaqForm item={item} action={action} />
        </div>
      </details>
    </div>
  );
}
