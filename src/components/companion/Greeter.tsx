"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sections } from "@/data/content";
import { PLACARDS, type Line, type Mood } from "@/data/companion";
import { scrollState } from "@/lib/scrollState";

/**
 * Arrivals greeter — a little chibi of Mohak that wanders the bottom of the page
 * and reacts from a speech bubble.
 *
 * The art is a 9-pose sprite set (sliced + background-removed from a single
 * sheet, see scripts/cut_companion.py) living in /public/companion. Each mood
 * maps to a pose frame; while walking it shows the side-view walk frame flipped
 * to face its direction of travel. Floating effects (hearts, anger marks…) are
 * still drawn on top.
 *
 * Kept short and corner-anchored so it never blocks the view; on phones it
 * scales down (tucked into the bottom-left) so it stays out of the way.
 */

const IDLE_MS = 9_000;
const BOX_W = 220; // container width in px; movement is clamped to keep it on-screen
const SPEED = 90; // px/s, used to time the walk so it reads at constant pace
const SPRITE_W = 99;
const SPRITE_H = 122;

const FRAMES: Record<string, string> = {
  idle: "/companion/idle.png",
  happy: "/companion/happy.png",
  angry: "/companion/angry.png",
  funny: "/companion/funny.png",
  cheeky: "/companion/cheeky.png",
  smug: "/companion/smug.png",
  surprised: "/companion/surprised.png",
  sleepy: "/companion/sleepy.png",
  walk: "/companion/walk.png",
};

function pick(pool: Line[], avoid?: Line): Line {
  if (pool.length === 1) return pool[0];
  let line = pool[(Math.random() * pool.length) | 0];
  let guard = 0;
  while (line.text === avoid?.text && guard++ < 8) line = pool[(Math.random() * pool.length) | 0];
  return line;
}

/** Per-mood accent used to tint the speech bubble's border + tail. */
const TINT: Record<Mood, string> = {
  happy: "#10b981",
  cheeky: "#f59e0b",
  funny: "#6366f1",
  angry: "#ef4444",
  smug: "#8b5cf6",
  surprised: "#06b6d4",
  sleepy: "#94a3b8",
};

