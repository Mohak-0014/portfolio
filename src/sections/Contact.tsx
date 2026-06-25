"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { contact, profile } from "@/data/content";

export default function Contact() {
  return (
    <Section id="contact" className="pb-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-4">Get in touch</p>
          <h2 className="section-title max-w-3xl">
            Let&apos;s build something
            <span className="text-accent"> worth talking about</span>.
          </h2>
          <p className="lead mt-6 max-w-xl">
            Whether it&apos;s a role, a collaboration, or an idea worth chasing —
            I&apos;d love to hear from you. My inbox is always open.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${contact.email}`}
            className="mt-10 inline-block font-display text-2xl text-moon underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent md:text-4xl"
          >
            {contact.email}
          </a>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-3">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        <footer className="mt-28 flex flex-col items-start justify-between gap-4 border-t border-ink-600 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name}. Built with curiosity &amp;
            caffeine.
          </span>
          <span>{profile.location}</span>
        </footer>
      </div>
    </Section>
  );
}
