"use client";

import { AdminForm } from "./AdminForm";
import { PhotosField } from "./PhotosField";
import { VideoField } from "./VideoField";
import type { ActionState } from "@/app/admin/actions";

export type PostFields = {
  id?: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  cover_photo?: string | null;
  photos?: string[];
  video_url?: string | null;
  published_at?: string;
  is_published?: boolean;
  sort_order?: number;
};

export function formatDateForInput(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PostForm({
  post,
  action,
}: {
  post?: PostFields;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  return (
    <AdminForm
      action={action}
      submitLabel={post?.id ? "Сохранить изменения" : "Опубликовать"}
      className="space-y-5"
    >
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <label className="block">
        <span className="admin-label">Заголовок</span>
        <input name="title" defaultValue={post?.title ?? ""} required className="admin-input" />
      </label>

      <label className="block">
        <span className="admin-label">Короткое описание (для ленты)</span>
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className="admin-input" />
      </label>

      <label className="block">
        <span className="admin-label">Текст</span>
        <textarea name="body" defaultValue={post?.body ?? ""} rows={8} className="admin-input" />
      </label>

      <PhotosField name="photos" initial={post?.photos ?? []} initialMain={post?.cover_photo} />

      <VideoField name="video_url" initial={post?.video_url} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="admin-label">Дата публикации</span>
          <input
            type="datetime-local"
            name="published_at"
            defaultValue={formatDateForInput(post?.published_at)}
            className="admin-input"
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink-soft">
          <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? true} />
          Опубликован
        </label>
      </div>

      <input type="hidden" name="slug" value={post?.slug ?? ""} />
      <input type="hidden" name="sort_order" value={post?.sort_order ?? 0} />
    </AdminForm>
  );
}
