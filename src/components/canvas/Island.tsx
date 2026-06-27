"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { IslandDef } from "./balloonScene";

/** A small low-poly tree — cone foliage on a stubby trunk. */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.36, 6]} />
        <meshStandardMaterial color="#8B5E3C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <coneGeometry args={[0.32, 0.7, 7]} />
        <meshStandardMaterial color="#2F9E6E" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.22, 0.5, 7]} />
        <meshStandardMaterial color="#34D399" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

/**
 * A floating island: a grassy cap over a rocky underside that tapers to a
 * point, with a couple of trees, some loose rocks, and an accent-coloured
 * flag marking the "landing pad". Bobs and rotates very gently so the sky
 * feels alive without distracting from the content in front of it.
 */
export default function Island({ def }: { def: IslandDef }) {
  const group = useRef<THREE.Group>(null);

  // deterministic-ish scatter for rocks so each island looks a little different
  const rocks = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const a = def.seed + i * 2.3;
        return {
          pos: [Math.sin(a) * 1.4, -0.2 - (i % 2) * 0.3, Math.cos(a) * 1.4] as [
            number,
            number,
            number
          ],
          s: 0.18 + ((i * 7) % 5) * 0.05,
        };
      }),
    [def.seed]
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = def.y + Math.sin(t * 0.6 + def.seed) * 0.12;
    group.current.rotation.y = Math.sin(t * 0.12 + def.seed) * 0.06;
  });

  return (
    <group ref={group} position={[def.x, def.y, def.z]}>
      {/* grassy top */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.7, 1.95, 0.7, 9]} />
        <meshStandardMaterial color="#3FB07A" roughness={0.85} flatShading />
      </mesh>
      {/* soft green crown sitting just proud of the rim */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[1.55, 1.7, 0.14, 9]} />
        <meshStandardMaterial color="#5BCB91" roughness={0.8} flatShading />
      </mesh>

      {/* rocky underside */}
      <mesh position={[0, -1.85, 0]} castShadow>
        <coneGeometry args={[1.95, 3.4, 8]} />
        <meshStandardMaterial color="#7C8B97" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, -1.0, 0]} castShadow>
        <coneGeometry args={[2.05, 1.3, 8]} />
        <meshStandardMaterial color="#94A3AE" roughness={1} flatShading />
      </mesh>

      {/* loose rocks clinging underneath */}
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.s} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8A98A4" roughness={1} flatShading />
        </mesh>
      ))}

      {/* trees */}
      <Tree position={[-0.9, 0.35, 0.5]} scale={0.85} />
      <Tree position={[0.8, 0.35, -0.6]} scale={0.62} />

      {/* accent flag — the landing marker for this section */}
      <group position={[0.95, 0.35, 0.7]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 6]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.92, 0]}>
          <planeGeometry args={[0.55, 0.34]} />
          <meshStandardMaterial
            color={def.accent}
            roughness={0.5}
            emissive={def.accent}
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
