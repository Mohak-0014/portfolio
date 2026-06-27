"use client";

import { useEffect, useState } from "react";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/.-:";

/** One flap cell — scrambles through the alphabet, then settles on `target`. */
function Flap({ target, delay, tone }: { target: string; delay: number; tone: string }) {
  const [ch, setCh] = useState(" ");

  useEffect(() => {
    const goal = target.toUpperCase();
    if (goal === " ") {
      setCh(" ");
      return;
    }
    let idx = Math.max(0, CHARS.indexOf(ch.toUpperCase()));
    let timer = 0;
    let stopped = false;
    const begin = window.setTimeout(() => {
      const tick = () => {
        if (stopped) return;
        idx = (idx + 1) % CHARS.length;
        const cur = CHARS[idx];
        setCh(cur);
        if (cur === goal) return;
        timer = window.setTimeout(tick, 38);
      };
      tick();
    }, delay);
    return () => {
      stopped = true;
      window.clearTimeout(begin);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, delay]);

  return (
    <span
      className="relative inline-grid h-[1.5em] w-[0.92em] place-items-center overflow-hidden rounded-[2px] bg-[#f1ece1] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.07),0_1px_1px_rgba(0,0,0,0.25)]"
      style={{ color: tone }}
    >
      <span className="leading-none">{ch === " " ? " " : ch}</span>
      {/* the split seam */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/20" />
    </span>
  );
}

export default function SplitFlap({
  text,
  length,
  tone = "#2a2622",
  className,
}: {
  text: string;
  length?: number;
  tone?: string;
  className?: string;
}) {
  const len = length ?? text.length;
  const padded = text.toUpperCase().slice(0, len).padEnd(len, " ");
  return (
    <span className={className} style={{ display: "inline-flex", gap: "2px" }}>
      {padded.split("").map((c, i) => (
        <Flap key={i} target={c} delay={i * 50} tone={tone} />
      ))}
    </span>
  );
}
