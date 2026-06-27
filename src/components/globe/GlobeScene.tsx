"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GLOBE_R, GEO, markerPosition, globeState } from "./globe";
import { FRAMES } from "../prezi/frames";

const EMERALD = "#10B981";
const MINT = "#5EEAD4";
// Blue-marble Earth, served from the three-globe package on a stable CDN.
const EARTH_URL = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

/** Load the Earth texture imperatively, with a graceful colour fallback. */
function useEarthTexture() {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      EARTH_URL,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => setTex(null)
    );
    return () => setTex(null);
  }, []);
  return tex;
}

function Marker({
  i,
  label,
  focused,
  hovered,
  showLabel,
  onPick,
  onHover,
}: {
  i: number;
  label: string;
  focused: boolean;
  hovered: boolean;
  showLabel: boolean;
  onPick: (i: number) => void;
  onHover: (i: number | null) => void;
}) {
  const core = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => markerPosition(i), [i]);
  const up = useMemo(() => {
    const v = new THREE.Vector3(...pos).normalize().multiplyScalar(0.22);
    return [v.x, v.y, v.z] as [number, number, number];
  }, [pos]);

  useFrame(({ clock }) => {
    const base = focused ? 1.7 : hovered ? 1.35 : 1;
    const pulse = focused ? 1 + Math.sin(clock.elapsedTime * 4) * 0.18 : 1;
    core.current?.scale.setScalar(base * pulse);
  });

  return (
    <group position={pos}>
      {/* pin base */}
      <mesh
        ref={core}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick(i);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(i);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.065, 18, 18]} />
        <meshBasicMaterial color={focused ? MINT : EMERALD} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={focused ? MINT : EMERALD}
          transparent
          opacity={focused ? 0.3 : 0.18}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* location label with the slide title */}
      {showLabel && (
        <Html
          position={up}
          center
          distanceFactor={9}
          occlude
          zIndexRange={[15, 0]}
          style={{ pointerEvents: "none", transition: "opacity .2s" }}
        >
          <div
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold shadow-[0_6px_18px_-6px_rgba(15,27,45,0.5)] ${
              focused
                ? "bg-accent text-white"
                : "bg-white/90 text-moon ring-1 ring-emerald-300/50"
            }`}
          >
            <span>📍</span>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GlobeScene({
  focus,
  hover,
  labels,
  onPick,
  onHover,
}: {
  focus: number;
  hover: number | null;
  labels: boolean;
  onPick: (i: number) => void;
  onHover: (i: number | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const earth = useEarthTexture();

  useFrame(({ camera }, dt) => {
    if (globeState.idle) globeState.ry += dt * 0.1;
    if (group.current) group.current.rotation.set(globeState.rx, globeState.ry, 0);
    const z = THREE.MathUtils.lerp(6.6, 3.95, globeState.zoom);
    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-5, -2, 3]} intensity={0.35} color={MINT} />

      <group ref={group}>
        {/* the planet */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[GLOBE_R, 64, 64]} />
          <meshStandardMaterial
            map={earth ?? undefined}
            color={earth ? "#ffffff" : "#16324f"}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>

        {/* atmosphere halo */}
        <mesh>
          <sphereGeometry args={[GLOBE_R * 1.15, 48, 48]} />
          <meshBasicMaterial
            color="#9fdcff"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* section location markers */}
        {GEO.map((_, i) => (
          <Marker
            key={FRAMES[i].id}
            i={i}
            label={FRAMES[i].label}
            focused={focus === i}
            hovered={hover === i}
            showLabel={labels}
            onPick={onPick}
            onHover={onHover}
          />
        ))}
      </group>
    </>
  );
}
