"use client";

import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Props = {
  children: ReactNode;
  /** How far it drifts, in px, over the element's full scroll pass. Keep it small. */
  amount?: number;
  className?: string;
};

/**
 * Gentle scroll-linked parallax. The wrapped block drifts a touch slower than
 * the page as it passes through the viewport, adding depth without motion
 * sickness. Off entirely under prefers-reduced-motion.
 */
export default function Parallax({ children, amount = 40, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}
