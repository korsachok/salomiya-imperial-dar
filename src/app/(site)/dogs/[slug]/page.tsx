import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDogs } from "@/lib/content";
import { decodeSlug } from "@/lib/page-data";
import { t } from "@/lib/i18n";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const revalidate = 60;

async function findDog(slug: string) {
  const dogs = await getDogs();
  const key = decodeSlug(slug);
  return dogs.find((dog) => dog.slug === key) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dog = await findDog(slug);
  if (!dog) return { title: "Собака не найдена", robots: { index: false, follow: true } };

  const cover = dog.main_photo || dog.photos[0];
  return {
    title: dog.name,
    description: [dog.title, dog.color].filter(Boolean).join(" · ") || undefined,
    alternates: { canonical: `/dogs/${encodeURIComponent(dog.slug)}` },
    openGraph: {
      type: "profile",
      title: dog.name,
      url: `/dogs/${encodeURIComponent(dog.slug)}`,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

const dateLabel = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : null;

export default async function DogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dog = await findDog(slug);
  if (!dog) notFound();

  const photos = dog.photos.length > 0 ? dog.photos : dog.main_photo ? [dog.main_photo] : [];
  const [main, ...rest] = photos;
  const description = t(dog.description);

  const facts = [
    dog.sex ? { label: "Пол", value: dog.sex === "male" ? "Кобель" : "Сука" } : null,
    dog.birth_date ? { label: "Дата рождения", value: dateLabel(dog.birth_date) } : null,
    dog.color ? { label: "Окрас", value: dog.color } : null,
    dog.title ? { label: "Титулы", value: dog.title } : null,
    dog.father_name ? { label: "Отец", value: dog.father_name } : null,
    dog.mother_name ? { label: "Мать", value: dog.mother_name } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item?.value));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: "/" },
          { name: "Собаки", url: "/dogs" },
          { name: dog.name, url: `/dogs/${encodeURIComponent(dog.slug)}` },
        ]}
      />
      <Link
        href="/dogs"
        className="text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft/60 transition-colors hover:text-gold"
      >
        ← Все собаки
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          {main ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
              <Image
                src={main}
                alt={dog.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] bg-sand-deep" />
          )}

          {rest.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {rest.map((photo) => (
                <div key={photo} className="relative aspect-square overflow-hidden bg-sand-deep">
                  <Image src={photo} alt="" fill sizes="(max-width: 1024px) 50vw, 29vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow">Собака питомника</p>
          <h1 className="mt-5 font-display text-[2.5rem] font-light leading-[1.03] sm:text-5xl">{dog.name}</h1>
          {dog.title ? <p className="mt-4 text-sm tracking-wide text-ink-soft/70">{dog.title}</p> : null}

          {description ? (
            <p className="mt-8 text-[1rem] leading-relaxed whitespace-pre-line text-ink-soft/85">{description}</p>
          ) : null}

          {facts.length > 0 ? (
            <dl className="mt-10 border-t border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-4">
                  <dt className="text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft/55">{fact.label}</dt>
                  <dd className="text-sm text-ink-soft/85">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/puppies" className="btn btn-outline">
              Щенки питомника
            </Link>
            <Link href="/contacts" className="btn">
              Связаться
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
