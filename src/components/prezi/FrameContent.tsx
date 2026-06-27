"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
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
import { FRAMES } from "./frames";

/* The fixed design canvas — composed at this size (≈16:9) and scaled to fill
   the viewport, so the dark cinematic layouts stay dense and never go blank. */
const DW = 1520;
const DH = 860;

/** Per-section neon accent — matches each section's planet in the system. */
const ACCENTS = [
  "#5EEAD4", "#38BDF8", "#A78BFA", "#34D399",
  "#FBBF24", "#FB7185", "#22D3EE", "#818CF8",
];

const cardCls =
  "rounded-3xl border border-white/10 bg-[#070b16]/70 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md";
const labelCls = "text-[15px] font-semibold uppercase tracking-[0.26em] text-white/45";

/* deterministic starfield (avoids hydration mismatch) */
const STARS: [number, number][] = [
  [12, 18], [22, 8], [35, 22], [48, 12], [60, 26], [72, 9], [83, 20], [91, 14],
  [7, 32], [28, 36], [55, 6], [68, 34], [78, 28], [88, 33], [16, 10], [42, 30],
  [64, 16], [95, 25], [3, 14], [38, 5], [52, 33], [75, 4],
];

function useFitScale() {
  const [s, setS] = useState(0.8);
  useEffect(() => {
    const calc = () =>
      setS(Math.min((window.innerWidth - 36) / DW, (window.innerHeight - 116) / DH));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return s;
}

/** The alien world we just touched down on — sky, stars, moons, horizon. */
function PlanetEnv({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* deep alien sky */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#03040c 0%,#06091a 45%,#090d20 72%,#0b1126 100%)" }}
      />
      {/* atmospheric accent glow rising off the horizon */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(130% 78% at 50% 120%, ${accent}55 0%, ${accent}22 26%, transparent 58%)` }}
      />
      {/* stars */}
      {STARS.map(([x, y], i) => (
        <span
          key={i}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
            opacity: 0.5,
            animationDelay: `${(i % 5) * 0.7}s`,
          }}
        />
      ))}
      {/* a big low moon + a smaller one in the sky */}
      <div
        className="absolute right-[13%] top-[10%] h-28 w-28 rounded-full"
        style={{ background: `radial-gradient(circle at 36% 30%, ${accent}dd, ${accent}33 58%, transparent 72%)` }}
      />
      <div
        className="absolute left-[9%] top-[20%] h-12 w-12 rounded-full"
        style={{ background: "radial-gradient(circle at 40% 35%, #ffffffaa, #ffffff22 55%, transparent 70%)", opacity: 0.5 }}
      />
      {/* the planet's surface — a glowing curved horizon rising from below */}
      <div
        className="absolute left-1/2 top-[70%] h-[140%] w-[280%] -translate-x-1/2 rounded-[50%]"
        style={{
          background: "linear-gradient(180deg,#0c1330 0%,#060912 38%,#03040c 100%)",
          borderTop: `1px solid ${accent}cc`,
          boxShadow: `0 -26px 100px -6px ${accent}66, inset 0 34px 70px -44px ${accent}66`,
        }}
      />
    </div>
  );
}

function Eyebrow({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[15px] font-semibold uppercase tracking-[0.22em]"
      style={{ color: accent, borderColor: `${accent}55`, background: `${accent}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      {children}
    </span>
  );
}

function Header({
  accent,
  eyebrow,
  title,
  right,
}: {
  accent: string;
  eyebrow: string;
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-8">
      <div>
        <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-[60px] font-bold leading-[1.04] text-white">
          {title}
        </h2>
      </div>
      {right}
    </header>
  );
}

function Frame({ i, children }: { i: number; children: ReactNode }) {
  const meta = FRAMES[i];
  const accent = ACCENTS[i];
  const s = useFitScale();
  const lat = ((i * 23 + 11) % 70) + 5;
  const lon = ((i * 47 + 17) % 150) + 10;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#03040c] text-white">
      <PlanetEnv accent={accent} />

      {/* landing telemetry HUD — we've touched down on this world */}
      <div className="relative z-20 flex shrink-0 items-center justify-between px-8 py-4">
        <span
          className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[14px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md"
          style={{ color: accent, borderColor: `${accent}55`, background: `${accent}14` }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full" style={{ background: accent, opacity: 0.55 }} />
            <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          </span>
          Landed · {meta.label}
        </span>

        <span className="hidden font-mono text-[13px] tracking-[0.18em] text-white/40 md:block">
          {lat}.4°N · {lon}.7°W · GRAV 0.9g · O₂ NOMINAL
        </span>

        <span className="font-mono text-[14px] font-semibold tracking-[0.2em]" style={{ color: accent }}>
          SECTOR {String(i + 1).padStart(2, "0")} / {String(FRAMES.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center overflow-hidden">
        <div
          style={{ width: DW, height: DH, transform: `scale(${s})`, transformOrigin: "center" }}
          className="relative"
        >
          <div className="relative z-10 flex h-full flex-col px-16 py-14">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── sections ──────────────────────────────────────────────── */

function Hero() {
  const accent = ACCENTS[0];
  const initials = profile.name.split(" ").map((n) => n[0]).join("");
  const techRow = skills.flatMap((g) => g.items).slice(0, 9);
  return (
    <Frame i={0}>
      <div className="flex h-full items-center gap-14">
        <div className="flex flex-1 flex-col justify-center">
          <Eyebrow accent={accent}>
            {world.role} · {world.focus}
          </Eyebrow>
          <h1 className="mt-6 font-display text-[112px] font-bold leading-[0.92] text-white">
            {profile.name.split(" ")[0]}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${accent}, #ffffff)` }}
            >
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="mt-7 max-w-[720px] text-[24px] leading-relaxed text-white/70">
            {profile.intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {techRow.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[16px] text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className={`${cardCls} flex w-[440px] shrink-0 flex-col p-10`}>
          <div className="flex items-center gap-5">
            <div
              className="grid h-20 w-20 place-items-center rounded-2xl font-display text-[34px] font-bold text-[#06121a]"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)`, boxShadow: `0 0 40px -6px ${accent}99` }}
            >
              {initials}
            </div>
            <div>
              <p className="font-display text-[26px] font-semibold text-white">{profile.name}</p>
              <p className="text-[17px] text-white/45">{profile.location}</p>
            </div>
          </div>
          <span
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[16px] font-semibold"
            style={{ color: accent, background: `${accent}1f` }}
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full" style={{ background: accent }} />
            {profile.status}
          </span>
          <div className="mt-7 h-px bg-white/10" />
          <div className="mt-6 space-y-5">
            {timeline.map((t) => (
              <div key={t.title} className="flex gap-4">
                <span className="mt-1.5 font-mono text-[15px] font-semibold" style={{ color: accent }}>
                  {t.when}
                </span>
                <div>
                  <p className="text-[19px] font-semibold text-white">{t.title}</p>
                  <p className="text-[16px] text-white/45">{t.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function About() {
  const accent = ACCENTS[1];
  return (
    <Frame i={1}>
      <Header
        accent={accent}
        eyebrow="The story so far"
        title={<>Every world starts with a <span style={{ color: accent }}>first step</span>.</>}
      />
      <div className="mt-9 grid flex-1 grid-cols-2 gap-7">
        <div className="flex flex-col gap-6">
          <div className={`${cardCls} flex flex-1 flex-col p-9`}>
            <p className={labelCls}>Origin</p>
            <p className="mt-4 text-[23px] leading-relaxed text-white/70">{about.origin}</p>
          </div>
          <div className={`${cardCls} flex flex-1 flex-col p-9`}>
            <p className={labelCls}>What I&apos;m chasing</p>
            <p className="mt-4 text-[23px] leading-relaxed text-white/70">{about.chasing}</p>
          </div>
        </div>
        <div className={`${cardCls} flex flex-col p-9`}>
          <p className={labelCls}>The throughline</p>
          <div className="mt-7 flex-1 space-y-7">
            {about.beats.map((b, i) => (
              <div key={i} className="flex gap-5">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[20px] font-bold"
                  style={{ color: accent, background: `${accent}1f` }}
                >
                  {i + 1}
                </span>
                <p className="font-display text-[27px] leading-snug text-white">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl p-6" style={{ background: `${accent}16` }}>
            <p className="text-[20px] text-white/85">
              In short — <span className="font-semibold" style={{ color: accent }}>{world.mood}</span>
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Projects() {
  const accent = ACCENTS[2];
  return (
    <Frame i={2}>
      <Header
        accent={accent}
        eyebrow="Selected work"
        title={<>Things I&apos;ve <span style={{ color: accent }}>built</span>.</>}
        right={
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[16px] font-semibold text-white/70">
            {projects.length} flagship builds
          </span>
        }
      />
      <div className="mt-9 grid flex-1 grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`${cardCls} group relative flex flex-col overflow-hidden p-8 transition-transform hover:-translate-y-1.5`}
          >
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            <div className="flex items-center justify-between">
              <span className="font-display text-[40px] font-bold text-white/15">0{i + 1}</span>
              <span className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: accent }}>
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: accent }} />
                {p.year}
              </span>
            </div>
            <h3 className="mt-4 font-display text-[40px] leading-none text-white">{p.title}</h3>
            {p.tagline && <p className="mt-3 text-[19px]" style={{ color: accent }}>{p.tagline}</p>}
            <p className="mt-4 text-[18px] leading-relaxed text-white/65">{p.blurb}</p>
            <div className="mt-auto pt-6">
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[14px] text-white/60">
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-[18px] font-semibold transition-transform group-hover:translate-x-1" style={{ color: accent }}>
                View case study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Frame>
  );
}

function Skills() {
  const accent = ACCENTS[3];
  return (
    <Frame i={3}>
      <Header
        accent={accent}
        eyebrow="Toolkit & timeline"
        title={<>What I work <span style={{ color: accent }}>with</span>.</>}
      />
      <div className="mt-9 grid flex-1 grid-cols-[1.15fr_1fr] gap-7">
        <div className="grid grid-cols-2 content-start gap-5">
          {skills.map((g) => (
            <div key={g.group} className={`${cardCls} p-6`}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: accent }} />
                <p className="text-[16px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
                  {g.group}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span key={it} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[17px] text-white/80">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={`${cardCls} flex flex-col p-8`}>
          <p className={labelCls}>Milestones</p>
          <div className="relative mt-6 flex-1 pl-8">
            <div className="absolute left-[7px] top-2 h-[88%] w-0.5" style={{ background: `linear-gradient(${accent}, ${accent}22)` }} />
            <div className="space-y-7">
              {timeline.map((t, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-8 top-1 h-4 w-4 rounded-full border-[3px] bg-[#070b16]" style={{ borderColor: accent }} />
                  <p className="font-mono text-[15px] font-semibold uppercase tracking-[0.18em] text-white/45">{t.when}</p>
                  <h3 className="mt-1 font-display text-[26px] text-white">{t.title}</h3>
                  <p className="text-[18px]" style={{ color: accent }}>{t.org}</p>
                  <p className="mt-1 text-[17px] leading-snug text-white/65">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Hobbies() {
  const accent = ACCENTS[4];
  return (
    <Frame i={4}>
      <Header
        accent={accent}
        eyebrow="Off the clock"
        title={<>The things that keep me <span style={{ color: accent }}>human</span>.</>}
      />
      <div className="mt-9 grid flex-1 grid-cols-2 grid-rows-2 gap-6">
        {hobbies.map((h, i) => (
          <div key={h.name} className={`${cardCls} group relative flex flex-col justify-center overflow-hidden p-9 transition-transform hover:-translate-y-1`}>
            <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full blur-2xl" style={{ background: `${accent}26` }} />
            <span className="font-display text-[56px] font-bold leading-none text-white/15">0{i + 1}</span>
            <h3 className="mt-4 font-display text-[34px] text-white">{h.name}</h3>
            <p className="mt-2 max-w-[440px] text-[21px] leading-relaxed text-white/65">{h.note}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Sidequests() {
  const accent = ACCENTS[5];
  return (
    <Frame i={5}>
      <Header
        accent={accent}
        eyebrow="Press ▶ to play"
        title={<>Side<span style={{ color: accent }}>quests</span>.</>}
        right={
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[16px] font-semibold text-white/70">
            {sidequests.length} active missions
          </span>
        }
      />
      <div className="mt-8 grid flex-1 grid-cols-4 grid-rows-2 gap-4">
        {sidequests.map((q, i) => (
          <div key={i} className={`${cardCls} group flex flex-col p-6 transition-transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl text-[24px]" style={{ background: `${accent}1c` }}>
                {q.icon}
              </span>
              <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide" style={{ color: accent, background: `${accent}1c` }}>
                {q.status}
              </span>
            </div>
            <h3 className="mt-4 font-display text-[23px] leading-tight text-white">{q.title}</h3>
            <p className="mt-2 text-[15px] leading-snug text-white/50">{q.note}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const TOPICS = [
  { icon: "🤖", cat: "AI", title: "Agents that ship", blurb: "Building multi-agent systems that survive contact with reality." },
  { icon: "🧱", cat: "Systems", title: "Designing for scale", blurb: "Wiring FastAPI, Redis & queues for production loads." },
  { icon: "🧪", cat: "Experiments", title: "Build logs", blurb: "Half-baked ideas — and what happened when I tried them." },
  { icon: "📚", cat: "Learning", title: "Rabbit holes", blurb: "Whatever I fell into this week and couldn't stop reading." },
];

function Blog() {
  const accent = ACCENTS[6];
  return (
    <Frame i={6}>
      <Header
        accent={accent}
        eyebrow="Notes & writing"
        title={<>Thinking out <span style={{ color: accent }}>loud</span>.</>}
        right={
          <Link
            href="/blog"
            className="rounded-full px-6 py-3 text-[18px] font-semibold text-[#06121a] transition-transform hover:scale-[1.03]"
            style={{ background: accent, boxShadow: `0 12px 34px -10px ${accent}cc` }}
          >
            Read the blog →
          </Link>
        }
      />
      <div className="mt-9 grid flex-1 grid-cols-[1fr_1.35fr] gap-7">
        <div className={`${cardCls} relative flex flex-col justify-center overflow-hidden p-10`}>
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full blur-3xl" style={{ background: `${accent}33` }} />
          <p className="relative font-display text-[40px] font-semibold leading-tight text-white">
            Build logs, half-formed ideas & lessons learned the hard way.
          </p>
          <p className="relative mt-5 text-[21px] leading-relaxed text-white/65">
            Written down so I — and maybe you — can find them again.
          </p>
          <Link
            href="/blog"
            className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-[18px] font-semibold transition-colors hover:bg-white/5"
            style={{ color: accent, borderColor: `${accent}55` }}
          >
            Browse all posts →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {TOPICS.map((t) => (
            <div key={t.title} className={`${cardCls} flex flex-col p-7 transition-transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <span className="text-[34px]">{t.icon}</span>
                <span className="rounded-full px-3 py-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: accent, background: `${accent}1c` }}>
                  {t.cat}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[26px] text-white">{t.title}</h3>
              <p className="mt-2 text-[17px] leading-snug text-white/60">{t.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Contact() {
  const accent = ACCENTS[7];
  return (
    <Frame i={7}>
      <Header
        accent={accent}
        eyebrow="Get in touch"
        title={<>Let&apos;s build something <span style={{ color: accent }}>worth talking about</span>.</>}
      />
      <div className="mt-9 grid flex-1 grid-cols-[1.2fr_1fr] gap-7">
        <div className="flex flex-col justify-center">
          <p className="max-w-[560px] text-[24px] leading-relaxed text-white/70">
            Whether it&apos;s a role, a collaboration, or an idea worth chasing — my inbox is always open.
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-8 inline-block w-fit font-display text-[44px] font-semibold text-white underline decoration-[3px] underline-offset-[10px] transition-colors hover:opacity-80"
            style={{ textDecorationColor: accent }}
          >
            {contact.email}
          </a>
          <div className="mt-9 flex flex-wrap gap-3">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.05] px-7 py-3.5 text-[20px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className={`${cardCls} p-8`}>
            <p className={labelCls}>Availability</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full" style={{ background: accent }} />
                <p className="text-[20px] text-white">{profile.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[20px]">📍</span>
                <p className="text-[20px] text-white/70">{profile.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[20px]">⚡</span>
                <p className="text-[20px] text-white/70">Usually replies within a day</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-7 font-mono text-[17px] text-[#cfe9df]">
            <p className="text-white/35">$ ./contact.sh</p>
            <p className="mt-2">
              <span style={{ color: accent }}>echo</span> &quot;let&apos;s talk&quot;
            </p>
            <p>
              <span style={{ color: accent }}>open</span> mailto:{contact.email}
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

const BODIES = [Hero, About, Projects, Skills, Hobbies, Sidequests, Blog, Contact];

export default function FrameContent({ index }: { index: number }) {
  const Body = BODIES[index] ?? Hero;
  return <Body />;
}
