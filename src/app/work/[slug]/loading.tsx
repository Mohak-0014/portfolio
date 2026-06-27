/**
 * Instant fallback shown while a case-study route loads (and, in dev, compiles).
 * Gives immediate visual feedback on click so navigation never feels frozen.
 */
export default function Loading() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(130%_100%_at_50%_0%,#FFFFFF_0%,#EAF5F1_45%,#E4ECF5_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(94,234,212,0.25),transparent_70%)]" />

      <article className="container-x py-28 md:py-36">
        <div className="h-4 w-24 rounded bg-slate-300/40" />

        <header className="mt-10 max-w-3xl">
          <div className="h-3 w-40 rounded bg-slate-300/40" />
          <div className="mt-5 h-12 w-3/4 rounded-lg bg-slate-300/50 md:h-16" />
          <div className="mt-5 h-5 w-2/3 rounded bg-slate-300/40" />
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass rounded-3xl p-8">
            <div className="h-3 w-20 rounded bg-slate-300/40" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full rounded bg-slate-300/40" />
              <div className="h-4 w-full rounded bg-slate-300/40" />
              <div className="h-4 w-5/6 rounded bg-slate-300/40" />
            </div>
          </div>
          <aside className="glass h-fit rounded-3xl p-8">
            <div className="h-3 w-16 rounded bg-slate-300/40" />
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 w-16 rounded-full bg-slate-300/40" />
              ))}
            </div>
          </aside>
        </div>
      </article>

      <span className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-slate-400">
        Loading case study…
      </span>
    </main>
  );
}
