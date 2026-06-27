"use client";

import { ReactNode, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makePuffTexture } from "./textures";
import { dioramaState } from "./dioramaState";

type V3 = [number, number, number];

/* shared soft glow sprite texture (one instance for all focusables) */
let _halo: THREE.Texture | null = null;
function halo() {
  if (!_halo) _halo = makePuffTexture();
  return _halo;
}

/**
 * Wraps a prop so it reacts when its section is the one being read: it rises,
 * scales up a touch, and a soft emerald halo blooms behind it. Otherwise it
 * settles back down and idles with a gentle bob.
 */
export function Focusable({
  index,
  position,
  spin = 0,
  children,
}: {
  index: number;
  position: V3;
  /** optional idle y-spin speed */
  spin?: number;
  children: ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Sprite>(null);
  const tex = useMemo(() => halo(), []);
  const f = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const d = Math.abs(dioramaState.focus - index);
    const target = Math.max(0, 1 - d * 1.15);
    f.current += (target - f.current) * 0.09;
    const k = f.current;

    if (g.current) {
      g.current.position.set(
        position[0],
        position[1] + k * 0.45 + Math.sin(t * 1.1 + index) * 0.05,
        position[2]
      );
      g.current.scale.setScalar(1 + k * 0.1);
      if (spin) g.current.rotation.y = t * spin;
    }
    if (glow.current) {
      (glow.current.material as THREE.SpriteMaterial).opacity = k * 0.55;
      glow.current.scale.setScalar(2.4 + k * 1.6);
    }
  });

  return (
    <group ref={g} position={position}>
      <sprite ref={glow} position={[0, 0.6, -0.2]} scale={2.4}>
        <spriteMaterial map={tex} color="#34D399" transparent opacity={0} depthWrite={false} />
      </sprite>
      {children}
    </group>
  );
}

/* ───────────────────────── focusable props ───────────────────────── */

/** Projects — a laptop with a glowing emerald "code" screen. */
export function Laptop() {
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.5, 0.12, 1.0]} />
        <meshStandardMaterial color="#DCE6E3" roughness={0.5} metalness={0.25} flatShading />
      </mesh>
      <mesh position={[0, 0.122, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 0.7]} />
        <meshStandardMaterial color="#B8C4C2" roughness={0.85} />
      </mesh>
      <group position={[0, 0.12, -0.48]} rotation={[-0.34, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1.0, 0.06]} />
          <meshStandardMaterial color="#C6D2CF" roughness={0.4} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.5, 0.035]}>
          <planeGeometry args={[1.34, 0.84]} />
          <meshStandardMaterial color="#0B3B30" emissive="#10B981" emissiveIntensity={0.95} roughness={0.3} />
        </mesh>
        {[0.26, 0.12, -0.03, -0.18, -0.3].map((y, i) => (
          <mesh key={i} position={[-0.25 + (i % 2) * 0.12, 0.5 + y, 0.04]}>
            <planeGeometry args={[0.66 - (i % 3) * 0.18, 0.045]} />
            <meshStandardMaterial color="#A7F3D0" emissive="#6EE7B7" emissiveIntensity={0.75} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** About — a potted plant: roots, growth, the personal origin. */
export function Plant() {
  const leaves = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.5, 10]} />
        <meshStandardMaterial color="#2DD4BF" roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 10]} />
        <meshStandardMaterial color="#3B2A22" roughness={1} />
      </mesh>
      {leaves.map((i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.13, 0.72 + (i % 3) * 0.14, Math.sin(a) * 0.13]}
            rotation={[0.55, a, 0]}
          >
            <coneGeometry args={[0.12, 0.62, 5]} />
            <meshStandardMaterial
              color={i % 2 ? "#3FB07A" : "#5BCB91"}
              roughness={0.8}
              flatShading
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Skills — a slowly turning stack of accent-tinted cubes. */
export function SkillCubes() {
  const cubes: { p: V3; c: string }[] = [
    { p: [0, 0.3, 0], c: "#10B981" },
    { p: [0.52, 0.3, 0.12], c: "#2DD4BF" },
    { p: [0.26, 0.82, -0.04], c: "#38BDF8" },
    { p: [-0.42, 0.32, 0.22], c: "#6EE7B7" },
    { p: [0.12, 0.32, 0.54], c: "#34D399" },
  ];
  return (
    <group>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.p} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={c.c} roughness={0.45} metalness={0.1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Hobbies — a cricket bat leaning beside a seamed ball. */
export function Cricket() {
  return (
    <group rotation={[0, 0.4, 0]}>
      <group rotation={[0, 0, 0.5]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.34, 1.0, 0.12]} />
          <meshStandardMaterial color="#E8D9B5" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 8]} />
          <meshStandardMaterial color="#6E4A2B" roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[0.55, 0.16, 0.2]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#B0392B" roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.16, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.16, 0.012, 6, 20]} />
        <meshStandardMaterial color="#EDE0C0" />
      </mesh>
    </group>
  );
}

