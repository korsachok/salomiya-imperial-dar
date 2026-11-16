import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/content";
import { savePost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getAllPosts()).find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/posts"
        className="text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60 hover:text-gold"
      >
        ← Новости
      </Link>
      <h1 className="mt-4 font-display text-4xl font-light">{post.title}</h1>

      <div className="card mt-8">
        <PostForm
          action={savePost}
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            cover_photo: post.cover_photo,
            photos: post.photos,
            video_url: post.video_url,
            published_at: post.published_at,
            is_published: post.is_published,
            sort_order: post.sort_order,
          }}
        />
      </div>
    </div>
  );
}
