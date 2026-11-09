"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, Sparkles, PerspectiveCamera, Environment, MeshTransmissionMaterial, AdaptiveDpr } from "@react-three/drei";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Mobile gets no WebGL canvas at all (see HeroBackground3D below) — a real
// three.js scene with MeshTransmissionMaterial and an HDR environment map is
// too heavy for a phone GPU/battery. But "nothing" reads as a flat, unfinished
// hero, which is exactly what this was. This is the budget version: the same
// floating-crystal, glassy-glow identity, built from pure CSS transforms and
// blur (GPU-cheap, no WebGL context) via Framer Motion, which is already a
// dependency used throughout the site.
const MOBILE_SHAPES = [
  { kind: "orb" as const, top: "8%", left: "72%", size: 150, color: "#a855f7", duration: 9, delay: 0 },
  { kind: "orb" as const, top: "58%", left: "6%", size: 130, color: "#3b82f6", duration: 11, delay: 1.2 },
  { kind: "orb" as const, top: "32%", left: "-6%", size: 90, color: "#c084fc", duration: 8, delay: 0.6 },
  { kind: "crystal" as const, top: "14%", left: "14%", size: 34, color: "#c4b5fd", duration: 7, delay: 0.3, rotate: 12 },
  { kind: "crystal" as const, top: "70%", left: "80%", size: 26, color: "#93c5fd", duration: 6.5, delay: 1.6, rotate: -18 },
  { kind: "crystal" as const, top: "46%", left: "85%", size: 20, color: "#a855f7", duration: 8.5, delay: 0.9, rotate: 32 },
  { kind: "crystal" as const, top: "80%", left: "20%", size: 22, color: "#93c5fd", duration: 7.5, delay: 2, rotate: -10 },
];

function MobileHeroGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {MOBILE_SHAPES.map((shape, i) => {
        if (shape.kind === "orb") {
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: shape.top,
                left: shape.left,
                width: shape.size,
                height: shape.size,
                background: `radial-gradient(circle, ${shape.color}55 0%, ${shape.color}00 70%)`,
                filter: "blur(2px)",
              }}
              animate={{ y: [0, -22, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: shape.duration, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        }
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: shape.top, left: shape.left, width: shape.size, height: shape.size }}
            animate={{ y: [0, -16, 0], rotate: [shape.rotate ?? 0, (shape.rotate ?? 0) + 25, shape.rotate ?? 0] }}
            transition={{ duration: shape.duration, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-full h-full rounded-[6px] border backdrop-blur-[1px]"
              style={{
                borderColor: `${shape.color}80`,
                background: `linear-gradient(135deg, ${shape.color}33, transparent 70%)`,
                boxShadow: `0 0 16px ${shape.color}55`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// Complex Interconnected Crystal Network - Ring Configuration
function CrystalNetwork() {
    const group = useRef<THREE.Group>(null!);
    const { mouse, viewport } = useThree();
    const isMobile = useIsMobile();

    if (isMobile) return null;

    const connections = useMemo(() => {
        const points = [];
        const lines = [];
        // Significantly reduced for mobile performance
        const count = isMobile ? 8 : 18;

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const radius = isMobile ? 15 : 20;
            const x = Math.cos(t) * radius;
            const y = Math.sin(t * 3) * 2;
            const z = Math.sin(t) * radius;
            points.push({
                pos: new THREE.Vector3(x, y, z),
                size: Math.random() > 0.8 ? 1.2 : 0.5 + Math.random() * 0.4
            });
        }

        for (let i = 0; i < count; i++) {
            lines.push([points[i].pos, points[(i + 1) % count].pos]);
        }

        return { points, lines };
    }, [isMobile]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        group.current.rotation.y = time * 0.05;

        // Interactive tilt - Subtle and smooth lerp
        const x = (mouse.x * viewport.width) / 100;
        const y = (mouse.y * viewport.height) / 100;

        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.02);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -x * 0.05, 0.02);
    });

    return (
        <group ref={group} rotation={[0.1, 0, 0]}>
            {connections.points.map((data, i) => (
                <Float key={i} speed={isMobile ? 0.5 : 1} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={data.pos}>
                        <dodecahedronGeometry args={[data.size, 0]} />
                        <MeshTransmissionMaterial
                            backside={false}
                            samples={isMobile ? 2 : 4}
                            resolution={isMobile ? 128 : 256}
                            thickness={2}
                            roughness={0}
                            transmission={1}
                            ior={1.6}
                            chromaticAberration={0.4}
                            anisotropy={0.3}
                            color={i % 2 === 0 ? "#c084fc" : "#93c5fd"}
                            distortion={0.1}
                            distortionScale={0.3}
                            temporalDistortion={0.1}
                        />
                    </mesh>
                </Float>
            ))}

            {connections.lines.map((line, i) => (
                <line key={i}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array([
                                line[0].x, line[0].y, line[0].z,
                                line[1].x, line[1].y, line[1].z
                            ]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#c4b5fd" transparent opacity={0.1} />
                </line>
            ))}
        </group>
    )
}

// Interactive Orbital Rings with Glass Elements
function OrbitalSystem() {
    const ref = useRef<THREE.Group>(null!);
    const isMobile = useIsMobile();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.rotation.z = time * 0.02;
    });

    if (isMobile) return null; // Hide expensive torus on mobile

    return (
        <group ref={ref} rotation={[Math.PI / 3, 0, 0]} position={[0, -5, 0]}>
            <mesh>
                <torusGeometry args={[22, 0.02, 16, 50]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </mesh>
        </group>
    )
}

// Lightweight floating debris for extra detail without heavy rendering cost
function FloatingDebris() {
    const group = useRef<THREE.Group>(null!);
    const isMobile = useIsMobile();

    if (isMobile) return null;

    const debris = useMemo(() => {
        const count = isMobile ? 10 : 30;
        return new Array(count).fill(0).map((_, i) => {
            const t = (i / count) * Math.PI * 2;
            const radius = 24 + Math.random() * 5;
            const x = Math.cos(t) * radius;
            const y = (Math.random() - 0.5) * 10;
            const z = Math.sin(t) * radius;
            return {
                pos: [x, y, z] as [number, number, number],
                scale: 0.2 + Math.random() * 0.3,
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
            };
        });
    }, [isMobile]);

    useFrame((state) => {
        group.current.rotation.y = -state.clock.getElapsedTime() * 0.02;
    });

    return (
        <group ref={group}>
            {debris.map((data, i) => (
                <Float key={i} speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 1 : 2} floatIntensity={1}>
                    <mesh position={data.pos} rotation={data.rotation} scale={data.scale}>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#c4b5fd" : "#a855f7"}
                            roughness={0.4}
                            metalness={0.8}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export function HeroBackground3D() {
    const isMobile = useIsMobile();

    return (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/20 z-10 pointer-events-none" />

            {isMobile && <MobileHeroGlow />}

            {!isMobile && (
                <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
                    <AdaptiveDpr pixelated />
                    <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={35} near={0.1} far={100} />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[20, 20, 20]} angle={0.5} penumbra={1} intensity={1} color="#d8b4fe" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                    <Environment preset="city" resolution={128} />

                    <CrystalNetwork />
                    <FloatingDebris />
                    <OrbitalSystem />

                    <Sparkles
                        count={100}
                        scale={30}
                        size={2}
                        speed={0.3}
                        opacity={0.4}
                        color="#e9d5ff"
                    />
                </Canvas>
            )}
        </div>
    );
}
