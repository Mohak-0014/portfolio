"use client";

import { motion } from "framer-motion";

/**
 * A per-station background — a flat-illustration of the actual area you're in:
 * passport booths, the check-in desk, the X-ray belt, the cabin, etc.
 * Drawn entirely in CSS so there are no image assets to ship.
 */

const WALL = "linear-gradient(180deg,#eef3f7 0%,#e7ece9 100%)";
const FLOOR = "linear-gradient(180deg,#d8d1c2 0%,#c8c0af 100%)";
const SIGN = "#12303a";
const METAL = "#aab4bf";
const METAL_D = "#8a96a3";
const GLASS = "rgba(150,200,230,0.5)";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: WALL }} />
      <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: FLOOR }} />
      <div className="absolute inset-x-0 bottom-[34%] h-[2px] bg-black/10" />
      {children}
      {/* soft ceiling + ambient */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
    </div>
  );
}

function OverheadSign({ children, x = "50%" }: { children: React.ReactNode; x?: string }) {
  return (
    <div
      className="absolute top-[7%] -translate-x-1/2 rounded bg-[#12303a] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f1ece1] shadow-md"
      style={{ left: x }}
    >
      {/* hanging rods */}
      <span className="absolute -top-3 left-3 h-3 w-px bg-black/30" />
      <span className="absolute -top-3 right-3 h-3 w-px bg-black/30" />
      {children}
    </div>
  );
}

