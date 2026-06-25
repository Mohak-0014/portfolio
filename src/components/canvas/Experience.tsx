"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import AuroraField from "./AuroraField";
import HeroLaptop from "./HeroLaptop";

/**
 * Bright, immersive environment: a soft emerald aurora field behind the frosted
 * UI. The camera holds a calm framing and only drifts a touch with scroll and
 * pointer parallax — the living light does the work, not a moving object.
 */
export default function Experience() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const p = scrollState.progress;
    const desired = new THREE.Vector3(
      mouse.current.x * 0.7,
      mouse.current.y * 0.5 - p * 0.6,
      9
    );
    camera.position.lerp(desired, 0.05);
    camera.lookAt(0, 0, -4);
  });

  return (
    <group>
      {/* light haze so distant clouds melt into the bright background */}
      <fog attach="fog" args={["#EAF5F1", 8, 26]} />
      {/* soft lighting so the glass figure reads */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} color="#ffffff" />
      <AuroraField />
      <HeroLaptop />
    </group>
  );
}
