import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/content";
import { deletePost, savePost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/PostForm";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Новости</p>
      <h1 className="mt-3 font-display text-4xl font-light">Лента новостей</h1>
      <p className="mt-3 text-sm text-ink-soft/70">
        Посты показываются на сайте в разделе «Новости» в порядке даты публикации.
      </p>

      <ul className="mt-10 space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="card flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-sand-deep">
              {post.cover_photo || post.photos[0] ? (
                <Image
                  src={post.cover_photo || post.photos[0]}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-light">{post.title}</p>
              <p className="text-xs text-ink-soft/60">
                {new Date(post.published_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {post.video_url ? " · видео" : ""}
                {post.is_published ? "" : " · черновик"}
              </p>
            </div>
            <Link href={`/admin/posts/${post.id}`} className="admin-btn admin-btn-quiet">
              Изменить
            </Link>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="admin-btn admin-btn-danger">
                Удалить
              </button>
            </form>
          </li>
        ))}
        {posts.length === 0 ? (
          <li className="text-sm text-ink-soft/60">Пока нет постов.</li>
        ) : null}
      </ul>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-light">Новый пост</h2>
        <div className="card mt-5">
          <PostForm action={savePost} />
        </div>
      </section>
    </div>
  );
}
