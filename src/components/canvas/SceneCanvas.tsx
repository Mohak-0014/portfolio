"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { initScrollState } from "@/lib/scrollState";

/**
 * Full-viewport fixed backdrop behind the DOM sections. The ambient personality
 * now lives in the DOM greeter (see components/companion/Greeter.tsx); here we
 * keep a calm sky that quietly shifts from daytime toward dusk as you scroll —
 * a subtle sense of travelling through the page. Still owns `initScrollState`,
 * which the greeter reads for the active section.
 */
export default function SceneCanvas() {
  useEffect(() => {
    initScrollState();
  }, []);

  const { scrollYProgress } = useScroll();
  // dusk wash fades in over the descent; sheen eases off so it doesn't pile up
  const dusk = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.28, 0.7]);
  const sheen = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {/* daytime sky backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#BFE9E0_0%,#DFF3EE_38%,#EEF7F2_64%,#FBFAF4_100%)]" />

      {/* dusk wash — fades in as you scroll down */}
      <motion.div
        style={{ opacity: dusk }}
        className="absolute inset-0 bg-[linear-gradient(180deg,#A7C7E7_0%,#C9B8D8_45%,#F3D9C6_78%,#FBE9D6_100%)]"
      />

      {/* soft top sheen to seat the frosted content */}
      <motion.div
        style={{ opacity: sheen }}
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(94,234,212,0.18),transparent_70%)]"
      />
    </div>
  );
}
