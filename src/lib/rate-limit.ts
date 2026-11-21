// Простой in-memory счётчик попыток входа.
// Работает в пределах одного инстанса Vercel: это не полноценный WAF, но
// отсекает самый частый случай — перебор пароля с одного адреса.
// Supabase Auth дополнительно ограничивает частоту на своей стороне.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // окно наблюдения
const MAX_ATTEMPTS = 8; // попыток за окно на адрес

// Карта не должна расти бесконечно в долгоживущем инстансе.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function clientKey(headers: Headers, email: string): string {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  return `${ip}|${email.toLowerCase()}`;
}

export function checkRateLimit(key: string): { ok: boolean; retryAfterMin?: number } {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  bucket.count += 1;
  if (bucket.count > MAX_ATTEMPTS) {
    return { ok: false, retryAfterMin: Math.ceil((bucket.resetAt - now) / 60000) };
  }
  return { ok: true };
}

/** Успешный вход сбрасывает счётчик. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}
