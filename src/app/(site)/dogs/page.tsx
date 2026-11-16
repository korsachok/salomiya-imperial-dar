import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getSiteImages, getDogs } from "@/lib/content";
import { texts, imageOf } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function DogsPage() {
  const [content, images, dogs] = await Promise.all([getSiteContent(), getSiteImages(), getDogs()]);

  return (
    <main>
      <PageHero
        eyebrow="Собаки"
        title={texts(content, "dogs.title", "Наши собаки")}
        intro={texts(content, "dogs.intro")}
        image={imageOf(images, "dogs.image")}
      />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        {dogs.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Карточки собак пока не добавлены.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => {
              const photo = dog.main_photo || dog.photos[0];
              return (
                <li key={dog.id}>
                  <article className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={dog.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-2xl font-light">{dog.name}</h2>
                      <span className="text-[0.5625rem] tracking-[0.22em] uppercase text-ink-soft/50">
                        {dog.sex === "male" ? "Кобель" : dog.sex === "female" ? "Сука" : ""}
                      </span>
                    </div>
                    {dog.title ? <p className="mt-2 text-xs tracking-wide text-ink-soft/60">{dog.title}</p> : null}
                    <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-xs text-ink-soft/65">
                      {dog.color ? (
                        <div className="flex justify-between gap-3">
                          <dt>Окрас</dt>
                          <dd>{dog.color}</dd>
                        </div>
                      ) : null}
                      {dog.birth_date ? (
                        <div className="flex justify-between gap-3">
                          <dt>Дата рождения</dt>
                          <dd>{new Date(dog.birth_date).toLocaleDateString("ru-RU")}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-soft/75">
            Хотите узнать больше о конкретной собаке или спланировать вязку — напишите нам.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/puppies" className="btn btn-outline">
              Щенки
            </Link>
            <Link href="/contacts" className="btn">
              Связаться
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