export default function StationScene({ id, accent }: { id: string; accent: string }) {
  /* ── 1. Terminal entrance — glass facade + automatic doors ── */
  if (id === "entrance") {
    return (
      <Base>
        <div className="absolute inset-x-0 top-0 flex h-[66%]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-white/60" style={{ background: "linear-gradient(180deg,#cfe7f6,#eaf4fb)" }} />
          ))}
        </div>
        <OverheadSign>✈ Departures</OverheadSign>
        {/* automatic sliding doors */}
        <div className="absolute bottom-[34%] left-1/2 h-[42%] w-[24%] -translate-x-1/2 overflow-hidden rounded-t-md border-[6px] border-[#9aa6b2]" style={{ background: GLASS }}>
          <motion.div className="absolute inset-y-0 left-0 w-1/2 border-r border-white/60 bg-[#b8c6d2]" animate={{ x: ["0%", "-22%", "0%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-y-0 right-0 w-1/2 border-l border-white/60 bg-[#b8c6d2]" animate={{ x: ["0%", "22%", "0%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        {/* welcome mat */}
        <div className="absolute bottom-[10%] left-1/2 h-3 w-[30%] -translate-x-1/2 rounded-full" style={{ background: accent, opacity: 0.8 }} />
        {/* plants */}
        {["38%", "62%"].map((x) => (
          <div key={x} className="absolute bottom-[34%] h-12 w-10 -translate-x-1/2" style={{ left: x }}>
            <div className="mx-auto h-8 w-8 rounded-full bg-[#6aa67a]" />
            <div className="mx-auto h-4 w-6 rounded-b bg-[#caa56b]" />
          </div>
        ))}
      </Base>
    );
  }

  /* ── 2. Passport control — row of booths + queue ── */
  if (id === "passport") {
    return (
      <Base>
        <OverheadSign>Immigration</OverheadSign>
        <div className="absolute bottom-[34%] left-0 right-0 flex items-end justify-center gap-[4%] px-[8%]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative h-40 w-[18%]">
              {/* glass screen */}
              <div className="absolute inset-x-1 top-0 h-24 rounded-t-md border border-white/70" style={{ background: GLASS }} />
              {/* booth number */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: accent }}>
                {i + 1}
              </div>
              {/* desk */}
              <div className="absolute bottom-0 left-0 right-0 h-16 rounded-sm" style={{ background: METAL }} />
              <div className="absolute bottom-10 left-2 h-5 w-8 rounded-sm" style={{ background: `${accent}` }} />
            </div>
          ))}
        </div>
        {/* queue stanchions */}
        <div className="absolute bottom-[12%] left-0 right-0 flex items-center justify-center gap-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <div className="h-10 w-1.5 rounded bg-[#7a8693]" />
              <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ background: accent }} />
              {i < 3 && <div className="absolute top-1 left-2 h-px w-12 bg-[#b03a4a]/70" />}
            </div>
          ))}
        </div>
      </Base>
    );
  }

  /* ── 3. Check-in — long counter desk + scale ── */
  if (id === "checkin") {
    return (
      <Base>
        <OverheadSign>Check-in · A1–A8</OverheadSign>
        {/* back wall counter-number panels */}
        <div className="absolute left-[10%] right-[10%] top-[24%] flex justify-between">
          {["A1", "A2", "A3", "A4", "A5"].map((n) => (
            <div key={n} className="rounded px-2 py-1 text-[10px] font-bold text-white shadow" style={{ background: accent }}>{n}</div>
          ))}
        </div>
        {/* the long desk */}
        <div className="absolute bottom-[34%] left-[6%] right-[6%] h-20 rounded-t-md" style={{ background: `linear-gradient(180deg,${METAL},${METAL_D})` }} />
        <div className="absolute bottom-[44%] left-[6%] right-[6%] h-2 bg-white/50" />
        {/* monitors on the desk */}
        {["18%", "38%", "58%"].map((x) => (
          <div key={x} className="absolute bottom-[40%] h-7 w-10" style={{ left: x }}>
            <div className="h-5 w-full rounded-sm border border-black/20" style={{ background: `${accent}cc` }} />
            <div className="mx-auto h-1.5 w-3 bg-[#7a8693]" />
          </div>
        ))}
        {/* baggage scale + belt at the right */}
        <div className="absolute bottom-[16%] right-[10%] h-3 w-24 rounded" style={{ background: METAL_D }} />
        <div className="absolute bottom-[19%] right-[12%] h-6 w-12 rounded-sm" style={{ background: accent, opacity: 0.85 }} />
      </Base>
    );
  }

  /* ── 4. Security — metal detector + X-ray belt ── */
  if (id === "security") {
    return (
      <Base>
        <OverheadSign>Security</OverheadSign>
        {/* metal detector arch */}
        <div className="absolute bottom-[34%] left-[26%] h-44 w-28 -translate-x-1/2 rounded-t-[40px] border-[10px] border-[#9aa6b2]" style={{ borderBottom: "none" }} />
        <div className="absolute bottom-[34%] left-[26%] h-1.5 w-8 -translate-x-1/2" style={{ background: accent }} />
        {/* X-ray machine + conveyor */}
        <div className="absolute bottom-[34%] right-[12%] h-24 w-32 rounded-md" style={{ background: `linear-gradient(180deg,${METAL},${METAL_D})` }} />
        <div className="absolute bottom-[40%] right-[16%] h-12 w-20 overflow-hidden rounded-sm bg-[#0b3a2e]">
          {/* scan glow */}
          <motion.div className="absolute inset-y-0 w-6" style={{ background: `linear-gradient(90deg,transparent,${accent}aa,transparent)` }} animate={{ left: ["-20%", "120%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
        </div>
        {/* belt with trays */}
        <div className="absolute bottom-[31%] right-[6%] h-3 w-[46%] rounded" style={{ background: METAL_D }} />
        {["12%", "26%", "40%"].map((r) => (
          <div key={r} className="absolute bottom-[33%] h-3 w-8 rounded-sm bg-[#c8763a]" style={{ right: r }} />
        ))}
      </Base>
    );
  }

  /* ── 5. Departure lounge — windows, seats, gate desk ── */
  if (id === "lounge") {
    return (
      <Base>
        <OverheadSign>Gate 7</OverheadSign>
        {/* windows with plane tail */}
        <div className="absolute inset-x-0 top-[14%] flex h-[42%] px-[6%]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-white/60" style={{ background: "linear-gradient(180deg,#cfe7f6,#eef6fb)" }} />
          ))}
        </div>
        {/* plane tail outside */}
        <div className="absolute left-[16%] top-[30%] h-20 w-12 -skew-x-[18deg] rounded-t-md" style={{ background: accent }} />
        <div className="absolute left-[14%] top-[48%] h-3 w-28 -skew-x-[30deg] bg-[#dfe3e8]" />
        {/* row of waiting seats */}
        <div className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-8 w-10 rounded-t-md" style={{ background: i % 2 ? METAL : accent, opacity: 0.85 }} />
              <div className="h-2 w-10 bg-[#7a8693]" />
              <div className="h-4 w-1 bg-[#7a8693]" />
            </div>
          ))}
        </div>
        {/* gate desk */}
        <div className="absolute bottom-[14%] right-[10%] h-14 w-24 rounded-t-md" style={{ background: METAL }} />
        <div className="absolute bottom-[24%] right-[14%] h-5 w-12 rounded-sm" style={{ background: `${accent}cc` }} />
      </Base>
    );
  }

  /* ── 6. Newsstand — magazine shelves + counter ── */
  if (id === "newsstand") {
    const mags = ["#e05a6e", "#2a7db5", "#d98a1f", "#1fa37a", "#7c5cd0", "#0e9aae", "#ef6b75", "#36b37e"];
    return (
      <Base>
        <OverheadSign>News · Books</OverheadSign>
        {/* shelves */}
        {[20, 34, 48].map((top) => (
          <div key={top} className="absolute left-[12%] right-[12%] flex h-10 items-end gap-1" style={{ top: `${top}%` }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className="flex-1 rounded-t-sm" style={{ height: 18 + ((i * 7) % 16), background: mags[(i + top) % mags.length] }} />
            ))}
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#9aa6b2]" />
          </div>
        ))}
        {/* counter + register */}
        <div className="absolute bottom-[34%] left-[20%] right-[20%] h-16 rounded-t-md" style={{ background: `linear-gradient(180deg,${METAL},${METAL_D})` }} />
        <div className="absolute bottom-[44%] left-[26%] h-6 w-9 rounded-sm" style={{ background: accent }} />
      </Base>
    );
  }

  /* ── 7. Cabin — bins, windows with clouds, seats ── */
  if (id === "cabin") {
    return (
      <Base>
        {/* warm cabin tint */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg,#f3ece6,${accent}10)` }} />
        {/* overhead bins */}
        <div className="absolute inset-x-0 top-0 h-[20%] rounded-b-[60px] border-b-4 border-[#cfd6dc] bg-[#e7ebef]" />
        <div className="absolute left-1/2 top-[8%] h-1.5 w-10 -translate-x-1/2 rounded-full" style={{ background: accent }} />
        {/* left wall windows with clouds */}
        <div className="absolute left-[6%] top-[26%] flex flex-col gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative h-12 w-16 overflow-hidden rounded-[40%] border-4 border-[#cfd6dc] bg-sky-200">
              <motion.span className="absolute h-3 w-8 rounded-full bg-white" style={{ top: "30%" }} initial={{ x: 64 }} animate={{ x: -50 }} transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 0.7 }} />
            </div>
          ))}
        </div>
        {/* seat rows */}
        <div className="absolute bottom-[10%] right-[8%] flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-16 w-12 rounded-t-xl" style={{ background: i === 0 ? accent : "#5b6675", opacity: 0.9 }} />
              <div className="h-2 w-12 bg-[#3f4754]" />
            </div>
          ))}
        </div>
      </Base>
    );
  }

  /* ── 8. Arrivals — baggage carousel + greeters ── */
  return (
    <Base>
      <OverheadSign>Arrivals · Baggage</OverheadSign>
      {/* arrivals board */}
      <div className="absolute right-[10%] top-[16%] w-40 rounded bg-[#12303a] p-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-1 flex gap-1 last:mb-0">
            <span className="h-2 w-10 rounded-sm" style={{ background: accent, opacity: 0.8 }} />
            <span className="h-2 flex-1 rounded-sm bg-[#f1ece1]/60" />
          </div>
        ))}
      </div>
      {/* baggage carousel */}
      <div className="absolute bottom-[12%] left-1/2 h-28 w-[46%] -translate-x-1/2 rounded-[50%] border-[14px] border-[#9aa6b2]" style={{ background: "#cfc7b6" }}>
        {/* suitcases riding the belt */}
        {[
          { l: "8%", t: "6%", c: accent },
          { l: "60%", t: "2%", c: "#c8763a" },
          { l: "78%", t: "60%", c: "#5b6675" },
          { l: "24%", t: "70%", c: "#2a7db5" },
        ].map((s, i) => (
          <div key={i} className="absolute h-6 w-8 rounded-md shadow" style={{ left: s.l, top: s.t, background: s.c }} />
        ))}
      </div>
      {/* greeter with name sign */}
      <div className="absolute bottom-[34%] left-[14%]">
        <div className="mx-auto h-6 w-6 rounded-full bg-[#caa56b]" />
        <div className="h-8 w-5 rounded-b bg-[#5b6675]" />
        <div className="absolute -top-4 left-6 -rotate-2 rounded bg-white px-2 py-0.5 text-[9px] font-bold text-slate-700 shadow">MOHAK</div>
      </div>
    </Base>
  );
}
