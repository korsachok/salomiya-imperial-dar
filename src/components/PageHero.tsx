import Image from "next/image";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string | null;
};

export function PageHero({ eyebrow, title, intro, image }: Props) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[88rem] px-6 pt-16 pb-14 sm:px-8 md:px-10 lg:px-16 lg:pt-24 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="mt-6 max-w-xl font-display text-[2.5rem] font-light leading-[1.03] sm:text-6xl">
              {title}
            </h1>
            {intro ? (
              <p className="mt-6 max-w-lg text-[1rem] leading-relaxed whitespace-pre-line text-ink-soft/80">
                {intro}
              </p>
            ) : null}
          </div>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep lg:col-span-5 lg:col-start-8 lg:aspect-[16/11]">
              <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
