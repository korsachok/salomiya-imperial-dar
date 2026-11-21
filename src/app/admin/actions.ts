"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { getAllContentWith } from "@/lib/content";
import { slugify } from "@/lib/page-data";
import { checkRateLimit, clientKey, resetRateLimit } from "@/lib/rate-limit";
import { t } from "@/lib/i18n";
import type { LocalizedText, PuppyStatus } from "@/types/db";

export type ActionState = { error?: string; ok?: boolean };
async function requireUser() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Защита в глубину: RLS — главный рубеж, но и серверный экшен не должен
  // полагаться только на неё. Список владельцев читает SECURITY DEFINER
  // функция public.is_admin() из миграции 0009.
  //  - функции нет (0009 не применена) → PGRST202: не блокируем, чтобы не
  //    сломать рабочую админку до миграции;
  //  - функция есть → пускаем только при is_admin() === true.
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  const fnMissing = error?.code === "PGRST202" || /could not find the function/i.test(error?.message ?? "");
  if (!fnMissing && isAdmin !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return { user, supabase };
}

// Пишем сессионным клиентом: под ним RLS видит auth.uid() и пускает на запись.
async function authClient() {
  return (await requireUser()).supabase;
}

function str(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

function nullable(form: FormData, name: string): string | null {
  const value = str(form, name);
  return value === "" ? null : value;
}

function uniqueSlug(form: FormData, source: string): string {
  const manual = str(form, "slug");
  if (manual) return manual;
  return `${slugify(source)}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = str(form, "email");
  const password = str(form, "password");
  if (!email || !password) return { error: "Введите email и пароль" };

  const requestHeaders = await headers();
  const key = clientKey(requestHeaders, email);
  const limit = checkRateLimit(key);
  if (!limit.ok) {
    return { error: `Слишком много попыток. Повторите через ${limit.retryAfterMin} мин.` };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Неверный email или пароль" };

  resetRateLimit(key);
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveContent(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const client = await authClient();
  const rows = await getAllContentWith(client);
  const changed = rows
    .map((row) => ({
      row,
      value: str(form, `content:${row.key}`),
    }))
    .filter(({ row, value }) => value !== t(row.content));

  for (const { row, value } of changed) {
    const content: LocalizedText = { ...row.content, ru: value };
    const { error } = await client.from("site_content").update({ content }).eq("key", row.key);
    if (error) return { error: `Не удалось сохранить «${row.label ?? row.key}»: ${error.message}` };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

function parseLocalized(value: string): LocalizedText {
  return value === "" ? {} : { ru: value };
}

function parsePhotos(form: FormData): string[] {
  return str(form, "photos")
    .split(/[\n,]/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function saveContentImage(form: FormData) {
  await requireUser();

  const key = str(form, "key");
  const url = nullable(form, "image_url");
  if (!key.startsWith("hero.") && !key.startsWith("about.") && !key.startsWith("dogs.") && !key.startsWith("puppies.") && !key.startsWith("contacts.")) {
    throw new Error("Неизвестный ключ изображения");
  }

  const { error } = await (await authClient())
    .from("site_content")
    .update({ image_url: url })
    .eq("key", key);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

// Сохраняет весь раздел site_content: тексты (text:<key>) и картинки (image:<key>).
export async function saveContentRows(form: FormData): Promise<ActionState> {
  await requireUser();

  const client = await authClient();
  const { data: rows, error: readError } = await client.from("site_content").select("key, content");
  if (readError) return { error: readError.message };

  const current = new Map((rows ?? []).map((row) => [row.key, row.content as Record<string, string> | null]));

  for (const [field, raw] of form.entries()) {
    const [kind, key] = field.split(":");
    if (!kind || !key) continue;

    if (kind === "text") {
      const value = typeof raw === "string" ? raw : "";
      const { error } = await client
        .from("site_content")
        .update({ content: { ...(current.get(key) ?? {}), ru: value } })
        .eq("key", key);
      if (error) return { error: `${key}: ${error.message}` };
    }

    if (kind === "image") {
      const value = typeof raw === "string" ? raw.trim() : "";
      const { error } = await client
        .from("site_content")
        .update({ image_url: value === "" ? null : value })
        .eq("key", key);
      if (error) return { error: `${key}: ${error.message}` };
    }
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveGraduate(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const name = str(form, "name");
  if (!name) return { error: "Укажите имя" };

  const year = str(form, "birth_year");
  const payload = {
    name,
    owner_city: nullable(form, "owner_city"),
    birth_year: year === "" ? null : Number(year),
    description: nullable(form, "description"),
    photo: nullable(form, "image_url"),
    sort_order: Number(str(form, "sort_order") || 0),
  };

  const client = await authClient();
  const id = nullable(form, "id");
  const { error } = id
    ? await client.from("graduates").update(payload).eq("id", id)
    : await client.from("graduates").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/graduates");
  return { ok: true };
}

export async function deleteGraduate(form: FormData) {
  await requireUser();
  await (await authClient()).from("graduates").delete().eq("id", str(form, "id"));
  revalidatePath("/graduates");
}

export async function saveFaqItem(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const question = str(form, "question");
  const answer = str(form, "answer");
  if (!question || !answer) return { error: "Заполните вопрос и ответ" };

  const payload = { question, answer, sort_order: Number(str(form, "sort_order") || 0) };
  const client = await authClient();
  const id = nullable(form, "id");
  const { error } = id
    ? await client.from("faq_items").update(payload).eq("id", id)
    : await client.from("faq_items").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/faq");
  return { ok: true };
}

export async function deleteFaqItem(form: FormData) {
  await requireUser();
  await (await authClient()).from("faq_items").delete().eq("id", str(form, "id"));
  revalidatePath("/faq");
}

export async function saveDog(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const id = nullable(form, "id");
  const name = str(form, "name");
  if (!name) return { error: "Укажите кличку" };

  const photos = parsePhotos(form);
  const payload = {
    name,
    slug: uniqueSlug(form, name),
    sex: nullable(form, "sex"),
    birth_date: nullable(form, "birth_date"),
    color: nullable(form, "color"),
    title: nullable(form, "title"),
    description: parseLocalized(str(form, "description")),
    photos,
    main_photo: nullable(form, "main_photo") || photos[0] || null,
    father_name: nullable(form, "father_name"),
    mother_name: nullable(form, "mother_name"),
    is_active: form.get("is_active") === "on",
    sort_order: Number(str(form, "sort_order") || 0),
  };

  const client = await authClient();
  const { error } = id
    ? await client.from("dogs").update(payload).eq("id", id)
    : await client.from("dogs").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

// Удаление — только скрытие. Данные остаются в базе и восстанавливаются
// переключением is_active, потому что бесплатные бэкапы у Supabase ограничены.
export async function deleteDog(form: FormData) {
  await requireUser();
  const id = str(form, "id");
  await (await authClient()).from("dogs").update({ is_active: false }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function savePuppy(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const id = nullable(form, "id");
  const name = str(form, "name");
  if (!name) return { error: "Укажите имя щенка" };

  const photos = parsePhotos(form);
  const status = str(form, "status") as PuppyStatus;
  const allowed: PuppyStatus[] = ["available", "reserved", "sold", "archived"];
  if (!allowed.includes(status)) return { error: "Неверный статус" };

  const priceRaw = str(form, "price");

  const payload = {
    name,
    slug: uniqueSlug(form, name),
    sex: nullable(form, "sex"),
    birth_date: nullable(form, "birth_date"),
    color: nullable(form, "color"),
    litter_name: nullable(form, "litter_name"),
    description: parseLocalized(str(form, "description")),
    photos,
    main_photo: nullable(form, "main_photo") || photos[0] || null,
    price: priceRaw === "" ? null : Number(priceRaw),
    status,
    is_active: form.get("is_active") === "on",
    sort_order: Number(str(form, "sort_order") || 0),
  };

  const client = await authClient();
  const { error } = id
    ? await client.from("puppies").update(payload).eq("id", id)
    : await client.from("puppies").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function savePost(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const id = nullable(form, "id");
  const title = str(form, "title");
  if (!title) return { error: "Укажите заголовок" };

  const photos = parsePhotos(form);
  const publishedAt = str(form, "published_at");

  const payload = {
    title,
    slug: uniqueSlug(form, title),
    excerpt: nullable(form, "excerpt"),
    body: nullable(form, "body"),
    cover_photo: nullable(form, "main_photo") || photos[0] || null,
    photos,
    video_url: nullable(form, "video_url"),
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    is_published: form.get("is_published") === "on",
    sort_order: Number(str(form, "sort_order") || 0),
  };

  const client = await authClient();
  const { error } = id
    ? await client.from("posts").update(payload).eq("id", id)
    : await client.from("posts").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePost(form: FormData) {
  await requireUser();
  const id = str(form, "id");
  await (await authClient()).from("posts").update({ is_published: false }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deletePuppy(form: FormData) {
  await requireUser();
  const id = str(form, "id");
  await (await authClient())
    .from("puppies")
    .update({ is_active: false, status: "archived" })
    .eq("id", id);
  revalidatePath("/", "layout");
}
