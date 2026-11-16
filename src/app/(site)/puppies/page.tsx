import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getSiteImages, getPuppies } from "@/lib/content";
import { texts, imageOf } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

const STATUS: Record<string, string> = {
  available: "Свободен",
  reserved: "В резерве",
  sold: "Продан",
};

export default async function PuppiesPage() {
  const [content, images, puppies] = await Promise.all([
    getSiteContent(),
    getSiteImages(),
    getPuppies(),
  ]);

  const steps = texts(content, "puppies.how")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main>
      <PageHero
        eyebrow="Щенки"
        title={texts(content, "puppies.title", "Щенки")}
        intro={texts(content, "puppies.intro")}
        image={imageOf(images, "puppies.image")}
      />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        {puppies.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Свободных щенков сейчас нет — новые появятся в ленте новостей.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {puppies.map((puppy) => {
              const photo = puppy.main_photo || puppy.photos[0];
              return (
                <li key={puppy.id}>
                  <article className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={puppy.name ?? "Щенок"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                      ) : null}
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 text-[0.5rem] tracking-[0.18em] uppercase ${
                          puppy.status === "available"
                            ? "bg-sand text-ink"
                            : puppy.status === "reserved"
                              ? "bg-gold text-white"
                              : "bg-ink text-sand"
                        }`}
                      >
                        {STATUS[puppy.status] ?? puppy.status}
                      </span>
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-2xl font-light">{puppy.name ?? "Щенок"}</h2>
                      <span className="text-[0.5625rem] tracking-[0.22em] uppercase text-ink-soft/50">
                        {puppy.sex === "male" ? "Кобель" : puppy.sex === "female" ? "Сука" : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-xs tracking-wide text-ink-soft/60">
                      {[puppy.litter_name, puppy.color].filter(Boolean).join(" · ")}
                    </p>
                    {puppy.description?.ru ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft/75">
                        {puppy.description.ru}
                      </p>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        {steps.length > 0 ? (
          <div className="mt-24 border-t border-line pt-14">
            <p className="eyebrow">Как забрать щенка</p>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step} className="border-t border-line pt-5">
                  <span className="font-display text-2xl font-light text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft/80">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/contacts" className="btn">
                Забронировать щенка
              </Link>
              <Link href="/faq" className="btn btn-outline">
                Частые вопросы
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
