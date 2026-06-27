"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
  profile,
  world,
  about,
  projects,
  skills,
  timeline,
  hobbies,
  sidequests,
  contact,
} from "@/data/content";

/* ── shared light tokens ── */
export const card =
  "rounded-2xl border border-white/60 bg-white/55 shadow-[0_18px_50px_-30px_rgba(20,30,50,0.45)] backdrop-blur-md";
const muted = "text-slate-500";

export function Eyebrow({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em]"
      style={{ color: accent, background: `${accent}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      {children}
    </span>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.06] text-slate-900 sm:text-[44px]">
      {children}
    </h1>
  );
}

/* ── per-section bodies (light theme) ── */

function Hello({ accent }: { accent: string }) {
  const initials = profile.name.split(" ").map((n) => n[0]).join("");
  const tech = skills.flatMap((g) => g.items).slice(0, 9);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <Eyebrow accent={accent}>
          {world.role} · {world.focus}
        </Eyebrow>
        <Title>
          {profile.name.split(" ")[0]}{" "}
          <span style={{ color: accent }}>{profile.name.split(" ").slice(1).join(" ")}</span>
        </Title>
        <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-slate-600">{profile.intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="rounded-full border border-black/[0.08] bg-slate-50 px-3 py-1.5 text-[14px] text-slate-600">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className={`${card} overflow-hidden p-7`}>
        <div className="flex items-center gap-4">
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl font-display text-[26px] font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
          >
            {initials}
          </div>
          <div>
            <p className="font-display text-[20px] font-semibold text-slate-900">{profile.name}</p>
            <p className={`text-[14px] ${muted}`}>{profile.location}</p>
          </div>
        </div>
        <span
          className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold"
          style={{ color: accent, background: `${accent}16` }}
        >
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: accent }} />
          {profile.status}
        </span>
        <div className="mt-6 space-y-4 border-t border-black/[0.06] pt-5">
          {timeline.map((t) => (
            <div key={t.title} className="flex gap-3">
              <span className="mt-0.5 font-mono text-[13px] font-semibold" style={{ color: accent }}>
                {t.when}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-slate-800">{t.title}</p>
                <p className={`text-[13px] ${muted}`}>{t.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Backstory({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>The story so far</Eyebrow>
      <Title>
        Every journey starts with a <span style={{ color: accent }}>first step</span>.
      </Title>
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className={`${card} p-7`}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">Origin</p>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{about.origin}</p>
          </div>
          <div className={`${card} p-7`}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">What I&apos;m chasing</p>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{about.chasing}</p>
          </div>
        </div>
        <div className={`${card} flex flex-col p-7`}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">The throughline</p>
          <div className="mt-5 flex-1 space-y-5">
            {about.beats.map((b, i) => (
              <div key={i} className="flex gap-4">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[16px] font-bold"
                  style={{ color: accent, background: `${accent}16` }}
                >
                  {i + 1}
                </span>
                <p className="font-display text-[18px] leading-snug text-slate-800">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl p-5" style={{ background: `${accent}12` }}>
            <p className="text-[15px] text-slate-700">
              In short — <span className="font-semibold" style={{ color: accent }}>{world.mood}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Work({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>Selected work</Eyebrow>
      <Title>
        Things I&apos;ve <span style={{ color: accent }}>built</span>.
      </Title>
      <div className="mt-7 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`${card} group relative flex flex-col overflow-hidden p-7 transition-transform hover:-translate-y-1`}
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            <div className="flex items-center justify-between">
              <span className="font-display text-[30px] font-bold text-slate-200">0{i + 1}</span>
              <span className="text-[13px] font-semibold" style={{ color: accent }}>{p.year}</span>
            </div>
            <h3 className="mt-2 font-display text-[24px] leading-none text-slate-900">{p.title}</h3>
            {p.tagline && <p className="mt-2 text-[14px]" style={{ color: accent }}>{p.tagline}</p>}
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{p.blurb}</p>
            <div className="mt-auto pt-5">
              <div className="flex flex-wrap gap-1.5">
                {p.tech.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full border border-black/[0.08] bg-slate-50 px-2.5 py-1 text-[12px] text-slate-500">
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold transition-transform group-hover:translate-x-1" style={{ color: accent }}>
                View case study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Toolkit({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>Toolkit &amp; timeline</Eyebrow>
      <Title>
        What I&apos;m <span style={{ color: accent }}>carrying</span>.
      </Title>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.group} className={`${card} p-6`}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>{g.group}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <span key={it} className="rounded-lg border border-black/[0.08] bg-slate-50 px-2.5 py-1 text-[14px] text-slate-600">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={`${card} p-7`}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">Milestones</p>
          <div className="relative mt-5 pl-7">
            <div className="absolute left-[6px] top-1 h-[88%] w-0.5" style={{ background: `linear-gradient(${accent}, ${accent}22)` }} />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-7 top-1 h-3.5 w-3.5 rounded-full border-[3px] bg-white" style={{ borderColor: accent }} />
                  <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">{t.when}</p>
                  <h3 className="mt-0.5 font-display text-[19px] text-slate-900">{t.title}</h3>
                  <p className="text-[14px]" style={{ color: accent }}>{t.org}</p>
                  <p className="mt-1 text-[13px] leading-snug text-slate-600">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OffTheClock({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>In-flight entertainment</Eyebrow>
      <Title>
        The things that keep me <span style={{ color: accent }}>human</span>.
      </Title>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {hobbies.map((h, i) => (
          <div key={h.name} className={`${card} relative overflow-hidden p-7`}>
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full blur-2xl" style={{ background: `${accent}1f` }} />
            <span className="font-display text-[40px] font-bold text-slate-100">0{i + 1}</span>
            <h3 className="mt-2 font-display text-[23px] text-slate-900">{h.name}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{h.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidequests({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>While you wait</Eyebrow>
      <Title>
        Side<span style={{ color: accent }}>quests</span>.
      </Title>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sidequests.map((q, i) => (
          <div key={i} className={`${card} flex flex-col p-5`}>
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl text-[20px]" style={{ background: `${accent}14` }}>{q.icon}</span>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent, background: `${accent}14` }}>{q.status}</span>
            </div>
            <h3 className="mt-3 font-display text-[17px] leading-tight text-slate-900">{q.title}</h3>
            <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{q.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOPICS = [
  { icon: "🤖", cat: "AI", title: "Agents that ship", blurb: "Multi-agent systems that survive contact with reality." },
  { icon: "🧱", cat: "Systems", title: "Designing for scale", blurb: "Wiring FastAPI, Redis & queues for production loads." },
  { icon: "🧪", cat: "Experiments", title: "Build logs", blurb: "Half-baked ideas — and what happened when I tried them." },
  { icon: "📚", cat: "Learning", title: "Rabbit holes", blurb: "Whatever I fell into this week and couldn't stop reading." },
];

function Writing({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>Something to read</Eyebrow>
      <Title>
        Thinking out <span style={{ color: accent }}>loud</span>.
      </Title>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className={`${card} relative flex flex-col justify-center overflow-hidden p-8`}>
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full blur-3xl" style={{ background: `${accent}26` }} />
          <p className="relative font-display text-[26px] font-semibold leading-tight text-slate-900">
            Build logs, half-formed ideas &amp; lessons learned the hard way.
          </p>
          <p className="relative mt-4 text-[15px] leading-relaxed text-slate-600">
            Written down so I — and maybe you — can find them again.
          </p>
          <Link
            href="/blog"
            className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold text-white"
            style={{ background: accent }}
          >
            Read the blog →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <div key={t.title} className={`${card} flex flex-col p-6`}>
              <div className="flex items-center justify-between">
                <span className="text-[26px]">{t.icon}</span>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent, background: `${accent}14` }}>{t.cat}</span>
              </div>
              <h3 className="mt-3 font-display text-[19px] text-slate-900">{t.title}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{t.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact({ accent }: { accent: string }) {
  return (
    <div>
      <Eyebrow accent={accent}>Get in touch</Eyebrow>
      <Title>
        Let&apos;s build something <span style={{ color: accent }}>worth talking about</span>.
      </Title>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="max-w-[520px] text-[17px] leading-relaxed text-slate-600">
            Whether it&apos;s a role, a collaboration, or an idea worth chasing — my inbox is always open.
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-6 inline-block w-fit font-display text-[28px] font-semibold text-slate-900 underline decoration-[3px] underline-offset-[8px] transition-opacity hover:opacity-70 sm:text-[34px]"
            style={{ textDecorationColor: accent }}
          >
            {contact.email}
          </a>
          <div className="mt-7 flex flex-wrap gap-3">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/[0.1] bg-white px-6 py-3 text-[15px] font-semibold text-slate-800 transition-colors hover:border-black/25"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className={`${card} p-7`}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">Availability</p>
          <div className="mt-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full" style={{ background: accent }} />
              <p className="text-[15px] text-slate-800">{profile.status}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[15px]">📍</span>
              <p className="text-[15px] text-slate-600">{profile.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[15px]">⚡</span>
              <p className="text-[15px] text-slate-600">Usually replies within a day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Indexed by content section (Hero, About, Projects, Skills, Hobbies, Sidequests, Blog, Contact). */
export const BODIES: React.FC<{ accent: string }>[] = [
  Hello,
  Backstory,
  Work,
  Toolkit,
  OffTheClock,
  Sidequests,
  Writing,
  Contact,
];
