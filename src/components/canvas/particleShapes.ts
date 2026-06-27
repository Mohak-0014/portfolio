/**
 * ───────────────────────────────────────────────────────────────
 *  Point-cloud "shapes" for the living particle field. Each section
 *  of the page gets one shape; the field morphs between them as you
 *  scroll. Every generator returns a flat Float32Array of `count`
 *  positions (x,y,z) centred on the origin.
 *
 *  2D glyphs/icons are sampled from a hidden canvas (draw anything,
 *  keep the lit pixels); a couple of shapes are pure procedural 3D.
 * ───────────────────────────────────────────────────────────────
 */

const SPAN_X = 8.4;
const SPAN_Y = 5.2;
const DEPTH = 0.9;

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/** Sample `count` points from whatever opaque pixels `draw` paints. */
function canvasShape(draw: Draw, count: number, depth = DEPTH): Float32Array {
  const w = 260;
  const h = 160;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  draw(ctx, w, h);

  const data = ctx.getImageData(0, 0, w, h).data;
  const lit: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 128) lit.push(x, y);
    }
  }

  const out = new Float32Array(count * 3);
  const n = lit.length / 2;
  for (let i = 0; i < count; i++) {
    let px = w / 2;
    let py = h / 2;
    if (n > 0) {
      const k = (Math.random() * n) | 0;
      px = lit[k * 2];
      py = lit[k * 2 + 1];
    }
    out[i * 3] = (px / w - 0.5) * SPAN_X;
    out[i * 3 + 1] = -(py / h - 0.5) * SPAN_Y;
    out[i * 3 + 2] = (Math.random() - 0.5) * depth;
  }
  return out;
}

