"use client";

import { useState } from "react";
import { AdminForm } from "./AdminForm";
import type { ActionState } from "@/app/admin/actions";

export type FaqFields = { id?: string; question?: string; answer?: string; sort_order?: number };

export function FaqForm({
  item,
  action,
}: {
  item?: FaqFields;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  return (
    <AdminForm action={action} submitLabel={item?.id ? "Сохранить" : "Добавить вопрос"} className="space-y-4">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <label className="block">
        <span className="admin-label">Вопрос</span>
        <input name="question" defaultValue={item?.question ?? ""} required className="admin-input" />
      </label>
      <label className="block">
        <span className="admin-label">Ответ</span>
        <textarea name="answer" defaultValue={item?.answer ?? ""} rows={4} required className="admin-input" />
      </label>
      <label className="block w-28">
        <span className="admin-label">Порядок</span>
        <input type="number" name="sort_order" defaultValue={item?.sort_order ?? 0} className="admin-input" />
      </label>
    </AdminForm>
  );
}
