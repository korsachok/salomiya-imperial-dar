import type { LocalizedText, Locale } from "@/types/db";

export const DEFAULT_LOCALE: Locale = "ru";

export function t(text: LocalizedText | null | undefined, locale: Locale = DEFAULT_LOCALE): string {
  if (!text) return "";
  return text[locale] ?? text[DEFAULT_LOCALE] ?? "";
}
