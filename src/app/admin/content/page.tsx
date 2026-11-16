import { getAllSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";
import { AdminForm } from "@/components/admin/AdminForm";
import { ContentImageField } from "@/components/admin/ContentImageField";
import { saveContent } from "@/app/admin/actions";

const GROUP_TITLES: Record<string, string> = {
  general: "Общее",
  hero: "Главный экран",
  about: "О питомнике",
  contacts: "Контакты",
};

const IMAGE_KEYS = new Set(["hero.image", "about.image"]);
const MAIN_GROUPS = new Set(["general", "hero", "about", "contacts"]);

export default async function AdminContentPage() {
  const rows = (await getAllSiteContent()).filter((row) => MAIN_GROUPS.has(row.group_name));

  const groups = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    (acc[row.group_name] ??= []).push(row);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Главная</p>
      <h1 className="mt-3 font-display text-4xl font-light">Главная и общие тексты</h1>
      <p className="mt-3 text-sm text-ink-soft/70">
        Здесь — обложка и блок «О питомнике» на главной, название питомника и контакты. Тексты остальных
        страниц редактируются в разделе «Страницы».
      </p>

      <AdminForm action={saveContent} submitLabel="Сохранить все" className="mt-10 space-y-8">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group} className="card">
            <h2 className="font-display text-2xl font-light">{GROUP_TITLES[group] ?? group}</h2>
            <div className="mt-6 space-y-5">
              {items.map((row) => {
                if (IMAGE_KEYS.has(row.key)) {
                  return (
                    <div key={row.key}>
                      <span className="admin-label">{row.label ?? row.key}</span>
                      <ContentImageField contentKey={row.key} current={row.image_url} />
                    </div>
                  );
                }

                const value = t(row.content);
                const long = value.length > 120 || row.key === "about.text";
                return (
                  <div key={row.key}>
                    <label className="admin-label" htmlFor={`content:${row.key}`}>
                      {row.label ?? row.key}
                    </label>
                    {long ? (
                      <textarea
                        id={`content:${row.key}`}
                        name={`content:${row.key}`}
                        defaultValue={value}
                        className="admin-input"
                        rows={6}
                      />
                    ) : (
                      <input
                        id={`content:${row.key}`}
                        name={`content:${row.key}`}
                        defaultValue={value}
                        className="admin-input"
                      />
                    )}
                    <p className="mt-1 text-[0.625rem] tracking-[0.1em] uppercase text-ink-soft/40">{row.key}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </AdminForm>
    </div>
  );
}
