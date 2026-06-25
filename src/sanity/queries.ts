import { groq } from "next-sanity";
import { sanityClient } from "./client";
import { samplePosts, type Post } from "./samplePosts";

const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  "tags": tags,
  "coverImage": coverImage,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  "tags": tags,
  "coverImage": coverImage,
  body,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

/** All posts (CMS if configured, otherwise local samples). */
export async function getPosts(): Promise<Post[]> {
  if (!sanityClient) return samplePosts;
  try {
    const posts = await sanityClient.fetch<Post[]>(
      postsQuery,
      {},
      { next: { revalidate: 60 } }
    );
    return posts?.length ? posts : samplePosts;
  } catch {
    return samplePosts;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  if (!sanityClient) return samplePosts.map((p) => p.slug);
  try {
    const posts = await sanityClient.fetch<{ slug: string }[]>(
      groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
    );
    return posts.map((p) => p.slug);
  } catch {
    return samplePosts.map((p) => p.slug);
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!sanityClient) return samplePosts.find((p) => p.slug === slug) ?? null;
  try {
    const post = await sanityClient.fetch<Post>(
      postBySlugQuery,
      { slug },
      { next: { revalidate: 60 } }
    );
    return post ?? samplePosts.find((p) => p.slug === slug) ?? null;
  } catch {
    return samplePosts.find((p) => p.slug === slug) ?? null;
  }
}
