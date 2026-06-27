"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { FRAMES, pathLabel } from "../prezi/frames";
import FrameContent from "../prezi/FrameContent";
import Terminal, { type NavStyle } from "../prezi/Terminal";
import GlobeScene from "./GlobeScene";
import { globeState, targetRotation, forwardRy } from "./globe";
import * as sfx from "./sounds";

const WHEEL_STEP = 220; // a more deliberate scroll is needed to advance
const TWO_PI = Math.PI * 2;
const TOUR_DWELL = 5600; // ms a section stays on screen during auto-tour
const PANEL_HOLD = 6500; // ms a section holds before it zooms back out to the globe

/**
 * A Prezi-style tour across a planet. Each section is a marker pinned to the
 * globe; navigating spins it rapidly so the target marker faces the camera,
 * dives in, and reveals the section panel — with synth sound effects.
 */
export default function GlobeStage() {
  const focusRef = useRef(-1);
  const animating = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const accum = useRef(0);
  const reduced = useRef(false);
  const touchY = useRef<number | null>(null);
  const termActive = useRef(false);
  const tourRef = useRef(false);
  const tourTimer = useRef<number | null>(null);
  const dismissTimer = useRef<number | null>(null);

  const [focus, setFocus] = useState(-1);
  const [panel, setPanel] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [vimFile, setVimFile] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);

  const clearDismiss = () => {
    if (dismissTimer.current != null) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  };

  /** Slowly fade the panel away and dolly back out to the globe. */
  const dismiss = () => {
    clearDismiss();
    setPanel(null);
    gsap.to(globeState, {
      zoom: 0,
      duration: reduced.current ? 0 : 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        globeState.idle = true;
      },
    });
  };

  /** Spin to a target (-1 = home/overview), then dive in + reveal the panel. */
  const fly = (t: number) => {
    tl.current?.kill();
    clearDismiss();
    focusRef.current = t;
    setFocus(t);
    setPanel(null);
    setHover(null);
    globeState.idle = false;
    animating.current = true;
    sfx.unlockAudio();
    sfx.whoosh();

    const r = reduced.current;
    const finalRy =
      t < 0
        ? globeState.ry + TWO_PI
        : forwardRy(targetRotation(t).ry, globeState.ry, 1);
    const finalRx = t < 0 ? 0 : targetRotation(t).rx;

    tl.current = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        if (t < 0) globeState.idle = true;
      },
    });
    tl.current.to(globeState, {
      ry: finalRy,
      rx: finalRx,
      duration: r ? 0 : 1.2,
      ease: "power3.inOut",
    });

    if (t >= 0) {
      tl.current.add(() => sfx.land());
      tl.current.to(globeState, {
        zoom: 1,
        duration: r ? 0 : 0.55,
        ease: "power2.in",
        onStart: () => sfx.zoomSfx(),
      });
      tl.current.add(() => {
        setPanel(t);
        animating.current = false;
        // outside an auto-tour, hold the section then fade it back to the globe
        if (!tourRef.current) {
          clearDismiss();
          dismissTimer.current = window.setTimeout(dismiss, PANEL_HOLD);
        }
      });
    } else {
      tl.current.to(globeState, { zoom: 0, duration: r ? 0 : 0.6, ease: "power2.out" });
    }
  };

  const go = (target: number, style: NavStyle = "cd") => {
    const t = Math.max(-1, Math.min(FRAMES.length - 1, target));
    if (style === "vim" && t >= 0) {
      sfx.unlockAudio();
      sfx.blip(520);
      setVimFile(FRAMES[t].file);
      window.setTimeout(
        () => {
          setVimFile(null);
          fly(t);
        },
        reduced.current ? 0 : 600
      );
    } else {
      fly(t);
    }
  };

  const next = () => go(focusRef.current < 0 ? 0 : focusRef.current + 1);
  const prev = () => go(focusRef.current <= 0 ? -1 : focusRef.current - 1);

  /** Auto-play tour: visit every section in turn, lingering on each. */
  const stopTour = () => {
    if (tourTimer.current != null) {
      clearTimeout(tourTimer.current);
      tourTimer.current = null;
    }
    if (tourRef.current) {
      tourRef.current = false;
      setTouring(false);
    }
  };

  const startTour = () => {
    if (tourRef.current) return;
    tourRef.current = true;
    setTouring(true);
    sfx.unlockAudio();
    let i = 0;
    const step = () => {
      if (!tourRef.current) return;
      go(i, "open");
      const last = i >= FRAMES.length - 1;
      i += 1;
      tourTimer.current = window.setTimeout(() => {
        if (!tourRef.current) return;
        if (last) {
          stopTour();
          go(-1);
        } else {
          step();
        }
      }, TOUR_DWELL);
    };
    step();
  };

  // user-initiated navigation cancels any running tour
  const mGo = (t: number, style: NavStyle = "cd") => {
    stopTour();
    go(t, style);
  };
  const mNext = () => {
    stopTour();
    next();
  };
  const mPrev = () => {
    stopTour();
    prev();
  };

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // input + page/Lenis lock + audio unlock
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest?.("[data-terminal]")) return;
      e.preventDefault();
      if (animating.current) {
        accum.current = 0;
        return;
      }
      accum.current += e.deltaY;
      if (accum.current > WHEEL_STEP) {
        accum.current = 0;
        mNext();
      } else if (accum.current < -WHEEL_STEP) {
        accum.current = 0;
        mPrev();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`") {
        e.preventDefault();
        setTermOpen((o) => !o);
        return;
      }
      if (termActive.current) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          mNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          mPrev();
          break;
        case "Escape":
        case "Home":
          mGo(-1);
          break;
        default:
          if (/^[1-9]$/.test(e.key)) {
            const i = parseInt(e.key, 10) - 1;
            if (i < FRAMES.length) mGo(i);
          }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current == null) return;
      if ((e.target as HTMLElement)?.closest?.("[data-terminal]")) return;
      const dy = touchY.current - (e.changedTouches[0]?.clientY ?? touchY.current);
      if (Math.abs(dy) > 60) (dy > 0 ? mNext : mPrev)();
      touchY.current = null;
    };

    const unlock = () => sfx.unlockAudio();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } })
      .lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      html.style.overflow = prevOverflow;
      lenis?.start();
      if (tourTimer.current != null) clearTimeout(tourTimer.current);
      if (dismissTimer.current != null) clearTimeout(dismissTimer.current);
    };
  }, []);

  const onHoverMarker = (i: number | null) => {
    setHover((prevH) => {
      if (i !== null && i !== prevH) sfx.blip(720);
      return i;
    });
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* sky */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_50%_0%,#FFFFFF_0%,#EAF5F1_42%,#E4ECF5_100%)]" />

      {/* planet */}
      <Canvas
        className="absolute inset-0"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.6], fov: 45 }}
      >
        <GlobeScene
          focus={focus}
          hover={hover}
          labels={panel === null}
          onPick={(i) => {
            sfx.blip(700);
            mGo(i, "open");
          }}
          onHover={onHoverMarker}
        />
      </Canvas>

      {/* section panel — rises up, fully covers the globe, holds, then zooms out */}
      <AnimatePresence>
        {panel !== null && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-20 bg-[#EEF3F8]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {panel !== null && (
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-30"
            style={{ transformOrigin: "center" }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0, scale: 1 }}
              exit={{ scale: 0.55, transition: { duration: 0.7, ease: "easeIn" } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full origin-center"
            >
              <FrameContent index={panel} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* vim takeover */}
      {vimFile && (
        <div className="absolute inset-0 z-[60] flex flex-col bg-[#0B1320] font-mono text-[13px] text-[#cfe9df]">
          <div className="flex-1 overflow-hidden p-6">
            <div className="text-[#46586b]">&quot;{vimFile}&quot; [readonly] — loading buffer…</div>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="text-[#33425c]">
                {String(i + 1).padStart(3, " ")} <span className="text-[#46586b]">~</span>
              </div>
            ))}
          </div>
          <div className="bg-emerald-400/90 px-4 py-1 text-xs font-semibold text-[#04110b]">
            -- NORMAL -- &nbsp; {vimFile} &nbsp; unix · utf-8 &nbsp; 100%
          </div>
        </div>
      )}

      {/* ── HUD ── */}
      {panel === null && (
        <button
          onClick={() => mGo(-1)}
          className="absolute left-6 top-5 z-50 font-display text-sm font-semibold tracking-wide text-moon"
        >
          Mohak<span className="text-accent">.</span>
        </button>
      )}

      <div className="absolute right-6 top-4 z-50 flex items-center gap-2">
        <button
          onClick={() => (touring ? stopTour() : startTour())}
          className={clsx(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-md transition-colors",
            touring
              ? "border-accent bg-accent/15 text-accent"
              : "border-ink-600 bg-white/60 text-moon hover:border-accent hover:text-accent"
          )}
        >
          {touring ? "■ Stop tour" : "▶ Tour"}
        </button>
        <button
          onClick={() => {
            const m = sfx.toggleMute();
            setMuted(m);
            if (!m) sfx.blip(660);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-600 bg-white/60 text-sm backdrop-blur-md transition-colors hover:border-accent"
        >
          {muted ? "🔇" : "🔊"}
        </button>
        {focus >= 0 && !touring && (
          <button
            onClick={() => mGo(-1)}
            className="flex items-center gap-2 rounded-full border border-ink-600 bg-white/60 px-4 py-2 text-xs font-semibold text-moon backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          >
            ⌂ Home
          </button>
        )}
      </div>

      {panel === null && (
      <div className="absolute inset-x-0 top-4 z-40 flex flex-col items-center gap-2 px-4">
        <div className="glass flex items-center gap-1 rounded-full px-2.5 py-1.5">
          <button
            onClick={mPrev}
            aria-label="Previous"
            className="grid h-7 w-7 place-items-center rounded-full text-slate-300 transition-colors hover:bg-accent/15 hover:text-accent"
          >
            ←
          </button>
          <button
            onClick={() => mGo(-1)}
            aria-label="Home"
            className={clsx(
              "grid h-7 w-7 place-items-center rounded-full text-sm transition-colors",
              focus < 0 ? "bg-accent/15 text-accent" : "text-slate-300 hover:text-moon"
            )}
          >
            ⌂
          </button>
          <span className="mx-1 hidden font-mono text-xs text-slate-400 sm:inline">
            {pathLabel(focus)}
          </span>
          <span className="mx-1 h-4 w-px bg-ink-600" />
          {FRAMES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => mGo(i, "open")}
              title={f.label}
              className={clsx(
                "h-7 rounded-full px-2 text-xs font-medium transition-colors",
                focus === i ? "bg-accent/15 text-accent" : "text-slate-300 hover:text-moon"
              )}
            >
              <span className="hidden md:inline">{f.label}</span>
              <span className="md:hidden">{i + 1}</span>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-ink-600" />
          <button
            onClick={mNext}
            aria-label="Next"
            className="grid h-7 w-7 place-items-center rounded-full text-slate-300 transition-colors hover:bg-accent/15 hover:text-accent"
          >
            →
          </button>
        </div>
        {hover !== null && panel === null && (
          <span className="rounded-full bg-moon/80 px-3 py-1 font-mono text-xs text-white">
            → {FRAMES[hover].label}
          </span>
        )}
      </div>
      )}

      <Terminal
        focus={focus}
        open={termOpen}
        onOpenChange={setTermOpen}
        onActiveChange={(a) => (termActive.current = a)}
        onNavigate={(target, style) => mGo(target, style)}
        onTour={startTour}
        onStopTour={stopTour}
      />
    </div>
  );
}
