import * as THREE from "three";

/** Soft radial puff (white core → transparent). Used for clouds + sun glow. */
export function makePuffTexture(): THREE.Texture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.72)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Vertical "gore" stripes for a hot-air-balloon envelope. The bands run
 * along the texture's U axis, which wraps around the sphere pole-to-pole —
 * exactly how real balloon panels are seamed. A soft top→bottom shade adds
 * a little roundness on top of the scene lighting.
 */
export function makeGoreTexture(a: string, b: string, bands = 14): THREE.Texture {
  const w = 1024;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const bw = w / bands;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = i % 2 === 0 ? a : b;
    ctx.fillRect(i * bw, 0, bw + 1, h);
  }

  // subtle vertical shading: brighter near the crown, deeper toward the throat
  const shade = ctx.createLinearGradient(0, 0, 0, h);
  shade.addColorStop(0, "rgba(255,255,255,0.28)");
  shade.addColorStop(0.4, "rgba(255,255,255,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
