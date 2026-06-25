"use client";

import { useEffect, useState } from "react";

/** Slim vertical progress bar on the right edge — the "you are here" of the story. */
export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed right-4 top-1/2 z-40 hidden h-40 w-[3px] -translate-y-1/2 rounded-full bg-ink-600/60 lg:block">
      <div
        className="w-full rounded-full bg-accent shadow-glow transition-[height] duration-150"
        style={{ height: `${Math.max(4, p * 100)}%` }}
      />
    </div>
  );
}
