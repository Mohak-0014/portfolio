"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { hobbies } from "@/data/content";

export default function Hobbies() {
  return (
    <Section id="hobbies">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-3">Off the clock</p>
          <h2 className="section-title">
            The things that keep me <span className="text-accent">human</span>.
          </h2>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hobbies.map((h, i) => (
            <StaggerItem
              key={h.name}
              className="group glass relative overflow-hidden rounded-3xl p-8 transition-transform hover:-translate-y-1"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <span className="font-display text-5xl text-ink-600 group-hover:text-accent/40">
                0{i + 1}
              </span>
              <h3 className="mt-6 font-display text-2xl text-moon">{h.name}</h3>
              <p className="mt-3 text-slate-300">{h.note}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
