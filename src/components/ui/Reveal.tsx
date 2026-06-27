"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

/** Entrance styles a section can use so each chapter enters a little differently. */
export type RevealVariant = "rise" | "fade" | "left" | "right" | "scale";

type Props = {
  children: ReactNode;
  delay?: number;
  /** rise distance (only used by the default "rise" variant) */
  y?: number;
  variant?: RevealVariant;
  className?: string;
};

function build(variant: RevealVariant, y: number): Variants {
  switch (variant) {
    case "fade":
      return { hidden: { opacity: 0 }, show: { opacity: 1 } };
    case "left":
      return { hidden: { opacity: 0, x: -44 }, show: { opacity: 1, x: 0 } };
    case "right":
      return { hidden: { opacity: 0, x: 44 }, show: { opacity: 1, x: 0 } };
    case "scale":
      return { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } };
    case "rise":
    default:
      return { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } };
  }
}

/** Animate into view on scroll. `variant` picks the kind of entrance. */
export default function Reveal({ children, delay = 0, y = 28, variant = "rise", className }: Props) {
  return (
    <motion.div
      className={className}
      variants={build(variant, y)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
