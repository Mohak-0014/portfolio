"use client";

import ParticleField from "./ParticleField";

/**
 * The 3D world behind the scrolling page: a living particle field of
 * emerald/teal motes that swirl away from the cursor and re-assemble into a
 * different glyph for each section as you scroll. Self-contained — it owns its
 * own camera drift — so this stays a thin wrapper.
 */
export default function Experience() {
  return (
    <group>
      <ParticleField />
    </group>
  );
}
