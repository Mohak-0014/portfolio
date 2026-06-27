"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Slim vertical progress bar on the right edge — the "you are here" of the story. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div className="fixed right-4 top-1/2 z-40 hidden h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ink-600/60 lg:block">
      <motion.div
        style={{ scaleY }}
        className="h-full w-full origin-top rounded-full bg-accent shadow-glow"
      />
    </div>
  );
}
