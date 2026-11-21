#!/usr/bin/env node
/**
 * Экспорт контента Supabase в JSON-файл.
 *
 * Использует ТОЛЬКО публичный anon-ключ и REST API — тот же путь, которым
 * ходит сам сайт. Значит скрипт не имеет доступа ни к чему, кроме публичных
 * данных, и не может навредить базе (только SELECT).
 *
 * Использование:
 *   node scripts/backup-supabase.mjs [--out backups]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Нужны NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const TABLES = ["site_content", "dogs", "puppies", "posts", "graduates", "faq_items"];

// Служебные поля, которые не нужно хранить в дампе.
const OMIT = new Set(["id"]);

async function fetchAll(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

function stripFields(rows) {
  return rows.map((row) => {
    const out = {};
    for (const [k, v] of Object.entries(row)) if (!OMIT.has(k)) out[k] = v;
    return out;
  });
}

const outDir = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "backups";
mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const snapshot = { created_at: new Date().toISOString(), source: "supabase-rest", tables: {} };

for (const table of TABLES) {
  try {
    const rows = await fetchAll(table);
    // Порядок стабилен, поэтому одинаковые данные дают одинаковый файл.
    rows.sort((a, b) => String(a.id ?? a.key ?? "").localeCompare(String(b.id ?? b.key ?? "")));
    snapshot.tables[table] = stripFields(rows);
    console.log(`${table}: ${rows.length}`);
  } catch (err) {
    console.error(`ОШИБКА ${table}: ${err.message}`);
    process.exitCode = 1;
  }
}

const file = join(outDir, `content-${stamp}.json`);
writeFileSync(file, JSON.stringify(snapshot, null, 2), "utf8");
console.log(`Записано: ${file}`);
