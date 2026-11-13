import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { MathUtils, SRGBColorSpace, type Group, type MeshBasicMaterial, type Texture } from "three";
import { asset, projects } from "../site.config";

/**
 * The hero device scene in real 3D: a laptop and a phone lit from one side with an
 * orange rim light, their screens crossfading real captures of client sites.
 * Loaded only on capable desktops, after the page has finished loading (see DeviceScene).
 * The CSS scene underneath stays as the fallback and the poster.
 */

const HOLD = 4; // seconds each project stays on screen
const FADE = 0.9; // seconds of crossfade at the end of each hold

/** A screen that crossfades through a list of textures on the shared clock: the top plane fades the next one in. */
function Screen({ textures, size, position }: { textures: Texture[]; size: [number, number]; position: [number, number, number] }) {
  const under = useRef<MeshBasicMaterial>(null);
  const over = useRef<MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    const n = textures.length;
    const t = clock.elapsedTime;
    const i = Math.floor(t / HOLD);
    const f = t - i * HOLD;
    const x = MathUtils.clamp((f - (HOLD - FADE)) / FADE, 0, 1);
    if (under.current) under.current.map = textures[i % n];
    if (over.current) { over.current.map = textures[(i + 1) % n]; over.current.opacity = x * x * (3 - 2 * x); }
  });
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial ref={under} map={textures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={size} />
        <meshBasicMaterial ref={over} map={textures[1] ?? textures[0]} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const prep = (t: Texture | Texture[]) => (Array.isArray(t) ? t : [t]).forEach((x) => { x.colorSpace = SRGBColorSpace; x.anisotropy = 4; x.needsUpdate = true; });

function Devices({ ids, onReady }: { ids: string[]; onReady: () => void }) {
  const shots = ids.map((id) => projects.find((p) => p.id === id)?.shot).filter((s): s is string => !!s);
  const laptop = useTexture(shots.map((s) => asset(`/work/h-${s}-640.webp`)), prep) as Texture[];
  const phone = useTexture(shots.map((s) => asset(`/work/p-${s}-260.webp`)), prep) as Texture[];

  const rig = useRef<Group>(null);
  useFrame(({ clock, pointer }, dt) => {
    const g = rig.current;
    if (!g) return;
    g.position.y = -0.62 + Math.sin(clock.elapsedTime * 0.7) * 0.07;
    g.rotation.y = MathUtils.damp(g.rotation.y, -0.42 + pointer.x * 0.16, 3, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, 0.1 - pointer.y * 0.05, 3, dt);
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  const body = <meshStandardMaterial color="#2b2c31" metalness={0.4} roughness={0.5} />;
  return (
    <group ref={rig} scale={0.94}>
      {/* laptop */}
      <group position={[-0.25, 0, 0]}>
        <RoundedBox args={[3.3, 0.09, 2.2]} radius={0.035} smoothness={3} position={[0, 0, 0]}>{body}</RoundedBox>
        <mesh position={[0, 0.047, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 0.58]} />
          <meshStandardMaterial color="#202226" metalness={0.4} roughness={0.55} />
        </mesh>
        <group position={[0, 0.045, -1.1]} rotation={[-0.27, 0, 0]}>
          <RoundedBox args={[3.3, 2.1, 0.08]} radius={0.04} smoothness={3} position={[0, 1.05, 0]}>{body}</RoundedBox>
          <Screen textures={laptop} size={[3.1, 1.9375]} position={[0, 1.05, 0.0425]} />
        </group>
      </group>
      {/* phone */}
      <group position={[2.05, 0, 0.95]} rotation={[-0.06, -0.2, 0.03]}>
        <RoundedBox args={[0.95, 1.95, 0.09]} radius={0.13} smoothness={4} position={[0, 0.975, 0]}>{body}</RoundedBox>
        <Screen textures={phone} size={[0.86, 1.86]} position={[0, 0.975, 0.0455]} />
      </group>
    </group>
  );
}

export default function Hero3D({ ids, onReady }: { ids: string[]; onReady: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // stop rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="scene-3d-in">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        flat
        camera={{ position: [0, 2.3, 9.4], fov: 28 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0.25, 0.85, 0)}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[-4, 5, 4]} intensity={3} color="#fff1e2" />
        <pointLight position={[4.5, 2.6, -3.2]} intensity={90} distance={16} decay={2} color="#ff6a1a" />
        <pointLight position={[-3.5, 1.2, 3.5]} intensity={14} distance={12} decay={2} color="#ff8444" />
        <Devices ids={ids} onReady={onReady} />
      </Canvas>
    </div>
  );
}
