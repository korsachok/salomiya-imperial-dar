import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPuppies } from "@/lib/content";
import { decodeSlug } from "@/lib/page-data";
import { t } from "@/lib/i18n";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const revalidate = 60;

const STATUS: Record<string, { label: string; className: string }> = {
  available: { label: "Свободен", className: "bg-sand text-ink" },
  reserved: { label: "В резерве", className: "bg-gold text-white" },
  sold: { label: "Продан", className: "bg-ink text-sand" },
};

async function findPuppy(keyRaw: string) {
  const key = decodeSlug(keyRaw);
  const puppies = await getPuppies();
  return puppies.find((puppy) => (puppy.slug ?? puppy.id) === key || puppy.id === key) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const puppy = await findPuppy(slug);
  if (!puppy) return { title: "Щенок не найден", robots: { index: false, follow: true } };

  const cover = puppy.main_photo || puppy.photos[0];
  const name = puppy.name ?? "Щенок";
  return {
    title: name,
    description: [puppy.litter_name, puppy.color].filter(Boolean).join(" · ") || `Щенок питомника — ${name}`,
    alternates: { canonical: `/puppies/${encodeURIComponent(puppy.slug ?? puppy.id)}` },
    openGraph: {
      type: "article",
      title: name,
      url: `/puppies/${encodeURIComponent(puppy.slug ?? puppy.id)}`,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

const dateLabel = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : null;

export default async function PuppyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const puppy = await findPuppy(slug);
  if (!puppy) notFound();

  const name = puppy.name ?? "Щенок";
  const photos = puppy.photos.length > 0 ? puppy.photos : puppy.main_photo ? [puppy.main_photo] : [];
  const [main, ...rest] = photos;
  const description = t(puppy.description);
  const status = STATUS[puppy.status];

  const facts = [
    puppy.sex ? { label: "Пол", value: puppy.sex === "male" ? "Кобель" : "Сука" } : null,
    puppy.birth_date ? { label: "Дата рождения", value: dateLabel(puppy.birth_date) } : null,
    puppy.litter_name ? { label: "Помёт", value: puppy.litter_name } : null,
    puppy.color ? { label: "Окрас", value: puppy.color } : null,
    puppy.price != null
      ? { label: "Стоимость", value: `${new Intl.NumberFormat("ru-RU").format(puppy.price)} ₽` }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item?.value));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: "/" },
          { name: "Щенки", url: "/puppies" },
          { name, url: `/puppies/${encodeURIComponent(puppy.slug ?? puppy.id)}` },
        ]}
      />
      <Link
        href="/puppies"
        className="text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft/60 transition-colors hover:text-gold"
      >
        ← Все щенки
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
            {main ? (
              <Image
                src={main}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            ) : null}
            {status ? (
              <span
                className={`absolute top-4 left-4 px-2.5 py-1 text-[0.5rem] tracking-[0.18em] uppercase ${status.className}`}
              >
                {status.label}
              </span>
            ) : null}
          </div>

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
          <p className="eyebrow">Щенок питомника</p>
          <h1 className="mt-5 font-display text-[2.5rem] font-light leading-[1.03] sm:text-5xl">{name}</h1>
          {[puppy.litter_name, puppy.color].filter(Boolean).length > 0 ? (
            <p className="mt-4 text-sm tracking-wide text-ink-soft/70">
              {[puppy.litter_name, puppy.color].filter(Boolean).join(" · ")}
            </p>
          ) : null}

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
            <Link href="/contacts" className="btn">
              Забронировать
            </Link>
            <Link href="/faq" className="btn btn-outline">
              Вопросы и ответы
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
