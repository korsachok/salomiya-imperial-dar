// Единый источник канонического адреса сайта.
// Прод: основной домен. Vercel-превью и локальная разработка индексироваться не должны.
export const SITE_URL = "https://www.salomiya-imperial-dar.ru";

export const SITE_NAME = "Salomiya Imperial Dar";

// Хост по умолчанию, если переменная окружения не задана.
export const DEFAULT_HOST = "www.salomiya-imperial-dar.ru";

/** Текущий хост запроса берём из заголовка, чтобы не зависеть от конфигурации Vercel. */
export function hostFromHeaders(h: Headers): string {
  return (h.get("x-forwarded-host") ?? h.get("host") ?? DEFAULT_HOST).split(":")[0];
}

/** Индексировать разрешено только на основном домене. */
export function isIndexableHost(host: string): boolean {
  return host === DEFAULT_HOST || host === DEFAULT_HOST.replace(/^www\./, "");
}
