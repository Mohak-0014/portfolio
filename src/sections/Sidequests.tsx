"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { sidequests } from "@/data/content";

/** The playful chapter — game-like "sidequests" to keep the tone light. */
export default function Sidequests() {
  return (
    <Section id="sidequests">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-3">Press ▶ to play</p>
          <h2 className="section-title">
            Side<span className="text-accent">quests</span>.
          </h2>
          <p className="lead mt-5 max-w-2xl">
            The optional missions — fun experiments, detours and things I&apos;m doing
            just because they make life more interesting.
          </p>
        </Reveal>

        <Stagger className="mt-14 space-y-4">
          {sidequests.map((q, i) => (
            <StaggerItem
              key={i}
              className="group glass flex flex-col gap-3 rounded-2xl p-6 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-ink-600 text-lg">
                  {q.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg text-moon">{q.title}</h3>
                  <p className="text-sm text-slate-400">{q.note}</p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {q.status}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