/** Sidequests — a steaming coffee mug. */
export function Coffee() {
  const steam = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!steam.current) return;
    const e = state.clock.elapsedTime;
    steam.current.children.forEach((m, i) => {
      const t = (e * 0.4 + i * 0.5) % 1;
      m.position.y = 0.7 + t * 0.85;
      (m as THREE.Mesh).scale.setScalar(0.1 + t * 0.22);
      ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.4;
    });
  });
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.6, 18]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 18]} />
        <meshStandardMaterial color="#5B3A29" roughness={0.6} />
      </mesh>
      <mesh position={[0.34, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <group ref={steam}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.08, 0.7, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Blog — an open notebook with ruled lines and a pen. */
export function Notebook() {
  return (
    <group rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <boxGeometry args={[1.0, 0.14, 0.72]} />
        <meshStandardMaterial color="#2DD4BF" roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.62]} />
        <meshStandardMaterial color="#FAF7EF" roughness={0.9} />
      </mesh>
      {[0.2, 0.07, -0.06, -0.19].map((z, i) => (
        <mesh key={i} position={[0, 0.146, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.66, 0.018]} />
          <meshStandardMaterial color="#9BB7B0" />
        </mesh>
      ))}
      <mesh position={[0.32, 0.2, 0.12]} rotation={[0, 0, Math.PI / 2.3]}>
        <cylinderGeometry args={[0.025, 0.018, 0.7, 8]} />
        <meshStandardMaterial color="#10B981" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

/** Contact — a sealed envelope. */
export function Envelope() {
  return (
    <group rotation={[0, 0.2, 0]}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[1.0, 0.66, 0.08]} />
        <meshStandardMaterial color="#FAF7EF" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0.05]} rotation={[0.6, Math.PI / 4, 0]}>
        <coneGeometry args={[0.52, 0.42, 4]} />
        <meshStandardMaterial color="#ECF2EF" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0.34, 0.07]}>
        <circleGeometry args={[0.11, 20]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── decorative props ───────────────────────── */

/** A little rocket toy, gently hovering. */
export function Rocket() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 1.5) * 0.06;
  });
  return (
    <group ref={g}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.8, 14]} />
        <meshStandardMaterial color="#F4F8F7" roughness={0.4} metalness={0.2} flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <coneGeometry args={[0.22, 0.45, 14]} />
        <meshStandardMaterial color="#10B981" roughness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 0.75, 0.22]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.22, 0.28, Math.sin(a) * 0.22]} rotation={[0, -a, 0.3]}>
            <boxGeometry args={[0.04, 0.3, 0.18]} />
            <meshStandardMaterial color="#2DD4BF" flatShading />
          </mesh>
        );
      })}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.4, 10]} />
        <meshBasicMaterial color="#FFB14E" transparent opacity={0.8} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** A framed photo on a small stand. */
export function PhotoFrame() {
  return (
    <group rotation={[0, 0.5, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 1.1, 0.06]} />
        <meshStandardMaterial color="#E8D9B5" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 0.6, 0.04]}>
        <planeGeometry args={[0.72, 0.92]} />
        <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.12, -0.16]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.55, 0.04]} />
        <meshStandardMaterial color="#B07A4A" />
      </mesh>
    </group>
  );
}

/** A stack of colourful books. */
export function Books() {
  const cols = ["#10B981", "#38BDF8", "#F472B6"];
  return (
    <group rotation={[0, 0.5, 0]}>
      {cols.map((c, i) => (
        <mesh key={i} position={[i * 0.02, 0.09 + i * 0.16, 0]} rotation={[0, i * 0.2, 0]} castShadow>
          <boxGeometry args={[0.72, 0.14, 0.5]} />
          <meshStandardMaterial color={c} roughness={0.6} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** A desk lamp casting a warm pool of light. */
export function Lamp() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.5} />
      </mesh>
      <mesh position={[0.16, 1.15, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.22, 0.32, 16, 1, true]} />
        <meshStandardMaterial color="#10B981" side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      <pointLight position={[0.28, 1.0, 0]} color="#FFE9B0" intensity={1.1} distance={4} decay={2} />
    </group>
  );
}

/** A pair of over-ear headphones. */
export function Headphones() {
  return (
    <group rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.4, 0.05, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0F1B2D" roughness={0.5} />
      </mesh>
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.32, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
