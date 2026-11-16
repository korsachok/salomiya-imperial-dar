import type { LocalizedText } from "@/types/db";
import { t } from "@/lib/i18n";

export type SiteImages = Record<string, string | null>;

export function texts(content: Map<string, LocalizedText>, key: string, fallback = ""): string {
  return t(content.get(key)) || fallback;
}

export function imageOf(images: SiteImages, key: string, fallback: string | null = null): string | null {
  return images[key] ?? fallback;
}