export default function Greeter() {
  const reduce = useReducedMotion();
  // on phones the widget scales down so it never crowds the content
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [sectionId, setSectionId] = useState<string>(sections[0].id);
  const [line, setLine] = useState<Line>(() => PLACARDS[sections[0].id]?.[0] ?? PLACARDS.idle[0]);
  const lineRef = useRef(line);
  lineRef.current = line;

  // horizontal position (px from left, via transform), facing, and gait state
  const [x, setX] = useState(28);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [walkDur, setWalkDur] = useState(1.6);
  const xRef = useRef(x);
  xRef.current = x;

  const maxX = () => Math.max(20, (typeof window !== "undefined" ? window.innerWidth : 1200) - BOX_W - 12);

  const walkTo = useCallback((target: number) => {
    const clamped = Math.min(maxX(), Math.max(20, target));
    const dist = Math.abs(clamped - xRef.current);
    if (dist < 4) return;
    setFacing(clamped >= xRef.current ? 1 : -1);
    setWalkDur(reduce ? 0 : Math.min(4, Math.max(0.7, dist / SPEED)));
    setX(clamped);
    if (!reduce) setWalking(true);
  }, [reduce]);

  // entrance: amble in to the bottom-right corner
  useEffect(() => {
    const t = window.setTimeout(() => walkTo(maxX()), 500);
    return () => window.clearTimeout(t);
  }, [walkTo]);

  // wander on its own
  useEffect(() => {
    if (reduce) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        walkTo(20 + Math.random() * (maxX() - 20));
        schedule();
      }, 18000 + Math.random() * 14000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [reduce, walkTo]);

  // keep it on-screen if the window shrinks
  useEffect(() => {
    const onResize = () => setX((prev) => Math.min(maxX(), prev));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // follow the centered section without subscribing to scroll re-renders;
  // a new section earns a fresh line and a stroll to a new spot
  useEffect(() => {
    let raf = 0;
    let last = scrollState.activeIndex;
    const tick = () => {
      const i = scrollState.activeIndex;
      if (i !== last) {
        last = i;
        const id = sections[i]?.id ?? sections[0].id;
        setSectionId(id);
        setLine(pick(PLACARDS[id] ?? PLACARDS.idle, lineRef.current));
        walkTo(20 + Math.random() * (maxX() - 20));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [walkTo]);

  // while lingering, rotate through this section's other comments (varied
  // reactions); occasionally drift to a wry idle line. Re-arms on every line
  // change, so it keeps cycling as long as you stay put.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const sectionPool = PLACARDS[sectionId] ?? PLACARDS.idle;
      const pool = Math.random() < 0.75 ? sectionPool : PLACARDS.idle;
      setLine(pick(pool, lineRef.current));
    }, IDLE_MS);
    return () => window.clearTimeout(t);
  }, [sectionId, line]);

  // poke it → grumpy / silly reaction + a little hop to the side
  const poke = useCallback(() => {
    setLine(pick(PLACARDS.poke, lineRef.current));
    walkTo(xRef.current + (Math.random() < 0.5 ? -70 : 70));
  }, [walkTo]);

  const mood = line.mood;
  const tint = TINT[mood];

  const bob = useMemo(() => {
    if (reduce) return {};
    return walking ? { y: [0, -3, 0] } : { y: [0, -4, 0] };
  }, [reduce, walking]);

  const activeKey = walking ? "walk" : FRAMES[mood] ? mood : "idle";

  return (
    <motion.div
      className="pointer-events-none fixed bottom-3 left-0 z-40 block h-[190px] w-[220px] origin-bottom-left select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x, scale: compact ? 0.8 : 1 }}
      transition={{ opacity: { delay: 0.6, duration: 0.6 }, x: { duration: walkDur, ease: "easeInOut" } }}
      onAnimationComplete={() => setWalking(false)}
    >
      {/* speech bubble — crisp DOM type, tinted to the current mood */}
      <motion.button
        type="button"
        onClick={poke}
        aria-label="Poke the greeter"
        className="pointer-events-auto absolute left-[6px] top-0 w-[178px] cursor-pointer rounded-xl border bg-white/45 px-3 py-2 text-left text-[11.5px] font-medium leading-snug text-slate-800 shadow-[0_12px_30px_-14px_rgba(20,30,50,0.45)] backdrop-blur-md backdrop-saturate-150"
        style={{ borderColor: tint, boxShadow: `0 12px 30px -14px ${tint}55, inset 0 1px 0 0 rgba(255,255,255,0.6)` }}
        animate={reduce ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={line.text + (walking ? "-walk" : "")}
            className="block min-h-[2.4em]"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.24 }}
          >
            {walking ? <WalkDots /> : line.text}
          </motion.span>
        </AnimatePresence>
        {/* tail pointing down at the mascot's head */}
        <span
          className="absolute -bottom-[8px] left-[44px] h-4 w-4 rotate-45 rounded-[3px] border-b border-r bg-white/45 backdrop-blur-md"
          style={{ borderColor: tint }}
        />
      </motion.button>

      {/* sprite */}
      <motion.div
        className="pointer-events-auto absolute bottom-0 left-0 cursor-pointer"
        onClick={poke}
        whileTap={{ scale: 0.92 }}
        style={{ transformOrigin: "center bottom" }}
      >
        <motion.div animate={bob} transition={{ duration: walking ? 0.45 : 4, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ position: "relative", width: SPRITE_W, height: SPRITE_H }}>
            {Object.entries(FRAMES).map(([key, src]) => {
              const active = key === activeKey;
              // walk art faces left; flip it to face right when travelling right
              const flip = key === "walk" && facing === 1;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={key}
                  src={src}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom",
                    opacity: active ? 1 : 0,
                    transition: "opacity 0.15s ease",
                    transform: flip ? "scaleX(-1)" : "none",
                    filter: "drop-shadow(0 8px 10px rgba(15,23,42,0.18))",
                  }}
                />
              );
            })}
            {/* floating mood effects overlaid around the head */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={SPRITE_W}
              height={SPRITE_H}
              viewBox="0 0 200 280"
              style={{ overflow: "visible" }}
            >
              <Effects mood={mood} walking={walking} reduce={!!reduce} />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function WalkDots() {
  return (
    <span className="inline-flex gap-1 align-middle">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

/** Floating symbols around the head that sell the emotion. */
function Effects({ mood, reduce, walking }: { mood: Mood; reduce: boolean; walking: boolean }) {
  if (walking) return null;

  const Float = ({ x, delay = 0, children }: { x: number; delay?: number; children: React.ReactNode }) => (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 0], y: [-2, -26, -26, -40] }}
      transition={reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeOut", delay }}
      style={{ x }}
    >
      {children}
    </motion.g>
  );

  const heart = (s = 1) => (
    <path d="M8 14 C-2 7 1 0 8 4 C15 0 18 7 8 14 Z" fill="#ef5777" transform={`scale(${s})`} />
  );

  if (mood === "happy" || mood === "funny") {
    return (
      <g>
        <Float x={40} delay={0}>{heart(1)}</Float>
        <Float x={150} delay={0.6}>{heart(0.8)}</Float>
        {mood === "funny" && <Float x={168} delay={1.3}>{heart(0.6)}</Float>}
      </g>
    );
  }

  if (mood === "angry") {
    const Vein = ({ tx, ty }: { tx: number; ty: number }) => (
      <motion.g
        transform={`translate(${tx} ${ty})`}
        animate={reduce ? {} : { scale: [0.7, 1.1, 0.7], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        stroke="#ef4444"
        strokeWidth="2.6"
        strokeLinecap="round"
      >
        <path d="M0 6 L6 0 L12 6" />
        <path d="M2 12 L6 6 L10 12" />
      </motion.g>
    );
    return (
      <g>
        <Vein tx={150} ty={30} />
        <Vein tx={40} ty={40} />
      </g>
    );
  }

  if (mood === "surprised") {
    return (
      <motion.g
        transform="translate(156 26)"
        animate={reduce ? {} : { scale: [0, 1.15, 1], y: [4, 0, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.9, ease: "backOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="5" height="14" rx="2.5" fill="#06b6d4" />
        <circle cx="2.5" cy="20" r="3" fill="#06b6d4" />
      </motion.g>
    );
  }

  if (mood === "cheeky" || mood === "smug") {
    const color = mood === "cheeky" ? "#f59e0b" : "#a78bfa";
    const star = <path d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill={color} />;
    return (
      <g>
        <motion.g
          transform="translate(152 36)"
          animate={reduce ? {} : { scale: [0, 1, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {star}
        </motion.g>
        <motion.g
          transform="translate(44 46)"
          animate={reduce ? {} : { scale: [0, 0.8, 0], rotate: [0, -90, -180] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {star}
        </motion.g>
      </g>
    );
  }

  if (mood === "sleepy") {
    return (
      <g>
        <Float x={150} delay={0}>
          <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
        </Float>
        <Float x={160} delay={0.8}>
          <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
        </Float>
      </g>
    );
  }

  return null;
}
