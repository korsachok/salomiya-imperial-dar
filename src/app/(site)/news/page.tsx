import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";
import { PostCard } from "@/components/PostCard";

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await getPublishedPosts(40);

  return (
    <main className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 md:px-10 lg:px-16 lg:py-28">
      <p className="eyebrow">Новости</p>
      <h1 className="mt-6 font-display text-[2.5rem] font-light leading-[1.05] sm:text-6xl">
        Новости питомника
      </h1>
      <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft/75">
        Пометки о жизни питомника: помёты, выставки, будни собак.
      </p>

      {posts.length === 0 ? (
        <p className="mt-16 text-sm text-ink-soft/60">Пока нет новостей.</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Link
        href="/"
        className="mt-20 inline-block text-[0.625rem] tracking-[0.2em] uppercase text-ink-soft transition-colors hover:text-gold"
      >
        ← На главную
      </Link>
    </main>
  );
}
