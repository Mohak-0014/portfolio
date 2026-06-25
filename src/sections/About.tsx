"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { about, world } from "@/data/content";

export default function About() {
  return (
    <Section id="about">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-4">The story so far</p>
          <h2 className="section-title max-w-3xl">
            Every world starts with a&nbsp;
            <span className="text-accent">first step</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <Reveal delay={0.05}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Origin</p>
            <p className="lead mt-4">{about.origin}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              What I&apos;m chasing
            </p>
            <p className="lead mt-4">{about.chasing}</p>
          </Reveal>
        </div>

        {/* story beats — pull quotes that punctuate the scroll */}
        <div className="mt-24 space-y-16">
          {about.beats.map((beat, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p
                className={`font-display text-2xl leading-snug text-moon md:text-4xl ${
                  i % 2 === 1 ? "md:ml-auto md:text-right" : ""
                } max-w-2xl`}
              >
                <span className="text-accent">“</span>
                {beat}
                <span className="text-accent">”</span>
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-24 text-sm text-slate-400">
            In short — <span className="text-slate-200">{world.mood}</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
