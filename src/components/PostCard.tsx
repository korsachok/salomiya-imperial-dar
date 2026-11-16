import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/db";

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

function PostMedia({ post, sizes }: { post: Post; sizes: string }) {
  if (post.video_url) {
    return (
      <video
        src={post.video_url}
        controls
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }
  const src = post.cover_photo || post.photos[0];
  if (!src) return <div className="h-full w-full bg-sand-deep" />;
  return <Image src={src} alt={post.title} fill sizes={sizes} className="object-cover" />;
}

export function PostCard({ post }: { post: Post }) {
  const more = post.photos.length > 1;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
        <PostMedia post={post} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        {more ? (
          <span className="absolute top-3 right-3 border border-white/40 bg-ink/50 px-2 py-1 text-[0.5rem] tracking-[0.16em] uppercase text-white">
            +{post.photos.length - 1} фото
          </span>
        ) : null}
      </div>
      <div className="mt-5">
        <p className="text-[0.5625rem] tracking-[0.22em] uppercase text-gold">{dateLabel(post.published_at)}</p>
        <h3 className="mt-3 font-display text-2xl font-light leading-snug">{post.title}</h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft/75">{post.excerpt}</p>
        ) : null}
        {post.slug ? (
          <Link
            href={`/news/${post.slug}`}
            className="mt-4 inline-block text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft transition-colors hover:text-gold"
          >
            Читать →
          </Link>
        ) : null}
      </div>
    </article>
  );
}
