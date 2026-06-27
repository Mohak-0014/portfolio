import { sections } from "@/data/content";

/**
 * ───────────────────────────────────────────────────────────────
 *  The flight plan. One floating island per page section, laid out
 *  left-to-right along the sky. The hot-air balloon rests on the
 *  island of whatever section you're reading, then takes off, arcs
 *  across the gap, and lands on the next island as you scroll.
 * ───────────────────────────────────────────────────────────────
 */

/** Horizontal distance between neighbouring islands (world units). */
export const SPACING = 8.5;

/** Height of an island's flat top above its local origin. The balloon
 *  basket rests here when "landed". */
export const ISLAND_TOP = 0.4;

/** How high the balloon climbs at the midpoint of a hop between islands. */
export const HOP_LIFT = 3.4;

export type IslandDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  accent: string;
  /** stable per-island seed for idle bobbing / decoration variety */
  seed: number;
};

/** Bright, on-brand emerald → teal → sky spread, one tint per island. */
const ACCENTS = [
  "#10B981",
  "#34D399",
  "#2DD4BF",
  "#5EEAD4",
  "#38BDF8",
  "#22D3EE",
  "#14B8A6",
  "#6EE7B7",
];

export const ISLANDS: IslandDef[] = sections.map((s, i) => ({
  id: s.id,
  label: s.label,
  x: i * SPACING,
  // gentle up/down drift so the flight feels like real terrain, not a line
  y: -0.6 + Math.sin(i * 1.25) * 1.25,
  // a little depth variation for parallax between foreground/back islands
  z: -3 + Math.sin(i * 0.7) * 1.4,
  accent: ACCENTS[i % ACCENTS.length],
  seed: i * 1.618,
}));

export const LAST_INDEX = ISLANDS.length - 1;

/** Smoothstep — eases the horizontal glide between two islands. */
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

export type FlightPose = {
  x: number;
  y: number;
  z: number;
  /** lean angle (radians) in the direction of travel — 0 when landed */
  lean: number;
  /** 0 landed → 1 at the top of a hop; drives flame + idle damping */
  airborne: number;
};

/**
 * Resolve the balloon's pose from global scroll progress (0..1).
 * At every island centre the balloon is landed (airborne = 0); halfway
 * between two islands it is at the peak of its arc (airborne = 1).
 */
export function flightPose(progress: number): FlightPose {
  const f = Math.max(0, Math.min(LAST_INDEX, progress * LAST_INDEX));
  const i0 = Math.min(LAST_INDEX - 1, Math.floor(f));
  const local = f - i0; // 0..1 within the current hop
  const a = ISLANDS[i0];
  const b = ISLANDS[i0 + 1];

  const e = smooth(local);
  const x = a.x + (b.x - a.x) * e;
  const z = a.z + (b.z - a.z) * e;
  const groundY = a.y + (b.y - a.y) * e + ISLAND_TOP;

  // a clean half-sine arc: 0 on the islands, peak in the middle of the hop
  const airborne = Math.sin(Math.PI * local);
  const y = groundY + airborne * HOP_LIFT;

  // lean into the travel direction, strongest while cruising
  const dir = Math.sign(b.x - a.x) || 1;
  const lean = -dir * airborne * 0.16;

  return { x, y, z, lean, airborne };
}
