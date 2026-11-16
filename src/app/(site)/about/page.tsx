import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getSiteImages, getDogs } from "@/lib/content";
import { texts, imageOf } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function AboutPage() {
  const [content, images, dogs] = await Promise.all([getSiteContent(), getSiteImages(), getDogs()]);

  const title = texts(content, "about.title", "О питомнике");
  const intro = texts(content, "about.intro");
  const body = texts(content, "about.text");
  const values = texts(content, "about.values")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [head, ...rest] = line.split("—");
      return { head: head.trim(), text: rest.join("—").trim() };
    });

  return (
    <main>
      <PageHero eyebrow="О питомнике" title={title} intro={intro} image={imageOf(images, "about.image")} />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">История</p>
            <div className="mt-8 relative aspect-[4/5] overflow-hidden bg-sand-deep">
              <Image
                src={imageOf(images, "about.image2", "/images/dogs/dog-imperia.jpg")!}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {body ? (
              <p className="text-[1.0625rem] leading-[1.9] whitespace-pre-line text-ink-soft">{body}</p>
            ) : null}

            {values.length > 0 ? (
              <ul className="mt-12 space-y-8 border-t border-line pt-10">
                {values.map((item) => (
                  <li key={item.head}>
                    <p className="font-display text-2xl font-light">{item.head}</p>
                    {item.text ? (
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft/75">{item.text}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-10">
              {[
                { value: String(dogs.length || "—"), label: "Собак в питомнике" },
                { value: "РКФ", label: "Регистрация" },
                { value: "10+", label: "Лет с породой" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-light sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft/55">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-wrap gap-3">
              <Link href="/dogs" className="btn btn-outline">
                Смотреть собак
              </Link>
              <Link href="/contacts" className="btn">
                Написать нам
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
