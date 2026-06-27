"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { makePuffTexture } from "./textures";
import { buildShapes } from "./particleShapes";

const COUNT = 6500;

const PALETTE = [
  new THREE.Color("#10B981"),
  new THREE.Color("#34D399"),
  new THREE.Color("#2DD4BF"),
  new THREE.Color("#5EEAD4"),
  new THREE.Color("#38BDF8"),
  new THREE.Color("#22D3EE"),
];

/**
 * Living particle field. Thousands of emerald/teal motes drift in bright
 * space; they swirl away from the cursor, and as you scroll they re-assemble
 * into a different glyph per section (MOHAK → orbit ring → {} → neural net →
 * cricket → paper plane → page → social logos). Driven by
 * `scrollState.progress`, so the DOM scroll stays the source of truth and the
 * content cards stay readable.
 */
export default function ParticleField() {
  const { camera } = useThree();
  const points = useRef<THREE.Points>(null);
  const tex = useMemo(() => makePuffTexture(), []);

  const shapes = useMemo(() => buildShapes(COUNT), []);

  // per-particle current position (also the live geometry buffer), colour,
  // and an idle-drift phase so the cloud always shimmers a little
  const { positions, colors, phase } = useMemo(() => {
    const positions = new Float32Array(shapes[0]); // start as the first shape
    const colors = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const col = PALETTE[(Math.random() * PALETTE.length) | 0];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, phase };
  }, [shapes]);

  // smoothed scroll + pointer state
  const prog = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const world = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(1, delta * 60); // frame-rate-independent easing scalar

    // ease scroll → smooth morph
    prog.current += (scrollState.progress - prog.current) * Math.min(1, delta * 4);
    const K = shapes.length;
    const f = prog.current * (K - 1);
    const i0 = Math.min(K - 2, Math.max(0, Math.floor(f)));
    const local = f - i0;
    const e = local * local * (3 - 2 * local); // smoothstep
    const A = shapes[i0];
    const B = shapes[i0 + 1];

    // cursor → world point on the z≈0 plane (where the shapes live)
    const halfH = Math.tan((camera as THREE.PerspectiveCamera).fov * 0.5 * (Math.PI / 180)) * camera.position.z;
    const halfW = halfH * (state.size.width / state.size.height);
    world.current.set(mouse.current.x * halfW, mouse.current.y * halfH, 0);
    const R = 1.25;
    const R2 = R * R;

    const arr = positions;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const ph = phase[i];
      // morph target + a touch of idle drift so it never looks frozen
      const tx = A[ix] + (B[ix] - A[ix]) * e + Math.sin(t * 0.7 + ph) * 0.05;
      const ty = A[ix + 1] + (B[ix + 1] - A[ix + 1]) * e + Math.cos(t * 0.6 + ph) * 0.05;
      const tz = A[ix + 2] + (B[ix + 2] - A[ix + 2]) * e + Math.sin(t * 0.5 + ph) * 0.05;

      // ease toward target
      let x = arr[ix] + (tx - arr[ix]) * 0.12 * dt;
      let y = arr[ix + 1] + (ty - arr[ix + 1]) * 0.12 * dt;
      const z = arr[ix + 2] + (tz - arr[ix + 2]) * 0.12 * dt;

      // swirl away from the cursor
      const dx = x - world.current.x;
      const dy = y - world.current.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        const d = Math.sqrt(d2) || 0.0001;
        const push = (1 - d / R) * 0.9;
        x += (dx / d) * push;
        y += (dy / d) * push;
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }

    if (points.current) {
      const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
      // slow breathing rotation for a hint of depth
      points.current.rotation.y = Math.sin(t * 0.08) * 0.06;
    }

    // gentle pointer parallax on the camera
    camera.position.x += (mouse.current.x * 0.9 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.6 - camera.position.y) * 0.05;
    camera.position.z += (9 - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.12}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        alphaTest={0.02}
      />
    </points>
  );
}
