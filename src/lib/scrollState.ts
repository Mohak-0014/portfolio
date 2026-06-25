import { sections } from "@/data/content";

/**
 * Lightweight global scroll state shared between the DOM scroll (Lenis)
 * and the WebGL render loop, without forcing React re-renders.
 *
 * `progress`       → 0..1 across the whole page
 * `velocity`       → recent scroll speed (for motion-reactive effects)
 * `sectionWeights` → per-section 0..1 "how centered is this section",
 *                    used to crossfade each section's 3D scene.
 * `activeIndex`    → index of the most-centered section.
 */
export const scrollState = {
  progress: 0,
  velocity: 0,
  sectionWeights: sections.map(() => 0) as number[],
  activeIndex: 0,
};

let initialized = false;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function initScrollState() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  let lastY = window.scrollY;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    scrollState.progress = max > 0 ? clamp01(y / max) : 0;
    scrollState.velocity = y - lastY;
    lastY = y;

    // weight each section by how close its center is to the viewport center
    const vh = window.innerHeight;
    const viewportCenter = y + vh / 2;
    const falloff = vh * 0.85;

    let best = 0;
    let bestWeight = -1;
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id);
      let w = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        const center = rect.top + window.scrollY + rect.height / 2;
        const d = Math.abs(center - viewportCenter);
        w = clamp01(1 - d / falloff);
      }
      scrollState.sectionWeights[i] = w;
      if (w > bestWeight) {
        bestWeight = w;
        best = i;
      }
    }
    scrollState.activeIndex = best;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
