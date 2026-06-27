"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Parallax from "@/components/ui/Parallax";
import { profile, world } from "@/data/content";

export default function Hero() {
  return (
    <Section id="hero" bare className="flex min-h-screen items-center">
      <Parallax amount={60} className="container-x">
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {world.role} · {world.focus}
        </motion.p>

        <div className="overflow-hidden py-[0.12em]">
          <motion.h1
            className="font-display text-5xl font-bold leading-[1.05] text-moon sm:text-7xl md:text-8xl"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.name}
          </motion.h1>
        </div>

        <motion.p
          className="mt-6 max-w-xl text-lg text-slate-300 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <span className="rounded-full border border-ink-600 px-4 py-2 text-xs text-slate-300">
            {profile.tagline}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2 text-xs text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            {profile.status}
          </span>
        </motion.div>
      </Parallax>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-slate-400">
          Scroll to enter
        </span>
        <div className="mx-auto flex h-9 w-5 justify-center rounded-full border border-ink-600 p-1">
          <motion.span
            className="h-2 w-1 rounded-full bg-accent"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </Section>
  );
}
