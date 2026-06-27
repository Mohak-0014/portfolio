"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makePuffTexture } from "./textures";
import {
  Focusable,
  Laptop,
  Plant,
  SkillCubes,
  Cricket,
  Coffee,
  Notebook,
  Envelope,
  Rocket,
  PhotoFrame,
  Books,
  Lamp,
  Headphones,
} from "./DioramaProps";

type V3 = [number, number, number];

/**
 * "World of Mohak" — a little floating desk-world. Each section of the page
 * has one hero object on the platform; the camera (driven by Experience)
 * orbits and zooms to frame that object as you scroll.
 *
 * FOCUS_POS is the single source of truth for both where a prop sits AND
 * where the camera looks, so framing always lines up with the object.
 */
export const FOCUS_POS: V3[] = [
  [0, 0, 0], // 0 hero  — wide establishing shot of the whole world
  [-2.4, 0, 1.2], // 1 about      → plant
  [0.2, 0, -0.4], // 2 projects   → laptop
  [2.6, 0, 1.0], // 3 skills      → cubes
  [-1.7, 0, -2.3], // 4 hobbies   → cricket
  [1.9, 0, -1.9], // 5 sidequests → coffee
  [-0.6, 0, 2.4], // 6 blog       → notebook
  [1.6, 0, 2.2], // 7 contact     → envelope
];

export type Shot = { cam: THREE.Vector3; tgt: THREE.Vector3 };

/** Build a camera shot for a focus position: sit outside the disc, look in. */
function shotFor(i: number): Shot {
  const o = FOCUS_POS[i];
  if (i === 0) {
    return {
      cam: new THREE.Vector3(0, 4.6, 13),
      tgt: new THREE.Vector3(0, 1.0, 0),
    };
  }
  const len = Math.hypot(o[0], o[2]) || 1;
  const nx = o[0] / len;
  const nz = o[2] / len;
  const dist = 6.0;
  return {
    cam: new THREE.Vector3(o[0] + nx * dist, 3.2, o[2] + nz * dist),
    tgt: new THREE.Vector3(o[0], 1.0, o[2]),
  };
}

export const SHOTS: Shot[] = FOCUS_POS.map((_, i) => shotFor(i));
export const SECTION_COUNT = SHOTS.length;

/** Drifting dust motes for atmosphere. */
function Dust({ tex }: { tex: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 120;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color="#5EEAD4"
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export default function Diorama() {
  const tex = useMemo(() => makePuffTexture(), []);

  return (
    <group>
      {/* frosted floating platform */}
      <mesh position={[0, -0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5, 5.2, 0.7, 48]} />
        <meshStandardMaterial color="#EAF6F1" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* rocky underside so it reads as a floating chunk, not a coin */}
      <mesh position={[0, -1.9, 0]}>
        <coneGeometry args={[5.1, 3.2, 12]} />
        <meshStandardMaterial color="#9FB0AE" roughness={1} flatShading />
      </mesh>
      {/* accent rim */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.0, 0.04, 8, 64]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.4} />
      </mesh>

      {/* soft glow pool under the world */}
      <sprite position={[0, -0.2, 0]} scale={[14, 14, 1]}>
        <spriteMaterial map={tex} color="#A7F3D0" transparent opacity={0.25} depthWrite={false} />
      </sprite>

      <Dust tex={tex} />

      {/* ── focusable section heroes ── */}
      <Focusable index={1} position={FOCUS_POS[1]}>
        <Plant />
      </Focusable>
      <Focusable index={2} position={FOCUS_POS[2]}>
        <Laptop />
      </Focusable>
      <Focusable index={3} position={FOCUS_POS[3]} spin={0.3}>
        <SkillCubes />
      </Focusable>
      <Focusable index={4} position={FOCUS_POS[4]}>
        <Cricket />
      </Focusable>
      <Focusable index={5} position={FOCUS_POS[5]}>
        <Coffee />
      </Focusable>
      <Focusable index={6} position={FOCUS_POS[6]}>
        <Notebook />
      </Focusable>
      <Focusable index={7} position={FOCUS_POS[7]}>
        <Envelope />
      </Focusable>

      {/* ── decorative props that dress the desk ── */}
      <group position={[-3.4, 0, -0.4]}>
        <PhotoFrame />
      </group>
      <group position={[2.9, 0, -1.0]}>
        <Rocket />
      </group>
      <group position={[3.2, 0, 2.2]}>
        <Books />
      </group>
      <group position={[3.4, 0, -0.3]}>
        <Lamp />
      </group>
      <group position={[-2.9, 0, -1.5]}>
        <Headphones />
      </group>
    </group>
  );
}
