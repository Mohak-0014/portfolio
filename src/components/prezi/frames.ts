/**
 * ───────────────────────────────────────────────────────────────
 *  PREZI WORLD — layout + camera math
 *
 *  Everything lives on one big 2D "canvas" (world coordinates, in px).
 *  A laptop is drawn in the middle; each section is a window-tile sitting
 *  on the laptop's screen in a grid. The camera (a CSS transform on the
 *  world) flies between the whole-laptop "overview" and a single tile.
 * ───────────────────────────────────────────────────────────────
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type Camera = { tx: number; ty: number; s: number };

/** One window-tile per section. `id` matches the section id in content.ts. */
export const FRAMES = [
  { id: "hero", label: "Hello", file: "welcome.tsx", icon: "👋" },
  { id: "about", label: "About", file: "about.md", icon: "🧭" },
  { id: "projects", label: "Work", file: "projects/", icon: "🛠" },
  { id: "skills", label: "Skills", file: "stack.json", icon: "⚡" },
  { id: "hobbies", label: "Life", file: "offline.tsx", icon: "🎧" },
  { id: "sidequests", label: "Sidequests", file: "sidequests.log", icon: "🎲" },
  { id: "blog", label: "Blog", file: "writing/", icon: "✍️" },
  { id: "contact", label: "Contact", file: "contact.sh", icon: "✉️" },
] as const;

export type FrameId = (typeof FRAMES)[number]["id"];

/* ---- grid geometry (world units = px) ---- */
export const FRAME_W = 1520;
export const FRAME_H = 1040;
const GAP_X = 240;
const GAP_Y = 240;
const COLS = 4;

const ROWS = Math.ceil(FRAMES.length / COLS);
const GRID_W = COLS * FRAME_W + (COLS - 1) * GAP_X;
const GRID_H = ROWS * FRAME_H + (ROWS - 1) * GAP_Y;

/** World rect for a single tile by index. */
export function frameRect(i: number): Rect {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    x: col * (FRAME_W + GAP_X),
    y: row * (FRAME_H + GAP_Y),
    w: FRAME_W,
    h: FRAME_H,
  };
}

/* ---- laptop chrome geometry, wrapped around the grid ---- */
const SCREEN_PAD = 300; // wallpaper margin around the grid
export const BEZEL = 72;
const DECK_H = 360;
const DECK_OVERHANG = 280;

/** The lit screen area (wallpaper + tiles). */
export const SCREEN: Rect = {
  x: -SCREEN_PAD,
  y: -SCREEN_PAD,
  w: GRID_W + SCREEN_PAD * 2,
  h: GRID_H + SCREEN_PAD * 2,
};

/** The bezel/panel around the screen. */
export const PANEL: Rect = {
  x: SCREEN.x - BEZEL,
  y: SCREEN.y - BEZEL,
  w: SCREEN.w + BEZEL * 2,
  h: SCREEN.h + BEZEL * 2,
};

/** The keyboard deck below the screen. */
export const DECK: Rect = {
  x: PANEL.x - DECK_OVERHANG,
  y: PANEL.y + PANEL.h,
  w: PANEL.w + DECK_OVERHANG * 2,
  h: DECK_H,
};

/** Union of panel + deck — the framing used for the "home" overview. */
export const LAPTOP: Rect = {
  x: DECK.x,
  y: PANEL.y,
  w: DECK.w,
  h: DECK.y + DECK.h - PANEL.y,
};

/**
 * Camera that frames `rect` inside a `vw × vh` viewport, filling `pad`
 * (0..1) of the smaller dimension. transform-origin is the world's (0,0).
 */
export function fit(rect: Rect, vw: number, vh: number, pad: number): Camera {
  const s = pad * Math.min(vw / rect.w, vh / rect.h);
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  return { s, tx: vw / 2 - cx * s, ty: vh / 2 - cy * s };
}

export const OVERVIEW_PAD = 0.82;
export const FRAME_PAD = 0.92;

/** Camera for a target: -1 → laptop overview, else the tile at that index. */
export function cameraFor(target: number, vw: number, vh: number): Camera {
  return target < 0
    ? fit(LAPTOP, vw, vh, OVERVIEW_PAD)
    : fit(frameRect(target), vw, vh, FRAME_PAD);
}

/** World rect for a target (-1 → whole laptop). */
export function targetRect(target: number): Rect {
  return target < 0 ? LAPTOP : frameRect(target);
}

/** Smallest rect containing both — used for the fly-through midpoint. */
export function union(a: Rect, b: Rect): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const r = Math.max(a.x + a.w, b.x + b.w);
  const bm = Math.max(a.y + a.h, b.y + b.h);
  return { x, y, w: r - x, h: bm - y };
}

/** Breadcrumb path for the prompt / HUD. -1 → "~". */
export function pathLabel(target: number): string {
  return target < 0 ? "~" : `~/${FRAMES[target].label.toLowerCase()}`;
}
