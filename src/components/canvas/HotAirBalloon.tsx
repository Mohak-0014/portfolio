"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGoreTexture } from "./textures";

type Props = {
  colors: [string, string];
  scale?: number;
  /** dim the burner + sway for far-off ambient balloons */
  ambient?: boolean;
};

const BASKET = "#7B4B2A";
const ROPE = "#caa46a";

/**
 * A hot-air balloon: striped teardrop envelope, a burner flame that flickers
 * real light up into the canopy, ropes, and a woven basket. The group origin
 * sits at the bottom of the basket, so positioning the group on an island top
 * makes it look properly "landed".
 *
 * Idle sway/bob lives here; the parent drives where it flies and how it leans.
 */
const HotAirBalloon = forwardRef<THREE.Group, Props>(function HotAirBalloon(
  { colors, scale = 1, ambient = false },
  ref
) {
  const inner = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);
  const burner = useRef<THREE.PointLight>(null);

  const gore = useMemo(() => makeGoreTexture(colors[0], colors[1]), [colors]);

  // four ropes from the basket rim up to the envelope throat
  const ropeAngles = useMemo(() => [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 + Math.PI / 4), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      const swayAmt = ambient ? 0.05 : 0.035;
      inner.current.rotation.z = Math.sin(t * 0.8) * swayAmt;
      inner.current.position.y = Math.sin(t * 1.25) * 0.05;
    }
    // burner flicker — light the canopy from inside
    const flick = 0.6 + Math.sin(t * 20) * 0.25 + Math.random() * 0.15;
    if (burner.current) burner.current.intensity = (ambient ? 1.1 : 2.6) * flick;
    if (flame.current) {
      flame.current.scale.y = 0.8 + flick * 0.6;
      (flame.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + flick * 0.3;
    }
  });

  return (
    <group ref={ref} scale={scale}>
      <group ref={inner}>
        {/* envelope — teardrop made by squashing a sphere + a throat cone */}
        <mesh position={[0, 3.05, 0]} scale={[1, 1.18, 1]} castShadow>
          <sphereGeometry args={[1.3, 24, 24]} />
          <meshStandardMaterial map={gore} roughness={0.55} metalness={0.05} />
        </mesh>
        <mesh position={[0, 1.78, 0]}>
          <coneGeometry args={[0.55, 0.7, 16, 1, true]} />
          <meshStandardMaterial
            map={gore}
            roughness={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* burner flame + its light */}
        <mesh ref={flame} position={[0, 1.35, 0]}>
          <coneGeometry args={[0.12, 0.45, 8]} />
          <meshBasicMaterial color="#FFB14E" transparent opacity={0.95} />
        </mesh>
        <pointLight
          ref={burner}
          position={[0, 1.6, 0]}
          color="#FFC56B"
          distance={4}
          decay={2}
          intensity={2.4}
        />

        {/* ropes */}
        {ropeAngles.map((a, i) => {
          const x = Math.cos(a) * 0.42;
          const z = Math.sin(a) * 0.42;
          return (
            <mesh key={i} position={[x, 1.0, z]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.1, 4]} />
              <meshStandardMaterial color={ROPE} roughness={0.9} />
            </mesh>
          );
        })}

        {/* basket */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.62, 0.5, 0.62]} />
          <meshStandardMaterial color={BASKET} roughness={0.95} flatShading />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <boxGeometry args={[0.66, 0.08, 0.66]} />
          <meshStandardMaterial color="#5E3A20" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
});

export default HotAirBalloon;
