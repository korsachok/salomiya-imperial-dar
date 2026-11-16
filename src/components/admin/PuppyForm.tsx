"use client";

import { AdminForm } from "./AdminForm";
import { PhotosField } from "./PhotosField";
import type { ActionState } from "@/app/admin/actions";

export type PuppyFields = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  sex?: string | null;
  birth_date?: string | null;
  color?: string | null;
  litter_name?: string | null;
  description?: string;
  photos?: string[];
  main_photo?: string | null;
  price?: number | null;
  status?: string;
  is_active?: boolean;
  sort_order?: number;
};

const STATUSES = [
  { value: "available", label: "Свободен" },
  { value: "reserved", label: "В резерве" },
  { value: "sold", label: "Продан" },
  { value: "archived", label: "Скрыт в архиве" },
];

export function PuppyForm({
  puppy,
  action,
}: {
  puppy?: PuppyFields;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  return (
    <AdminForm
      action={action}
      submitLabel={puppy?.id ? "Сохранить изменения" : "Создать карточку"}
      className="space-y-5"
    >
      <input type="hidden" name="id" value={puppy?.id ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Имя">
          <input name="name" defaultValue={puppy?.name ?? ""} required className="admin-input" />
        </Field>
        <Field label="Помёт">
          <input name="litter_name" defaultValue={puppy?.litter_name ?? ""} className="admin-input" />
        </Field>
        <Field label="Пол">
          <select name="sex" defaultValue={puppy?.sex ?? ""} className="admin-input">
            <option value="">—</option>
            <option value="male">Кобель</option>
            <option value="female">Сука</option>
          </select>
        </Field>
        <Field label="Дата рождения">
          <input type="date" name="birth_date" defaultValue={puppy?.birth_date ?? ""} className="admin-input" />
        </Field>
        <Field label="Окрас">
          <input name="color" defaultValue={puppy?.color ?? ""} className="admin-input" />
        </Field>
        <Field label="Цена (необязательно)">
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={puppy?.price ?? ""}
            className="admin-input"
          />
        </Field>
        <Field label="Статус">
          <select name="status" defaultValue={puppy?.status ?? "available"} className="admin-input">
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Порядок">
          <input
            type="number"
            name="sort_order"
            defaultValue={puppy?.sort_order ?? 0}
            className="admin-input"
          />
        </Field>
      </div>

      <Field label="Описание">
        <textarea name="description" defaultValue={puppy?.description ?? ""} rows={4} className="admin-input" />
      </Field>

      <PhotosField name="photos" initial={puppy?.photos ?? []} initialMain={puppy?.main_photo} />

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="is_active" defaultChecked={puppy?.is_active ?? true} />
        Показывать на сайте
      </label>

      <input type="hidden" name="slug" value={puppy?.slug ?? ""} />
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
