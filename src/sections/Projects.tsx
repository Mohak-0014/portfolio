"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/content";

/**
 * Horizontal-scroll chapter. The section pins while you scroll vertically,
 * translating a wide project track sideways. Wider/taller cards + a closing
 * panel give the track enough length for the sideways travel to read clearly,
 * and a progress bar makes the horizontal motion obvious.
 */
export default function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    if (isReduced || !root.current || !track.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      if (distance() <= 0) return;

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={root} className="relative overflow-hidden">
      <div className="flex h-screen flex-col justify-center py-16">
        <div className="container-x mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Selected work</p>
            <h2 className="section-title">
              Things I&apos;ve <span className="text-accent">built</span>.
            </h2>
          </div>
          {!reduced && (
            <span className="hidden shrink-0 items-center gap-2 text-sm font-medium text-slate-400 sm:flex">
              Scroll to explore
              <span className="text-accent">→</span>
            </span>
          )}
        </div>

        <div
          ref={track}
          className={
            reduced
              ? "no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-10"
              : "flex w-max items-stretch gap-6 px-6 md:px-10"
          }
        >
          {projects.map((p, i) => (
            <Link
              href={`/work/${p.slug}`}
              key={i}
              className="group glass flex h-[58vh] w-[85vw] shrink-0 snap-center flex-col justify-between rounded-3xl p-9 transition-transform hover:-translate-y-1 sm:w-[68vw] md:w-[54vw] lg:w-[42vw]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">{p.year}</span>
                  <span className="text-sm text-slate-400">
                    0{i + 1} <span className="text-slate-300/50">/ 0{projects.length}</span>
                  </span>
                </div>
                <h3 className="mt-8 font-display text-4xl text-moon md:text-5xl">
                  {p.title}
                </h3>
                {p.tagline && (
                  <p className="mt-3 text-accent">{p.tagline}</p>
                )}
                <p className="mt-5 text-lg text-slate-300">{p.blurb}</p>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink-600 bg-white/40 px-3 py-1 text-xs text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:translate-x-1">
                  View case study →
                </span>
              </div>
            </Link>
          ))}

          {/* closing panel — extends the track and gives a satisfying end */}
          <Link
            href="#contact"
            className="group glass flex h-[58vh] w-[80vw] shrink-0 snap-center flex-col justify-center rounded-3xl p-9 text-center transition-transform hover:-translate-y-1 sm:w-[56vw] md:w-[40vw] lg:w-[30vw]"
          >
            <p className="eyebrow mb-4">What&apos;s next</p>
            <h3 className="font-display text-3xl text-moon md:text-4xl">
              Got something worth building?
            </h3>
            <p className="mt-4 text-slate-300">
              I&apos;m always up for an interesting problem.
            </p>
            <span className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:translate-x-1">
              Let&apos;s talk →
            </span>
          </Link>
        </div>

        {/* horizontal progress bar — makes the sideways motion obvious */}
        {!reduced && (
          <div className="container-x mt-10">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink-600">
              <div
                ref={bar}
                className="h-full w-full origin-left scale-x-0 rounded-full bg-accent"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
