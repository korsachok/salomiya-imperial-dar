import type { LocalizedText } from "@/types/db";
import { t } from "@/lib/i18n";

export type SiteImages = Record<string, string | null>;

export function texts(content: Map<string, LocalizedText>, key: string, fallback = ""): string {
  return t(content.get(key)) || fallback;
}

export function imageOf(images: SiteImages, key: string, fallback: string | null = null): string | null {
  return images[key] ?? fallback;
}

// Next отдаёт params уже percent-encoded при кириллических slug.
// Декодируем безопасно: битая последовательность не должна ронять страницу.
export function decodeSlug(slug: string): string {
  if (!/%[0-9a-f]{2}/i.test(slug)) return slug;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Транслитерация для стабильных ASCII-URL: кириллица в slug валидна,
// но ASCII надёжнее для ссылок в мессенджерах и соцсетях.
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(value: string, fallback = "item"): string {
  const ascii = value
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return ascii || fallback;
}
