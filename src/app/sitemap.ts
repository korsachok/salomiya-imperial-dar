import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getDogs, getPuppies, getPublishedPosts } from "@/lib/content";
import { NAV } from "@/lib/nav";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...NAV.map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const [dogs, puppies, posts] = await Promise.all([getDogs(), getPuppies(), getPublishedPosts(500)]);

  const dogRoutes: MetadataRoute.Sitemap = dogs.map((dog) => ({
    url: `${SITE_URL}/dogs/${encodeURIComponent(dog.slug)}`,
    lastModified: dog.updated_at ? new Date(dog.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const puppyRoutes: MetadataRoute.Sitemap = puppies.map((puppy) => ({
    url: `${SITE_URL}/puppies/${encodeURIComponent(puppy.slug ?? puppy.id)}`,
    lastModified: puppy.updated_at ? new Date(puppy.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${encodeURIComponent(post.slug ?? post.id)}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...dogRoutes, ...puppyRoutes, ...postRoutes];
}
