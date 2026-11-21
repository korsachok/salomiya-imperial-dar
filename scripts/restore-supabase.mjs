#!/usr/bin/env node
/**
 * Восстановление контента из JSON-дампа, сделанного scripts/backup-supabase.mjs.
 *
 * ПО УМОЛЧАНИЮ НИЧЕГО НЕ ЗАПИСЫВАЕТ — только показывает, что будет сделано.
 * Запись требует:
 *   1) SUPABASE_SERVICE_ROLE_KEY (обход RLS) ИЛИ залогиненного owner-токена;
 *   2) явного флага --apply.
 *
 * Пример проверки на отдельной тестовой базе:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/restore-supabase.mjs backups/content-....json
 *
 * Пример реального восстановления:
 *   ... node scripts/restore-supabase.mjs backups/content-....json --apply
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
const apply = process.argv.includes("--apply");

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!file) {
  console.error("Укажите файл дампа: node scripts/restore-supabase.mjs <file.json> [--apply]");
  process.exit(1);
}
if (!url || !key) {
  console.error("Нужны SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY (или anon для dry-run)");
  process.exit(1);
}

const usingAnon = !process.env.SUPABASE_SERVICE_ROLE_KEY;
const snapshot = JSON.parse(readFileSync(file, "utf8"));
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

console.log(`Файл: ${file} (создан ${snapshot.created_at})`);
console.log(`Режим: ${apply ? "ЗАПИСЬ" : "dry-run (ничего не меняется)"}`);
console.log(`Ключ: ${usingAnon ? "anon (RLS применится, запись скорее всего будет отклонена)" : "service_role"}`);

let failed = 0;

for (const [table, rows] of Object.entries(snapshot.tables)) {
  console.log(`${table}: ${rows.length} строк`);
  if (!apply) continue;

  // on_conflict нужен для идемпотентности: повторный запуск не создаёт дублей.
  const res = await fetch(`${url}/rest/v1/${table}?on_conflict=id`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    failed++;
    console.error(`  ОШИБКА ${table}: HTTP ${res.status} ${await res.text()}`);
  } else {
    console.log(`  восстановлено ${rows.length}`);
  }
}

if (!apply) console.log("\nDry-run завершён. Для записи добавьте --apply");
process.exitCode = failed ? 1 : 0;
