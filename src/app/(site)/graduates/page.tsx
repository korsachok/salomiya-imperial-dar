import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getGraduates } from "@/lib/content";
import { texts } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function GraduatesPage() {
  const [content, graduates] = await Promise.all([getSiteContent(), getGraduates()]);

  return (
    <main>
      <PageHero
        eyebrow="Выпускники"
        title={texts(content, "graduates.title", "Выпускники")}
        intro={texts(content, "graduates.intro")}
      />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        {graduates.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Список выпускников пока пуст.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {graduates.map((graduate) => (
              <li key={graduate.id}>
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
                    {graduate.photo ? (
                      <Image
                        src={graduate.photo}
                        alt={graduate.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-light">{graduate.name}</h2>
                  <p className="mt-2 text-[0.5625rem] tracking-[0.22em] uppercase text-ink-soft/50">
                    {[graduate.owner_city, graduate.birth_year].filter(Boolean).join(" · ")}
                  </p>
                  {graduate.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft/75">{graduate.description}</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-soft/75">
            Возможно, здесь появится и ваш шпиц — напишите нам, и мы расскажем о щенках из ближайших помётов.
          </p>
          <Link href="/puppies" className="btn">
            Смотреть щенков
          </Link>
        </div>
      </section>
    </main>
  );
}
