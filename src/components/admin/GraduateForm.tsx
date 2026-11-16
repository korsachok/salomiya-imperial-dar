"use client";

import { AdminForm } from "./AdminForm";
import { ImageField } from "./ImageField";
import type { ActionState } from "@/app/admin/actions";

export type GraduateFields = {
  id?: string;
  name?: string;
  owner_city?: string | null;
  birth_year?: number | null;
  description?: string | null;
  photo?: string | null;
  sort_order?: number;
};

export function GraduateForm({
  graduate,
  action,
  submitLabel,
}: {
  graduate?: GraduateFields;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  submitLabel?: string;
}) {
  return (
    <AdminForm
      action={action}
      submitLabel={submitLabel ?? (graduate?.id ? "Сохранить" : "Добавить выпускника")}
      className="space-y-4"
    >
      <input type="hidden" name="id" value={graduate?.id ?? ""} />
      <ImageField initial={graduate?.photo ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="admin-label">Имя</span>
          <input name="name" defaultValue={graduate?.name ?? ""} required className="admin-input" />
        </label>
        <label className="block">
          <span className="admin-label">Город владельца</span>
          <input name="owner_city" defaultValue={graduate?.owner_city ?? ""} className="admin-input" />
        </label>
        <label className="block">
          <span className="admin-label">Год рождения</span>
          <input type="number" name="birth_year" defaultValue={graduate?.birth_year ?? ""} className="admin-input" />
        </label>
        <label className="block">
          <span className="admin-label">Порядок</span>
          <input type="number" name="sort_order" defaultValue={graduate?.sort_order ?? 0} className="admin-input" />
        </label>
      </div>
      <label className="block">
        <span className="admin-label">Описание</span>
        <textarea name="description" defaultValue={graduate?.description ?? ""} rows={3} className="admin-input" />
      </label>
    </AdminForm>
  );
}
