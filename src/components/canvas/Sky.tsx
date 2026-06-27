"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makePuffTexture } from "./textures";
import { ISLANDS, SPACING, LAST_INDEX } from "./balloonScene";
import HotAirBalloon from "./HotAirBalloon";

const SPAN = LAST_INDEX * SPACING; // total horizontal travel across all islands

/** A puffy cloud built from a cluster of overlapping soft sprites. */
function Cloud({
  position,
  scale,
  tex,
  opacity,
}: {
  position: [number, number, number];
  scale: number;
  tex: THREE.Texture;
  opacity: number;
}) {
  const puffs = useMemo(
    () =>
      [
        [0, 0, 0, 1.7],
        [1.4, -0.2, 0.2, 1.15],
        [-1.4, -0.15, -0.1, 1.25],
        [0.6, 0.42, 0.1, 1.0],
        [-0.7, 0.36, -0.2, 0.9],
      ] as [number, number, number, number][],
    []
  );
  return (
    <group position={position} scale={scale}>
      {puffs.map(([x, y, z, s], i) => (
        <sprite key={i} position={[x, y, z]} scale={[s * 2.1, s * 1.5, 1]}>
          <spriteMaterial map={tex} color="#ffffff" transparent opacity={opacity} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

/**
 * The world around the flight: a warm sun glow, layered drifting clouds for
 * parallax depth, and a couple of distant ambient balloons to give the sky
 * scale. Clouds slowly drift and wrap across the whole island span.
 */
export default function Sky() {
  const tex = useMemo(() => makePuffTexture(), []);
  const cloudsRef = useRef<THREE.Group>(null);
  const ambBalloons = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    const out: {
      pos: [number, number, number];
      scale: number;
      opacity: number;
      drift: number;
    }[] = [];
    const N = 11;
    for (let i = 0; i < N; i++) {
      const fg = i % 3 === 0; // some foreground clouds, closer + softer
      out.push({
        pos: [
          -SPACING + (i / N) * (SPAN + SPACING * 2) + Math.sin(i) * 2,
          2.5 + Math.sin(i * 1.7) * 2.4 + (fg ? -2 : 0),
          fg ? 3.5 + Math.sin(i) * 1.5 : -8 - (i % 4) * 2.5,
        ],
        scale: fg ? 2.6 : 1.5 + (i % 3) * 0.5,
        opacity: fg ? 0.5 : 0.9,
        drift: 0.15 + (i % 5) * 0.05,
      });
    }
    return out;
  }, []);

  // distant ambient balloons, parked far back along the route
  const ambient = useMemo(
    () =>
      [
        { x: ISLANDS[1].x + 3, y: 5, z: -12, colors: ["#38BDF8", "#ffffff"] as [string, string], s: 0.5 },
        { x: ISLANDS[3].x - 2, y: 6.5, z: -16, colors: ["#F472B6", "#ffffff"] as [string, string], s: 0.42 },
        { x: ISLANDS[5].x + 1, y: 4.5, z: -13, colors: ["#FBBF24", "#ffffff"] as [string, string], s: 0.46 },
      ].filter((b) => b.x !== undefined),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((c, i) => {
        const d = clouds[i].drift;
        c.position.x += d * 0.016;
        // wrap around once a cloud drifts off the right edge
        if (c.position.x > SPAN + SPACING * 2) c.position.x = -SPACING * 2;
      });
    }
    if (ambBalloons.current) {
      ambBalloons.current.children.forEach((b, i) => {
        b.position.y = ambient[i].y + Math.sin(t * 0.25 + i) * 0.6;
      });
    }
  });

  return (
    <group>
      {/* sun glow */}
      <sprite position={[SPAN * 0.15, 9, -20]} scale={[22, 22, 1]}>
        <spriteMaterial map={tex} color="#FFF3D6" transparent opacity={0.55} depthWrite={false} />
      </sprite>

      <group ref={cloudsRef}>
        {clouds.map((c, i) => (
          <Cloud key={i} position={c.pos} scale={c.scale} tex={tex} opacity={c.opacity} />
        ))}
      </group>

      <group ref={ambBalloons}>
        {ambient.map((b, i) => (
          <group key={i} position={[b.x, b.y, b.z]}>
            <HotAirBalloon colors={b.colors} scale={b.s} ambient />
          </group>
        ))}
      </group>
    </group>
  );
}
