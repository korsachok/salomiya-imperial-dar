import Link from "next/link";
import { getAllDogs, getAllPuppies, getAllSiteContent, getAllPosts } from "@/lib/content";
import { getUser } from "@/lib/supabase/auth-server";

export default async function AdminDashboard() {
  const [user, dogs, puppies, content, posts] = await Promise.all([
    getUser(),
    getAllDogs(),
    getAllPuppies(),
    getAllSiteContent(),
    getAllPosts(),
  ]);

  const available = puppies.filter((p) => p.status === "available").length;
  const reserved = puppies.filter((p) => p.status === "reserved").length;
  const drafts = posts.filter((p) => !p.is_published).length;

  const cards = [
    { href: "/admin/pages", title: "Страницы", value: String(content.length), hint: "блоков текста и фото" },
    { href: "/admin/dogs", title: "Собаки", value: String(dogs.length), hint: "в питомнике" },
    {
      href: "/admin/puppies",
      title: "Щенки",
      value: String(puppies.length),
      hint: `${available} свободно · ${reserved} в резерве`,
    },
    {
      href: "/admin/posts",
      title: "Новости",
      value: String(posts.length),
      hint: drafts ? `${drafts} черновик` : "опубликованы",
    },
  ];

  return (
    <div className="max-w-5xl">
      <p className="eyebrow">Обзор</p>
      <h1 className="mt-3 font-display text-4xl font-light">Здравствуйте, Дарья</h1>
      <p className="mt-3 text-sm text-ink-soft/70">{user?.email}</p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card group transition-colors hover:border-gold">
            <p className="text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60">{card.title}</p>
            <p className="mt-4 font-display text-5xl font-light">{card.value}</p>
            <p className="mt-2 text-xs text-ink-soft/60">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-10">
        <p className="text-sm leading-relaxed text-ink-soft">
          Тексты, карточки собак и щенков сохраняются сразу в базу и появляются на сайте в течение минуты.
          Фото можно загружать прямо из карточки — они попадают в Supabase Storage.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/puppies" className="admin-btn">
            Добавить щенка
          </Link>
          <Link href="/admin/dogs" className="admin-btn admin-btn-quiet">
            Добавить собаку
          </Link>
        </div>
      </div>
    </div>
  );
}
