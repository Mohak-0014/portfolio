"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import SplitFlap from "../departures/SplitFlap";
import { AIRLINE, AIRPORT } from "../departures/departures";
import StationScene from "./StationScene";
import { ITINERARY, PLANE_STOP } from "./itinerary";
import { BODIES } from "./bodies";
import * as sfx from "../globe/sounds";

const LAST = ITINERARY.length - 1;

/* ── boarding-gate scan, shown when you board the plane ── */
function BoardingGate() {
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setScanned(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 grid place-items-center px-4"
      style={{ background: "linear-gradient(160deg,#0f766e,#0e7490)" }}
    >
      <div className="flex flex-col items-center gap-5 text-white">
        <p className="font-mono text-[13px] uppercase tracking-[0.3em] opacity-80">Now boarding · Gate 7</p>
        <div className="relative w-[min(86vw,440px)] overflow-hidden rounded-2xl bg-white p-6 text-slate-800 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-teal-600">✈ {AIRLINE}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Boarding Pass</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Seat</p>
              <p className="font-display text-[24px] font-bold leading-none">1A</p>
            </div>
            <p className="font-mono text-[14px] text-slate-500">MN001 · GATE 7</p>
          </div>
          <div className="mt-4 flex h-10 items-stretch gap-[2px] border-t border-dashed border-black/15 pt-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="flex-1 bg-slate-800" style={{ opacity: i % 3 === 0 ? 1 : 0.5 }} />
            ))}
          </div>
          <motion.div className="pointer-events-none absolute inset-y-0 w-[3px] bg-teal-500" style={{ boxShadow: "0 0 18px 4px #14b8a6" }} initial={{ left: "0%", opacity: 0 }} animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 0.85 }} />
          <AnimatePresence>
            {scanned && (
              <motion.div
                initial={{ scale: 1.6, opacity: 0, rotate: -16 }}
                animate={{ scale: 1, opacity: 1, rotate: -10 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border-[3px] border-teal-600 bg-white/70 px-5 py-1.5 text-[20px] font-extrabold uppercase tracking-[0.16em] text-teal-700"
              >
                Boarded ✓
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function JourneyStage() {
  const [stop, setStop] = useState(0);
  const [dir, setDir] = useState(1);
  const [boarding, setBoarding] = useState(false);
  const [muted, setMuted] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const bTimer = useRef<number | null>(null);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  const enterSound = (id: string) => {
    if (id === "passport") sfx.land();
    else if (id === "security") sfx.scan();
    else sfx.blip(byTone(id));
  };

  const go = (target: number) => {
    const t = Math.max(0, Math.min(LAST, target));
    if (t === stop || boarding) return;
    sfx.unlockAudio();
    setDir(t > stop ? 1 : -1);
    if (t === PLANE_STOP && stop < PLANE_STOP) {
      setBoarding(true);
      sfx.chime();
      window.setTimeout(() => sfx.scan(), 700);
      bTimer.current = window.setTimeout(() => {
        setStop(t);
        setBoarding(false);
      }, 1900);
    } else {
      enterSound(ITINERARY[t].id);
      setStop(t);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(stop + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(stop - 1);
      } else if (e.key === "Home") {
        go(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (bTimer.current) window.clearTimeout(bTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop, boarding]);

  const s = ITINERARY[stop];
  const accent = s.accent;
  const Body = BODIES[s.section];
  const slideX = reduced ? 0 : 60;

  return (
    <div className="fixed inset-0 z-0 flex flex-col overflow-hidden font-sans text-slate-900">
      {/* per-station background scene — the actual counter you're standing at */}
      <AnimatePresence mode="sync">
        <motion.div
          key={s.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.001 : 0.5 }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <StationScene id={s.id} accent={accent} />
        </motion.div>
      </AnimatePresence>

      {/* ── top HUD: brand · itinerary stepper · clock/mute ── */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-white transition-colors" style={{ background: accent }}>✈</span>
          <div className="hidden leading-tight sm:block">
            <p className="text-[14px] font-bold text-slate-800">{AIRLINE}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{AIRPORT}</p>
          </div>
        </div>

        {/* itinerary stepper */}
        <nav className="flex max-w-[60%] items-center gap-1 overflow-x-auto px-1 sm:gap-1.5">
          {ITINERARY.map((it, i) => {
            const done = i < stop;
            const active = i === stop;
            return (
              <button key={it.id} onClick={() => go(i)} title={it.zone} className="group flex items-center">
                <span
                  className={clsx(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] shadow-sm transition-all",
                    active ? "scale-110 text-white" : done ? "text-white" : "bg-white/90 text-slate-400 ring-1 ring-black/10"
                  )}
                  style={active || done ? { background: it.accent } : undefined}
                >
                  {it.icon}
                </span>
                {i < LAST && <span className={clsx("h-[2px] w-3 sm:w-5", done ? "" : "bg-black/15")} style={done ? { background: it.accent } : undefined} />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[16px] font-semibold text-slate-700 tabular-nums sm:block">{clock}</span>
          <button
            onClick={() => setMuted(sfx.toggleMute())}
            aria-label={muted ? "Unmute" : "Mute"}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-slate-600 transition-colors hover:border-black/25"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      {/* ── overhead wayfinding sign ── */}
      <div className="relative z-10 flex flex-col items-center pb-1 pt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 rounded-lg px-4 py-2 shadow-lg"
            style={{ background: "#12303a" }}
          >
            <span className="text-[20px]">{s.icon}</span>
            <SplitFlap text={s.sign} length={18} tone="#f1ece1" className="text-[13px] font-semibold sm:text-[15px]" />
            <span className="text-[18px] text-white/70">→</span>
          </motion.div>
        </AnimatePresence>
        <p className="mt-1.5 rounded-full bg-white/70 px-3 py-0.5 text-center text-[12px] italic text-slate-600 backdrop-blur-sm">{s.caption}</p>
      </div>

      {/* ── stage: the station panel, floating in front of the scene ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-3 pb-2 sm:px-4">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={stop}
            custom={dir}
            initial={{ x: dir * slideX, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * slideX, opacity: 0 }}
            transition={{ duration: reduced ? 0.001 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-[0_30px_80px_-30px_rgba(20,30,50,0.55)] backdrop-blur-xl"
          >
            <div className="h-1.5 w-full shrink-0" style={{ background: accent }} />
            <div className="overflow-y-auto px-6 py-7 sm:px-10 sm:py-9">
              <Body accent={accent} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── footer navigation ── */}
      <footer className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <button
          onClick={() => go(stop - 1)}
          disabled={stop === 0}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition-colors hover:border-black/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>

        <span className="text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Stop {stop + 1} of {ITINERARY.length} · {s.zone}
        </span>

        {stop < LAST ? (
          <button
            onClick={() => go(stop + 1)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white shadow-md transition-transform hover:scale-[1.03]"
            style={{ background: accent }}
          >
            <span className="hidden sm:inline">Proceed to {ITINERARY[stop + 1].zone}</span>
            <span className="sm:hidden">Proceed</span> →
          </button>
        ) : (
          <button
            onClick={() => go(0)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white shadow-md transition-transform hover:scale-[1.03]"
            style={{ background: accent }}
          >
            ↺ Start over
          </button>
        )}
      </footer>

      {/* boarding-gate scan */}
      <AnimatePresence>{boarding && <BoardingGate />}</AnimatePresence>
    </div>
  );
}

/* a little tonal variety for the per-stop blip */
function byTone(id: string): number {
  const map: Record<string, number> = {
    entrance: 660,
    checkin: 600,
    lounge: 560,
    newsstand: 700,
    cabin: 520,
    arrival: 740,
  };
  return map[id] ?? 640;
}
