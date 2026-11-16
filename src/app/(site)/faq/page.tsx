import Link from "next/link";
import { getSiteContent, getFaqItems } from "@/lib/content";
import { texts } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function FaqPage() {
  const [content, items] = await Promise.all([getSiteContent(), getFaqItems()]);

  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title={texts(content, "faq.title", "Частые вопросы")}
        intro={texts(content, "faq.intro")}
      />

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-8 lg:py-28">
        {items.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Вопросы пока не добавлены.</p>
        ) : (
          <div className="border-t border-line">
            {items.map((item) => (
              <details key={item.id} className="group border-b border-line py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <h2 className="font-display text-xl font-light leading-snug sm:text-2xl">{item.question}</h2>
                  <span className="mt-1 shrink-0 text-lg leading-none text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.85] whitespace-pre-line text-ink-soft/80">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft/75">
            Не нашли ответ? Напишите нам — ответим лично.
          </p>
          <Link href="/contacts" className="btn">
            Задать вопрос
          </Link>
        </div>
      </section>
    </main>
  );
}
