import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getDogs, getPuppies, getPublishedPosts, getSiteImages } from "@/lib/content";
import { t } from "@/lib/i18n";
import { NAV, LITTERS, SHOW } from "@/lib/nav";
import { PostCard } from "@/components/PostCard";

export default async function HomePage() {
  const [content, dogs, puppies, posts, images] = await Promise.all([
    getSiteContent(),
    getDogs(),
    getPuppies(),
    getPublishedPosts(6),
    getSiteImages(),
  ]);

  const brand = t(content.get("brand.name")) || "Salomiya Imperial Dar";
  const heroTitle = t(content.get("hero.title")) || brand;
  const heroEyebrow = t(content.get("hero.eyebrow")) || "Питомник";
  const heroSubtitle = t(content.get("hero.subtitle"));
  const breed = t(content.get("about.breed"));
  const aboutText = t(content.get("about.text"));
  const phone = t(content.get("contacts.phone"));
  const heroImage = images["hero.image"] || "/images/hero/pomespitz.jpg";

  return (
    <main>
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-[#d8d6cf]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />
        <div className="relative mx-auto w-full max-w-[88rem] px-6 pb-20 sm:px-8 md:px-10 lg:px-16 lg:pb-28">
          <p className="reveal eyebrow text-sand/70">{heroEyebrow}</p>
          <h1 className="reveal mt-7 max-w-3xl font-display text-[2.75rem] font-light leading-[0.95] text-sand sm:text-6xl lg:text-[5.5rem]">
            {heroTitle}
          </h1>
          {heroSubtitle ? (
            <p className="reveal-late mt-7 max-w-md text-[0.9375rem] leading-relaxed tracking-wide text-sand/75 sm:text-base">
              {heroSubtitle}
            </p>
          ) : null}
          <div className="reveal-late mt-11 flex flex-wrap items-center gap-3">
            <Link
              href="/puppies"
              className="btn btn-dark !bg-sand !text-ink hover:!bg-gold hover:!text-white"
            >
              Доступные щенки
            </Link>
            <Link href="/dogs" className="btn btn-ghost text-sand">
              Наши собаки
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">О питомнике</p>
            <h2 className="mt-7 font-display text-[2.25rem] font-light leading-[1.05] sm:text-5xl">
              {breed || "Померанский шпиц"}
            </h2>
            {images["about.image"] ? (
              <div className="relative mt-10 aspect-[4/5] overflow-hidden bg-sand-deep">
                <Image src={images["about.image"]} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {aboutText ? (
              <p className="text-[1.0625rem] leading-[1.9] text-ink-soft whitespace-pre-line">{aboutText}</p>
            ) : (
              <p className="text-[1.0625rem] leading-[1.9] text-ink-soft/60">
                Текст этого раздела редактируется в CMS и появится здесь.
              </p>
            )}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-10">
              {[
                { value: String(dogs.length || "—"), label: "Собак в питомнике" },
                { value: String(puppies.length || "—"), label: "Щенков сейчас" },
                { value: LITTERS.length ? "2009" : "—", label: "Год основания" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-light sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-sand-deep/40">
        <div className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Собаки питомника</p>
              <h2 className="mt-6 font-display text-[2.25rem] font-light sm:text-5xl">Наши собаки</h2>
            </div>
            <Link
              href="/dogs"
              className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft transition-colors hover:text-gold"
            >
              Все собаки →
            </Link>
          </div>

          {dogs.length === 0 ? (
            <p className="mt-16 max-w-sm text-sm leading-relaxed text-ink-soft/55">
              Карточки собак появятся здесь, как только будут добавлены в CMS.
            </p>
          ) : (
            <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.slice(0, 3).map((dog) => {
                const photo = dog.main_photo || dog.photos[0];
                return (
                  <li key={dog.id}>
                    <Link href={`/dogs/${dog.slug}`} className="group block">
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
                        <p className="font-display text-2xl font-light">{dog.name}</p>
                        <span className="text-[0.5625rem] tracking-[0.22em] uppercase text-ink-soft/50">
                          {dog.sex === "male" ? "Кобель" : dog.sex === "female" ? "Сука" : ""}
                        </span>
                      </div>
                      {dog.title ? (
                        <p className="mt-2 text-xs tracking-wide text-ink-soft/60">{dog.title}</p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <p className="eyebrow">Доступны сейчас</p>
              <h2 className="mt-7 font-display text-[2.25rem] font-light leading-[1.05] sm:text-5xl">
                Щенки
              </h2>
              <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-ink-soft/70">
                Щенки передаются после актировки, с документами РКФ и ветеринарным паспортом. Поможем выбрать
                и ответим на вопросы о породе.
              </p>
              <Link href="/puppies" className="btn btn-dark mt-10">
                Все щенки
              </Link>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {puppies.length === 0 ? (
                <p className="max-w-sm text-sm leading-relaxed text-ink-soft/55">
                  Свободных щенков сейчас нет — следите за разделом «Щенки».
                </p>
              ) : (
                <ul className="grid gap-8 sm:grid-cols-2">
                  {puppies.slice(0, 4).map((puppy) => {
                    const photo = puppy.main_photo || puppy.photos[0];
                    return (
                      <li key={puppy.id}>
                        <Link href={`/puppies/${puppy.slug ?? puppy.id}`} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
                            {photo ? (
                              <Image
                                src={photo}
                                alt={puppy.name ?? "Щенок"}
                                fill
                                sizes="(max-width: 640px) 100vw, 33vw"
                                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                              />
                            ) : null}
                          </div>
                          <div className="mt-5 flex items-baseline justify-between gap-3">
                            <p className="font-display text-xl font-light">{puppy.name ?? "Щенок"}</p>
                            {puppy.status === "reserved" ? (
                              <span className="text-[0.5625rem] tracking-[0.22em] uppercase text-gold">
                                Резерв
                              </span>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {posts.length > 0 ? (
        <section className="border-t border-line bg-sand-deep/40">
          <div className="mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Новости</p>
                <h2 className="mt-6 font-display text-[2.25rem] font-light sm:text-5xl">Новости питомника</h2>
              </div>
              <Link
                href="/news"
                className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft transition-colors hover:text-gold"
              >
                Все новости →
              </Link>
            </div>

            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-ink text-sand">
        <div className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[0.625rem] tracking-[0.3em] uppercase text-gold">Разведение</p>
              <h2 className="mt-7 font-display text-[2.25rem] font-light leading-[1.05] sm:text-5xl">Помёты</h2>
            </div>
            <ul className="lg:col-span-8">
              {LITTERS.map((litter) => (
                <li key={litter.id} className="border-b border-sand/15 first:pt-0 last:border-none">
                  <Link
                    href={litter.href ?? "/puppies"}
                    className="group flex flex-wrap items-baseline justify-between gap-4 py-7"
                  >
                    <span className="font-display text-xl font-light transition-colors group-hover:text-gold sm:text-2xl">
                      {litter.title}
                    </span>
                    <span className="text-[0.625rem] tracking-[0.22em] uppercase text-sand/50">
                      {litter.date} · {litter.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <p className="eyebrow">Достижения</p>
              <h2 className="mt-7 font-display text-[2.25rem] font-light leading-[1.05] sm:text-5xl">Выставки</h2>
            </div>
            <ul className="lg:col-span-7 lg:col-start-6">
              {SHOW.map((item) => (
                <li key={item.text} className="flex gap-8 border-t border-line py-6 first:border-none first:pt-0">
                  <span className="w-12 shrink-0 font-display text-lg font-light text-gold">{item.year}</span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[88rem] px-6 py-24 sm:px-8 md:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Связь</p>
          <h2 className="mt-7 font-display text-[2.5rem] font-light leading-[1.05] sm:text-6xl">
            Расскажем о породе и помётах
          </h2>
          <p className="mx-auto mt-7 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft/75">
            Напишите или позвоните — ответим на вопросы о щенках, вязках и поездках в питомник.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contacts" className="btn btn-dark">
              Написать нам
            </Link>
            {phone ? (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost">
                {phone}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
