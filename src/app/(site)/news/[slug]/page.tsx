import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post ? `${post.title} — Salomiya Imperial Dar` : "Новость не найдена" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = new Date(post.published_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-8 lg:py-28">
      <Link
        href="/news"
        className="text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft/60 transition-colors hover:text-gold"
      >
        ← Новости
      </Link>

      <p className="eyebrow mt-10">{date}</p>
      <h1 className="mt-5 font-display text-[2.25rem] font-light leading-[1.08] sm:text-5xl">{post.title}</h1>
      {post.excerpt ? (
        <p className="mt-6 text-lg leading-relaxed text-ink-soft/80">{post.excerpt}</p>
      ) : null}

      {post.cover_photo || post.photos[0] ? (
        <div className="relative mt-10 aspect-[4/3] overflow-hidden bg-sand-deep">
          <Image
            src={post.cover_photo || post.photos[0]}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      ) : null}

      {post.body ? (
        <div className="mt-10 text-[1.0625rem] leading-[1.9] whitespace-pre-line text-ink-soft">{post.body}</div>
      ) : null}

      {post.video_url ? (
        <video
          src={post.video_url}
          controls
          playsInline
          className="mt-10 w-full border border-line bg-black"
        />
      ) : null}

      {post.photos.length > 1 ? (
        <div className="mt-10 grid grid-cols-2 gap-4">
          {post.photos.slice(1).map((photo) => (
            <div key={photo} className="relative aspect-square overflow-hidden bg-sand-deep">
              <Image src={photo} alt="" fill sizes="(max-width: 768px) 50vw, 384px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
