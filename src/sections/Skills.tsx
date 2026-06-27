"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { skills, timeline } from "@/data/content";

export default function Skills() {
  return (
    <Section id="skills">
      <div className="container-x">
        <Reveal variant="right">
          <p className="eyebrow mb-3">Toolkit & timeline</p>
          <h2 className="section-title">
            What I work <span className="text-accent">with</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          {/* skills */}
          <Stagger className="grid grid-cols-2 gap-6">
            {skills.map((g) => (
              <StaggerItem key={g.group} className="glass rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  {g.group}
                </p>
                <ul className="mt-4 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="text-sm text-slate-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>

          {/* timeline */}
          <div className="relative">
            <div className="absolute left-2 top-2 h-full w-px bg-ink-600" />
            <Stagger className="space-y-10">
              {timeline.map((t, i) => (
                <StaggerItem key={i} className="relative pl-10">
                  <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-ink-800 shadow-glow" />
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t.when}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-moon">{t.title}</h3>
                  <p className="text-sm text-accent">{t.org}</p>
                  <p className="mt-2 text-sm text-slate-300">{t.detail}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </Section>
  );
}