/** Bold text glyph (initials, code brackets, words…). Auto-shrinks to fit. */
export function glyphShape(text: string, count: number, size = 130): Float32Array {
  return canvasShape((ctx, w, h) => {
    const maxW = w * 0.86;
    let fs = size;
    ctx.font = `800 ${fs}px "Segoe UI", Arial, sans-serif`;
    const tw = ctx.measureText(text).width;
    if (tw > maxW) fs = (fs * maxW) / tw;
    ctx.font = `800 ${fs}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2 + fs * 0.04);
  }, count);
}

/** Emoji icon (uses the platform colour-emoji font; we only keep the shape). */
export function emojiShape(emoji: string, count: number, size = 120): Float32Array {
  return canvasShape((ctx, w, h) => {
    ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, w / 2, h / 2);
  }, count);
}

/** A fibonacci-sphere (the "ball" / cricket ball). */
export function sphereShape(count: number, r = 2.0): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * rad * r;
    out[i * 3 + 1] = y * r;
    out[i * 3 + 2] = Math.sin(theta) * rad * r;
  }
  return out;
}

/** A ring / torus facing the camera (the "orbit" of curiosity). */
export function torusShape(count: number, R = 2.3, r = 0.55): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    out[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    out[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    out[i * 3 + 2] = r * Math.sin(v);
  }
  return out;
}

/** A little feed-forward neural network: layered nodes + edges. */
export function neuralShape(count: number): Float32Array {
  return canvasShape((ctx, w, h) => {
    const layers = [4, 6, 6, 3];
    const margin = 36;
    const nodes: [number, number][][] = layers.map((nodeCount, li) => {
      const x = margin + (li / (layers.length - 1)) * (w - margin * 2);
      const gap = (h - margin * 2) / (nodeCount - 1 || 1);
      return Array.from({ length: nodeCount }, (_, ni) => [
        x,
        nodeCount === 1 ? h / 2 : margin + ni * gap,
      ]) as [number, number][];
    });
    // edges
    ctx.lineWidth = 1.6;
    for (let li = 0; li < nodes.length - 1; li++) {
      for (const a of nodes[li]) {
        for (const b of nodes[li + 1]) {
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
      }
    }
    // nodes
    for (const layer of nodes) {
      for (const [x, y] of layer) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, count);
}

/** A paper-plane dart (sidequests / bucket list). */
export function planeShape(count: number): Float32Array {
  return canvasShape((ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    ctx.beginPath();
    ctx.moveTo(cx + 95, cy); // nose
    ctx.lineTo(cx - 95, cy - 55); // top tail
    ctx.lineTo(cx - 45, cy); // mid notch
    ctx.lineTo(cx - 95, cy + 55); // bottom tail
    ctx.closePath();
    ctx.fill();
    // centre fold line
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cx + 95, cy);
    ctx.lineTo(cx - 45, cy);
    ctx.stroke();
  }, count);
}

/** Stacked ruled lines — a written page (blog). */
export function pageShape(count: number): Float32Array {
  return canvasShape((ctx, w, h) => {
    const widths = [0.8, 0.95, 0.7, 0.9, 0.55];
    const top = 36;
    const gap = (h - top * 2) / (widths.length - 1);
    ctx.lineCap = "round";
    ctx.lineWidth = 11;
    widths.forEach((frac, i) => {
      const y = top + i * gap;
      const len = (w - 80) * frac;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(40 + len, y);
      ctx.stroke();
    });
  }, count);
}

/** An envelope outline with its flap (contact). */
export function envelopeShape(count: number): Float32Array {
  return canvasShape((ctx, w, h) => {
    const x0 = 50;
    const y0 = 38;
    const x1 = w - 50;
    const y1 = h - 38;
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // flap
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo((x0 + x1) / 2, (y0 + y1) / 2);
    ctx.lineTo(x1, y0);
    ctx.stroke();
  }, count);
}

/* Official single-path marks (24×24 viewBox), from simple-icons. */
const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

function drawIcon(ctx: CanvasRenderingContext2D, path: string, cx: number, cy: number, size: number) {
  const p = new Path2D(path);
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 24, size / 24);
  ctx.fill(p);
  ctx.restore();
}

/** GitHub + LinkedIn marks side by side (contact). */
export function socialShape(count: number): Float32Array {
  return canvasShape((ctx, w, h) => {
    drawIcon(ctx, GITHUB_PATH, w * 0.32, h / 2, 96);
    drawIcon(ctx, LINKEDIN_PATH, w * 0.68, h / 2, 86);
  }, count);
}

/** A globe: sphere surface with a few lat/long great-circle rings. */
export function globeShape(count: number, r = 2.1): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.4) {
      // a point on one of three perpendicular rings (the wireframe lines)
      const ring = (Math.random() * 3) | 0;
      const a = Math.random() * Math.PI * 2;
      const c = Math.cos(a) * r;
      const s = Math.sin(a) * r;
      if (ring === 0) {
        out[i * 3] = c;
        out[i * 3 + 1] = s;
        out[i * 3 + 2] = 0;
      } else if (ring === 1) {
        out[i * 3] = c;
        out[i * 3 + 1] = 0;
        out[i * 3 + 2] = s;
      } else {
        out[i * 3] = 0;
        out[i * 3 + 1] = c;
        out[i * 3 + 2] = s;
      }
    } else {
      // a point on the sphere surface
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * i;
      out[i * 3] = Math.cos(theta) * rad * r;
      out[i * 3 + 1] = y * r;
      out[i * 3 + 2] = Math.sin(theta) * rad * r;
    }
  }
  return out;
}

/** A rocket silhouette pointing up (products that ship). */
export function rocketShape(count: number): Float32Array {
  return canvasShape((ctx, w) => {
    const cx = w / 2;
    // nose
    ctx.beginPath();
    ctx.moveTo(cx, 18);
    ctx.lineTo(cx - 26, 56);
    ctx.lineTo(cx + 26, 56);
    ctx.closePath();
    ctx.fill();
    // body
    ctx.fillRect(cx - 26, 56, 52, 64);
    // fins
    ctx.beginPath();
    ctx.moveTo(cx - 26, 96);
    ctx.lineTo(cx - 26, 120);
    ctx.lineTo(cx - 52, 128);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 26, 96);
    ctx.lineTo(cx + 26, 120);
    ctx.lineTo(cx + 52, 128);
    ctx.closePath();
    ctx.fill();
    // exhaust flame
    ctx.beginPath();
    ctx.moveTo(cx - 15, 120);
    ctx.lineTo(cx + 15, 120);
    ctx.lineTo(cx, 150);
    ctx.closePath();
    ctx.fill();
  }, count);
}

/** Build the full ordered set of shapes, one per page section. */
export function buildShapes(count: number): Float32Array[] {
  return [
    glyphShape("MOHAK", count, 132), // hero    — full name
    torusShape(count), // about      — orbit / curiosity
    glyphShape("{ }", count, 150), // projects   — code
    neuralShape(count), // skills     — AI / ML
    emojiShape("🏏", count, 124), // hobbies     — cricket
    planeShape(count), // sidequests — paper plane
    pageShape(count), // blog       — written page
    socialShape(count), // contact    — GitHub + LinkedIn
  ];
}
