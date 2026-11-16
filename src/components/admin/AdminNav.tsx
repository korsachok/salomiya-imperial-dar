"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/content", label: "Главная и тексты" },
  { href: "/admin/dogs", label: "Собаки" },
  { href: "/admin/puppies", label: "Щенки" },
  { href: "/admin/posts", label: "Новости" },
];

export function AdminNav({ brand }: { brand: string }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <aside className="admin-side">
      <div className="flex h-full flex-col">
        <Link href="/admin" className="font-display text-lg tracking-[0.2em] uppercase text-sand">
          {brand}
        </Link>
        <p className="mt-2 text-[0.5625rem] tracking-[0.28em] uppercase text-sand/40">Панель управления</p>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="admin-link"
              data-active={pathname === link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 space-y-4 border-t border-sand/15 pt-6">
          <Link
            href="/"
            target="_blank"
            className="admin-link !p-0 text-[0.6875rem] tracking-[0.14em] uppercase"
          >
            Открыть сайт ↗
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-[0.6875rem] tracking-[0.14em] uppercase text-sand/50 transition-colors hover:text-sand"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
