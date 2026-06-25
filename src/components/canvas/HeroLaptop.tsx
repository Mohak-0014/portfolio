"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

/** Draws a small "about me" code editor onto a canvas → laptop screen texture. */
function useScreenTexture() {
  return useMemo(() => {
    const W = 1024;
    const H = 640;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;

    // editor background
    ctx.fillStyle = "#0E1726";
    ctx.fillRect(0, 0, W, H);

    // title bar
    ctx.fillStyle = "#0B1320";
    ctx.fillRect(0, 0, W, 56);
    const dots = ["#FF5F56", "#FFBD2E", "#27C93F"];
    dots.forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(34 + i * 28, 28, 7, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });
    ctx.fillStyle = "#8595A8";
    ctx.font = "22px ui-monospace, Menlo, Consolas, monospace";
    ctx.textBaseline = "middle";
    ctx.fillText("mohak.ts", W / 2 - 44, 29);

    // code
    const mono = "26px ui-monospace, Menlo, Consolas, monospace";
    ctx.font = mono;
    const C = {
      kw: "#34D399", // keyword (emerald)
      name: "#E6EDF5",
      str: "#7FE7C4", // string (teal)
      punc: "#9FB0C4",
      comment: "#5B6B82",
      num: "#FFD9A0",
    };
    type Tok = [string, string];
    const lines: Tok[][] = [
      [["const", C.kw], [" mohak", C.name], [" = ", C.punc], ["{", C.punc]],
      [["  role", C.punc], [": ", C.punc], ['"Software Engineer"', C.str], [",", C.punc]],
      [["  focus", C.punc], [": ", C.punc], ['["AI", "Web", "Products"]', C.str], [",", C.punc]],
      [["  learning", C.punc], [": ", C.punc], ['"always"', C.str], [",", C.punc]],
      [["  ship", C.punc], [": ", C.punc], ["() => ", C.kw], ["buildThings()", C.name], [",", C.punc]],
      [["}", C.punc]],
      [["", C.punc]],
      [["// turning ideas into products", C.comment]],
    ];

    const startY = 104;
    const lineH = 44;
    lines.forEach((toks, row) => {
      const y = startY + row * lineH;
      // gutter line number
      ctx.fillStyle = "#33425C";
      ctx.font = "20px ui-monospace, monospace";
      ctx.fillText(String(row + 1).padStart(2, " "), 28, y);
      // tokens
      ctx.font = mono;
      let x = 84;
      toks.forEach(([text, color]) => {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      });
    });

    // caret
    ctx.fillStyle = "#34D399";
    ctx.fillRect(86 + 250, startY + 7 * lineH - 14, 12, 26);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

const BODY = "#C4CCD6";
const BEZEL = "#1B2330";

/**
 * A meaningful hero element: a laptop showing a tiny "about me" editor. It owns
 * the opening moment, sways gently so the screen stays readable, then scales and
 * fades out as you scroll past the hero so it never fights the content.
 */
export default function HeroLaptop() {
  const screen = useScreenTexture();
  const outer = useRef<THREE.Group>(null);
  const sway = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!outer.current || !sway.current) return;

    // present only while the hero owns the viewport; ramps out fast as the
    // next section takes over (hero weight falls below ~0.7 → gone).
    const heroWeight = scrollState.sectionWeights[0] ?? 0;
    const presence = THREE.MathUtils.clamp((heroWeight - 0.45) / 0.55, 0, 1);
    outer.current.visible = presence > 0.01;
    if (!outer.current.visible) return;

    const eased = presence * presence * (3 - 2 * presence);
    outer.current.scale.setScalar(eased * 2);
    outer.current.position.y = -2.9 + (1 - eased) * 2;

    // keep the screen facing the viewer with a gentle sway
    sway.current.rotation.y = -0.28 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={outer} position={[4.4, -2.9, 0]}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.6}>
        <group ref={sway} rotation={[0, -0.28, 0]}>
          {/* deck — balanced keyboard section */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.7, 0.08, 1.35]} />
            <meshStandardMaterial color={BODY} metalness={0.65} roughness={0.35} />
          </mesh>
          {/* keyboard area */}
          <mesh position={[0, 0.045, 0.02]}>
            <boxGeometry args={[2.3, 0.012, 0.9]} />
            <meshStandardMaterial color="#A7B1BE" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* trackpad */}
          <mesh position={[0, 0.047, 0.48]}>
            <boxGeometry args={[0.66, 0.014, 0.4]} />
            <meshStandardMaterial color="#B7C0CC" metalness={0.4} roughness={0.45} />
          </mesh>

          {/* screen assembly, hinged at the back of the deck — 16:10 display
              matching the texture, reclined slightly back to face the camera */}
          <group position={[0, 0.04, -0.66]} rotation={[-0.22, 0, 0]}>
            {/* panel / bezel */}
            <mesh position={[0, 0.86, 0]} castShadow>
              <boxGeometry args={[2.75, 1.72, 0.06]} />
              <meshStandardMaterial color={BEZEL} metalness={0.5} roughness={0.4} />
            </mesh>
            {/* silver back */}
            <mesh position={[0, 0.86, -0.035]}>
              <boxGeometry args={[2.75, 1.72, 0.02]} />
              <meshStandardMaterial color={BODY} metalness={0.65} roughness={0.35} />
            </mesh>
            {/* the display */}
            <mesh position={[0, 0.86, 0.032]}>
              <planeGeometry args={[2.56, 1.56]} />
              <meshBasicMaterial map={screen} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}
