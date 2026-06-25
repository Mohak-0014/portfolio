"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

/** Soft radial sprite texture (white core → transparent) generated at runtime. */
function useSoftTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

const CLOUD_COLORS = [
  "#10B981",
  "#34D399",
  "#5EEAD4",
  "#A7F3D0",
  "#2DD4BF",
  "#7DD3FC",
  "#FFFFFF",
];

/**
 * A bright, cohesive 3D environment: large soft light-clouds drift and breathe
 * to form a living emerald "aurora", with a fine particle haze for depth.
 * Reacts to scroll (slow hue/position shift) and pointer (parallax via camera).
 * No hard objects — it reads as flowing light behind the frosted-glass UI.
 */
export default function AuroraField() {
  const tex = useSoftTexture();
  const group = useRef<THREE.Group>(null);
  const cloudRefs = useRef<(THREE.Sprite | null)[]>([]);

  const clouds = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        base: new THREE.Vector3(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 9,
          -2 - Math.random() * 9
        ),
        scale: 5 + Math.random() * 7,
        color: CLOUD_COLORS[i % CLOUD_COLORS.length],
        amp: 0.6 + Math.random() * 1.4,
        speed: 0.12 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.32 + Math.random() * 0.22,
      })),
    []
  );

  // particle haze
  const { positions, pSize } = useMemo(() => {
    const count = 480;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = -1 - Math.random() * 12;
    }
    return { positions, pSize: 0.07 };
  }, []);

  const particles = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    // whole field drifts gently sideways with scroll + breathes
    if (group.current) {
      group.current.position.x = -p * 2.5;
      group.current.position.y = p * 1.2;
      group.current.rotation.z = Math.sin(t * 0.05) * 0.03;
    }

    clouds.forEach((c, i) => {
      const s = cloudRefs.current[i];
      if (!s) return;
      s.position.set(
        c.base.x + Math.sin(t * c.speed + c.phase) * c.amp,
        c.base.y + Math.cos(t * c.speed * 0.8 + c.phase) * c.amp,
        c.base.z
      );
      const pulse = 1 + Math.sin(t * c.speed * 1.3 + c.phase) * 0.08;
      s.scale.setScalar(c.scale * pulse);
    });

    if (particles.current) {
      particles.current.rotation.y = t * 0.02;
      particles.current.position.y = Math.sin(t * 0.1) * 0.3;
    }
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <sprite
          key={i}
          ref={(el) => {
            cloudRefs.current[i] = el;
          }}
          position={c.base}
          scale={[c.scale, c.scale, 1]}
        >
          <spriteMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={c.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}

      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={tex}
          color="#10B981"
          size={pSize}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
