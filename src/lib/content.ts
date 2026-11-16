import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import type { Dog, FaqItem, Graduate, Locale, LocalizedText, Post, Puppy, SiteContent } from "@/types/db";

export const getSiteContent = cache(async (): Promise<Map<string, LocalizedText>> => {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("site_content").select("key, content");

  if (error) {
    console.error("site_content:", error.message);
    return new Map();
  }

  return new Map(
    ((data ?? []) as Pick<SiteContent, "key" | "content">[]).map((row) => [row.key, row.content]),
  );
});

export async function getText(key: string, locale?: Locale): Promise<string> {
  const content = await getSiteContent();
  return t(content.get(key), locale);
}

export async function getDogs(): Promise<Dog[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("birth_date", { ascending: false });

  if (error) {
    console.error("dogs:", error.message);
    return [];
  }
  return (data ?? []) as Dog[];
}

export async function getPuppies(): Promise<Puppy[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("puppies")
    .select("*")
    .eq("is_active", true)
    .neq("status", "archived")
    .order("sort_order")
    .order("birth_date", { ascending: false });

  if (error) {
    console.error("puppies:", error.message);
    return [];
  }
  return (data ?? []) as Puppy[];
}

export async function getAllDogs(): Promise<Dog[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .order("sort_order")
    .order("birth_date", { ascending: false });

  if (error) {
    console.error("dogs(all):", error.message);
    return [];
  }
  return (data ?? []) as Dog[];
}

export async function getAllPuppies(): Promise<Puppy[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("puppies")
    .select("*")
    .order("sort_order")
    .order("birth_date", { ascending: false });

  if (error) {
    console.error("puppies(all):", error.message);
    return [];
  }
  return (data ?? []) as Puppy[];
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  return getAllContentWith(createServerClient());
}

export async function getAllContentWith(client: SupabaseClient): Promise<SiteContent[]> {
  const { data, error } = await client
    .from("site_content")
    .select("*")
    .order("group_name")
    .order("key");

  if (error) {
    console.error("site_content(all):", error.message);
    return [];
  }
  return (data ?? []) as SiteContent[];
}

export async function getGraduates(): Promise<Graduate[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("graduates")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("graduates:", error.message);
    return [];
  }
  return (data ?? []) as Graduate[];
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("faq_items:", error.message);
    return [];
  }
  return (data ?? []) as FaqItem[];
}

export async function getGalleryPhotos(limit = 60): Promise<string[]> {
  const supabase = createServerClient();

  const [{ data: dogs }, { data: puppies }, { data: posts }] = await Promise.all([
    supabase.from("dogs").select("photos").eq("is_active", true),
    supabase.from("puppies").select("photos").eq("is_active", true),
    supabase.from("posts").select("photos, cover_photo, video_url").eq("is_published", true).limit(limit),
  ]);

  const photos = [
    ...(dogs ?? []).flatMap((row) => (row.photos ?? []) as string[]),
    ...(puppies ?? []).flatMap((row) => (row.photos ?? []) as string[]),
    ...(posts ?? [])
      .filter((row) => !row.video_url)
      .flatMap((row) => [...((row.photos ?? []) as string[]), row.cover_photo as string]),
  ].filter(Boolean);

  return [...new Set(photos)].slice(0, limit);
}

export const getSiteImages = cache(async (): Promise<Record<string, string | null>> => {  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, image_url")
    .not("image_url", "is", null);

  if (error) {
    console.error("site_content(images):", error.message);
    return {};
  }

  return Object.fromEntries((data ?? []).map((row) => [row.key, row.image_url as string | null]));
});

export async function getPublishedPosts(limit = 20): Promise<Post[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("posts:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("posts(all):", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("post:", error.message);
    return null;
  }
  return (data as Post) ?? null;
}
