import Image from "next/image";
import { getSiteContent, getGalleryPhotos } from "@/lib/content";
import { texts } from "@/lib/page-data";
import { PageHero } from "@/components/PageHero";

export const revalidate = 60;

export default async function GalleryPage() {
  const [content, photos] = await Promise.all([getSiteContent(), getGalleryPhotos(60)]);

  return (
    <main>
      <PageHero
        eyebrow="Галерея"
        title={texts(content, "gallery.title", "Галерея")}
        intro={texts(content, "gallery.intro")}
      />

      <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
        {photos.length === 0 ? (
          <p className="text-sm text-ink-soft/60">Фотографии появятся, как только будут загружены в карточки.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <li
                key={photo}
                className={`group relative overflow-hidden bg-sand-deep ${
                  index % 7 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes={index % 7 === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
