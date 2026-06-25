import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, profile } from "@/data/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${profile.name}`,
    description: project.tagline || project.blurb,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(130%_100%_at_50%_0%,#FFFFFF_0%,#EAF5F1_45%,#E4ECF5_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(94,234,212,0.25),transparent_70%)]" />

      <article className="container-x py-28 md:py-36">
        <Link
          href="/#projects"
          className="text-sm text-slate-400 transition-colors hover:text-accent"
        >
          ← Back to work
        </Link>

        <header className="mt-10 max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Case study</span>
          </div>
          <h1 className="mt-4 font-display text-5xl leading-tight text-moon md:text-6xl">
            {project.title}
          </h1>
          {project.tagline && <p className="lead mt-5">{project.tagline}</p>}
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Overview</p>
            <p className="mt-4 text-lg leading-relaxed text-slate-200">
              {project.overview || project.blurb}
            </p>

            {project.highlights?.length ? (
              <>
                <p className="mt-10 text-xs uppercase tracking-[0.2em] text-accent">
                  Highlights
                </p>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-slate-200">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <aside className="glass h-fit rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ink-600 bg-white/60 px-3 py-1 text-xs text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.links?.length ? (
              <div className="mt-8 flex flex-col gap-3">
                {project.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-ghost justify-center">
                    {l.label} →
                  </a>
                ))}
              </div>
            ) : null}
          </aside>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-ink-600 pt-8">
          <span className="text-sm text-slate-400">Next project</span>
          <Link
            href={`/work/${next.slug}`}
            className="font-display text-xl text-moon transition-colors hover:text-accent"
          >
            {next.title} →
          </Link>
        </div>
      </article>
    </main>
  );
}
