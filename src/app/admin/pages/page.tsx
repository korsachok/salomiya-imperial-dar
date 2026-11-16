import { getAllSiteContent, getGraduates, getFaqItems } from "@/lib/content";
import { t } from "@/lib/i18n";
import { saveContentRows, saveGraduate, deleteGraduate, saveFaqItem, deleteFaqItem } from "@/app/admin/actions";
import { PageContentForm } from "@/components/admin/PageContentForm";
import { GraduateForm } from "@/components/admin/GraduateForm";
import { GraduateCard } from "@/components/admin/GraduateCard";
import { FaqForm } from "@/components/admin/FaqForm";
import { FaqCard } from "@/components/admin/FaqCard";

export const dynamic = "force-dynamic";

const GROUPS: { id: string; title: string; hint?: string }[] = [
  { id: "about", title: "О питомнике" },
  { id: "dogs", title: "Страница «Собаки»" },
  { id: "puppies", title: "Страница «Щенки»" },
  { id: "gallery", title: "Галерея" },
  { id: "graduates", title: "Выпускники" },
  { id: "faq", title: "Вопросы" },
  { id: "contacts", title: "Контакты" },
  { id: "general", title: "Общее и подвал" },
];

const LONG_KEYS = new Set(["about.text", "about.values", "puppies.how", "about.intro", "contacts.intro", "faq.intro", "graduates.intro"]);

const IMAGE_KEYS = new Set([
  "about.image",
  "about.image2",
  "dogs.image",
  "puppies.image",
  "contacts.image",
  "hero.image",
]);

export default async function AdminPages() {
  const [content, graduates, faq] = await Promise.all([getAllSiteContent(), getGraduates(), getFaqItems()]);

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <p className="eyebrow">Страницы</p>
        <h1 className="mt-3 font-display text-4xl font-light">Тексты и фото страниц</h1>
        <p className="mt-3 text-sm text-ink-soft/70">
          Каждый раздел сохраняется отдельно. Картинки загружаются в Supabase Storage.
        </p>
      </div>

      {GROUPS.map((group) => {
        const rows = content.filter((row) => row.group_name === group.id);
        if (rows.length === 0) return null;

        return (
          <PageContentForm
            key={group.id}
            group={group.id}
            title={group.title}
            action={saveContentRows}
            rows={rows.map((row) => ({
              key: row.key,
              label: row.label,
              value: t(row.content),
              image: row.image_url,
              kind: IMAGE_KEYS.has(row.key) ? ("image" as const) : LONG_KEYS.has(row.key) ? ("long" as const) : ("text" as const),
            }))}
          />
        );
      })}

      <section className="space-y-4">
        <div className="card">
          <h2 className="font-display text-2xl font-light">Новый выпускник</h2>
          <div className="mt-4">
            <GraduateForm action={saveGraduate} />
          </div>
        </div>
        {graduates.map((graduate) => (
          <GraduateCard
            key={graduate.id}
            graduate={graduate}
            action={saveGraduate}
            deleteAction={deleteGraduate}
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="card">
          <h2 className="font-display text-2xl font-light">Новый вопрос</h2>
          <div className="mt-4">
            <FaqForm action={saveFaqItem} />
          </div>
        </div>
        {faq.map((item) => (
          <FaqCard key={item.id} item={item} action={saveFaqItem} deleteAction={deleteFaqItem} />
        ))}
      </section>
    </div>
  );
}
