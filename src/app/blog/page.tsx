import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/sanity/queries";
import { profile } from "@/data/content";

export const metadata: Metadata = {
  title: `Blog — ${profile.name}`,
  description: "Writing about building, learning, and everything in between.",
};

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(130%_100%_at_50%_0%,#FFFFFF_0%,#EAF5F1_45%,#E4ECF5_100%)]" />

      <div className="container-x py-28 md:py-36">
        <Link
          href="/"
          className="text-sm text-slate-400 transition-colors hover:text-accent"
        >
          ← Back to the world
        </Link>

        <header className="mt-10 max-w-2xl">
          <p className="eyebrow mb-3">The journal</p>
          <h1 className="section-title">Blog</h1>
          <p className="lead mt-5">
            Field notes from the build — projects, experiments, and the occasional
            existential side quest.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
