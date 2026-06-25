"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { initScrollState } from "@/lib/scrollState";

/**
 * Full-viewport fixed WebGL layer that lives BEHIND the DOM sections.
 * The page scrolls normally over the top; the 3D world reacts to scroll
 * progress. Skips rendering entirely under prefers-reduced-motion.
 */
export default function SceneCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    initScrollState();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
    >
      {/* bright gradient backdrop — always present, even without WebGL */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_50%_0%,#FFFFFF_0%,#EAF5F1_42%,#E4ECF5_100%)]" />

      {enabled && (
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 9], fov: 54 }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      )}

      {/* soft top sheen + faint grain to seat the frosted content */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(94,234,212,0.18),transparent_70%)]" />
    </div>
  );
}
