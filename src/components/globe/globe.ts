/**
 * ───────────────────────────────────────────────────────────────
 *  GLOBE — geometry + camera math + shared state
 *
 *  Each section is a marker pinned to a latitude/longitude on the planet.
 *  Navigation spins the globe so the target marker faces the camera, then
 *  dives in. The render loop reads `globeState` every frame (no React churn).
 * ───────────────────────────────────────────────────────────────
 */

import { FRAMES } from "../prezi/frames";

export const GLOBE_R = 2.2;

export type Geo = { lat: number; lon: number };

/** Where each section lives on the planet (index matches FRAMES). */
export const GEO: Geo[] = [
  { lat: 10, lon: 0 }, // hero
  { lat: -16, lon: 46 }, // about
  { lat: 16, lon: 95 }, // projects
  { lat: -8, lon: 148 }, // skills
  { lat: 20, lon: 200 }, // hobbies
  { lat: -18, lon: 248 }, // sidequests
  { lat: 8, lon: 300 }, // blog
  { lat: -10, lon: 340 }, // contact
];

export const SECTIONS = FRAMES.map((f, i) => ({ ...f, ...GEO[i] }));

const D2R = Math.PI / 180;

/** 3D position of a marker on the sphere surface. */
export function markerPosition(i: number, r = GLOBE_R): [number, number, number] {
  const { lat, lon } = GEO[i];
  const phi = (90 - lat) * D2R;
  const theta = lon * D2R;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

/**
 * Globe rotation (Euler XYZ: Ry then Rx) that brings marker `i` to the front,
 * centred and facing the camera at +Z.
 */
export function targetRotation(i: number): { rx: number; ry: number } {
  const { lat, lon } = GEO[i];
  return { ry: lon * D2R - Math.PI / 2, rx: lat * D2R };
}

/**
 * Resolve an absolute target Y-rotation that always winds *forward* from the
 * current angle by at least a half-turn, plus `spins` extra full turns — the
 * "rapid spin" before it lands.
 */
export function forwardRy(target: number, current: number, spins = 1): number {
  let f = target;
  const TWO_PI = Math.PI * 2;
  while (f < current + Math.PI) f += TWO_PI;
  return f + TWO_PI * spins;
}

/** Live state the render loop reads each frame. */
export const globeState = {
  rx: 0,
  ry: 0,
  zoom: 0, // 0 = far / overview, 1 = dived into a section
  idle: true, // slow auto-spin at overview
};
