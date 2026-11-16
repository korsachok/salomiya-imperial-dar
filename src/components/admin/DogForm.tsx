"use client";

import { AdminForm } from "./AdminForm";
import { PhotosField } from "./PhotosField";
import type { ActionState } from "@/app/admin/actions";

export type DogFields = {
  id?: string;
  name: string;
  slug?: string | null;
  sex?: string | null;
  birth_date?: string | null;
  color?: string | null;
  title?: string | null;
  description?: string;
  photos?: string[];
  main_photo?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export function DogForm({
  dog,
  action,
}: {
  dog?: DogFields;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  return (
    <AdminForm action={action} submitLabel={dog?.id ? "Сохранить изменения" : "Создать карточку"} className="space-y-5">
      <input type="hidden" name="id" value={dog?.id ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Кличка">
          <input name="name" defaultValue={dog?.name ?? ""} required className="admin-input" />
        </Field>
        <Field label="Родословная / слаг (необязательно)">
          <input name="slug" defaultValue={dog?.slug ?? ""} className="admin-input" placeholder="автоматически" />
        </Field>
        <Field label="Пол">
          <select name="sex" defaultValue={dog?.sex ?? ""} className="admin-input">
            <option value="">—</option>
            <option value="male">Кобель</option>
            <option value="female">Сука</option>
          </select>
        </Field>
        <Field label="Дата рождения">
          <input type="date" name="birth_date" defaultValue={dog?.birth_date ?? ""} className="admin-input" />
        </Field>
        <Field label="Окрас">
          <input name="color" defaultValue={dog?.color ?? ""} className="admin-input" />
        </Field>
        <Field label="Титулы">
          <input name="title" defaultValue={dog?.title ?? ""} className="admin-input" />
        </Field>
        <Field label="Отец">
          <input name="father_name" defaultValue={dog?.father_name ?? ""} className="admin-input" />
        </Field>
        <Field label="Мать">
          <input name="mother_name" defaultValue={dog?.mother_name ?? ""} className="admin-input" />
        </Field>
      </div>

      <Field label="Описание">
        <textarea name="description" defaultValue={dog?.description ?? ""} rows={5} className="admin-input" />
      </Field>

      <PhotosField name="photos" initial={dog?.photos ?? []} initialMain={dog?.main_photo} />

      <div className="flex flex-wrap items-end gap-6">
        <Field label="Порядок">
          <input
            type="number"
            name="sort_order"
            defaultValue={dog?.sort_order ?? 0}
            className="admin-input w-24"
          />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm text-ink-soft">
          <input type="checkbox" name="is_active" defaultChecked={dog?.is_active ?? true} />
          Показывать на сайте
        </label>
      </div>
    </AdminForm>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
