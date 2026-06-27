"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections, profile } from "@/data/content";

/** Floating top nav with smooth-scroll anchors driven by Lenis. */
export default function Navbar() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement) => void } })
      .lenis;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink-600/40 bg-ink-800/60 py-3 backdrop-blur-md"
          : "py-5"
      }`}
    >
      <nav className="container-x flex items-center justify-between">
        <button
          onClick={() => go("hero")}
          className="font-display text-sm font-semibold tracking-wide text-moon"
        >
          {profile.name.split(" ")[0] || "Portfolio"}
          <span className="text-accent">.</span>
        </button>

        <ul
          className={`hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex ${
            scrolled ? "glass" : ""
          }`}
        >
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === s.id
                    ? "bg-accent/15 text-accent"
                    : "text-slate-300 hover:text-moon"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => go("contact")}
            className="btn-accent !px-5 !py-2 text-xs"
          >
            Get in touch
          </button>

          {/* hamburger — mobile only */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="glass grid h-10 w-10 place-items-center rounded-full text-moon md:hidden"
          >
            <span className="relative block h-4 w-5">
              <motion.span
                className="absolute left-0 block h-[2px] w-5 rounded-full bg-current"
                animate={open ? { rotate: 45, top: 7 } : { rotate: 0, top: 1 }}
                transition={{ duration: 0.25 }}
                style={{ top: 1 }}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute left-0 block h-[2px] w-5 rounded-full bg-current"
                animate={open ? { rotate: -45, top: 7 } : { rotate: 0, top: 13 }}
                transition={{ duration: 0.25 }}
                style={{ top: 13 }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="container-x overflow-hidden md:hidden"
          >
            <ul className="glass mt-3 flex flex-col gap-1 rounded-3xl p-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => go(s.id)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      active === s.id
                        ? "bg-accent/15 text-accent"
                        : "text-slate-600 hover:text-moon"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
