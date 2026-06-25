import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PortableBody from "@/components/PortableBody";
import { getPost, getPostSlugs } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cover = post.coverImage ? urlForImage(post.coverImage) : null;

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(130%_100%_at_50%_0%,#FFFFFF_0%,#EAF5F1_45%,#E4ECF5_100%)]" />

      <article className="container-x py-28 md:py-36">
        <Link
          href="/blog"
          className="text-sm text-slate-400 transition-colors hover:text-accent"
        >
          ← All posts
        </Link>

        <header className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime ? <span>· {post.readingTime} min read</span> : null}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight text-moon md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="lead mt-5">{post.excerpt}</p>}
        </header>

        {cover && (
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl">
            <Image
              src={cover}
              alt={post.title}
              width={1400}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-3xl text-lg">
          {post.body ? (
            <PortableBody value={post.body} />
          ) : (
            <p className="text-slate-300">This post has no content yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}
