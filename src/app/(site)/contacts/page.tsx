import { getSiteContent, getSiteImages } from "@/lib/content";
import { texts, imageOf } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function ContactsPage() {
  const [content, images] = await Promise.all([getSiteContent(), getSiteImages()]);

  const phone = texts(content, "contacts.phone");
  const email = texts(content, "contacts.email");
  const social = texts(content, "contacts.social");
  const messenger = texts(content, "contacts.messenger") || (social ? (social.startsWith("http") ? social : `https://${social}`) : "");
  const address = texts(content, "contacts.address");
  const hours = texts(content, "contacts.hours");

  const channels = [
    phone && { label: "Телефон", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    email && { label: "E-mail", value: email, href: `mailto:${email}` },
    messenger && { label: "Мессенджер", value: "Написать в мессенджер", href: messenger },
    address && { label: "Адрес", value: address, href: null },
    hours && { label: "Часы", value: hours, href: null },
  ].filter((item): item is { label: string; value: string; href: string | null } => Boolean(item));

  return (
    <main>
      <PageHero
        eyebrow="Контакты"
        title={texts(content, "contacts.title", "Свяжитесь с нами")}
        intro={texts(content, "contacts.intro")}
        image={imageOf(images, "contacts.image")}
      />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="border-t border-line">
              {channels.map((item) => (
                <li key={item.label} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-6">
                  <span className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft/55">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="font-display text-xl font-light transition-colors hover:text-gold sm:text-2xl"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-display text-xl font-light sm:text-2xl">{item.value}</span>
                  )}
                </li>
              ))}
              {channels.length === 0 ? (
                <li className="py-6 text-sm text-ink-soft/60">Контакты пока не заполнены.</li>
              ) : null}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="card !border-line bg-white/60">
              <p className="eyebrow">Визит в питомник</p>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft/80">
                Приезжайте по предварительной договорённости — покажем родителей, условия содержания и щенков.
                Заранее напишите или позвоните, чтобы мы встретили вас без спешки.
              </p>
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn mt-8">
                  {phone}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
