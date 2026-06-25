import Link from "next/link";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/sanity/queries";

/** Server component — fetches the latest posts (CMS or sample fallback). */
export default async function BlogPreview() {
  const posts = (await getPosts()).slice(0, 3);

  return (
    <Section id="blog">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">From the journal</p>
              <h2 className="section-title">
                Things I&apos;m <span className="text-accent">writing</span>.
              </h2>
            </div>
            <Link href="/blog" className="btn-ghost">
              All posts →
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
