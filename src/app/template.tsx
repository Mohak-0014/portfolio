"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition wrapper. `template.tsx` re-mounts on every navigation, so
 * this gives a calm cross-fade between pages (home ↔ case study ↔ blog) instead
 * of a hard white cut.
 *
 * Deliberately opacity-only: a transformed/filtered wrapper would become the
 * containing block for the page's `fixed` overlays (navbar, greeter, progress)
 * and break the GSAP pinned scroll in Projects. Opacity creates only a stacking
 * context, which is safe.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
