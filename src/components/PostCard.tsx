import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/sanity/samplePosts";
import { urlForImage } from "@/sanity/image";
import { formatDate } from "@/lib/format";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.coverImage ? urlForImage(post.coverImage) : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass flex flex-col overflow-hidden rounded-3xl transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-700">
        {cover ? (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#5EEAD4,#10B981)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime ? <span>· {post.readingTime} min read</span> : null}
        </div>
        <h3 className="mt-3 font-display text-xl leading-snug text-moon group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-slate-300">{post.excerpt}</p>
        {post.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-600 px-2.5 py-1 text-[11px] text-slate-400"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
