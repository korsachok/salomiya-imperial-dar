import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { texts } from "@/lib/page-data";

export default async function NotFound() {
  const text = texts(await getSiteContent(), "notfound.text");

  return (
    <main className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-start justify-center px-6 py-24 sm:px-8 lg:px-16">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 font-display text-4xl font-light sm:text-5xl">Страница не найдена</h1>
      {text ? <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft/75">{text}</p> : null}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn">
          На главную
        </Link>
        <Link href="/news" className="btn btn-outline">
          Новости
        </Link>
      </div>
    </main>
  );
}
