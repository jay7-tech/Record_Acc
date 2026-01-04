"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, Sparkles, PerspectiveCamera, Environment, MeshTransmissionMaterial } from "@react-three/drei";

// Complex Interconnected Crystal Network - Ring Configuration
function CrystalNetwork() {
    const group = useRef<THREE.Group>(null!);
    const { mouse, viewport } = useThree();

    const connections = useMemo(() => {
        const points = [];
        const lines = [];
        const count = 18; // Slightly increased for richness

        for (let i = 0; i < count; i++) {
            // WIDER Ring distribution to strictly orbit OUTSIDE text
            const t = (i / count) * Math.PI * 2;
            const radius = 20; // Increased to 20 to ensure it's wide enough
            // Flatter, more horizontal distribution
            const x = Math.cos(t) * radius;
            const y = Math.sin(t * 3) * 2; // More vertical wave for aesthetics
            const z = Math.sin(t) * radius;
            points.push({
                pos: new THREE.Vector3(x, y, z),
                size: Math.random() > 0.8 ? 1.2 : 0.5 + Math.random() * 0.4 // 20% chance of big crystal
            });
        }

        // Connect points
        for (let i = 0; i < count; i++) {
            lines.push([points[i].pos, points[(i + 1) % count].pos]);
        }

        return { points, lines };
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Constant smooth rotation
        group.current.rotation.y = time * 0.05;

        // Interactive tilt - Subtle and smooth lerp
        const x = (mouse.x * viewport.width) / 100;
        const y = (mouse.y * viewport.height) / 100;

        // Limit tilt to prevent clipping
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.02);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -x * 0.05, 0.02);
    });

    return (
        <group ref={group} rotation={[0.1, 0, 0]}> {/* Minimal initial tilt */}
            {/* Glass Crystals at Nodes */}
            {connections.points.map((data, i) => (
                <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={data.pos}>
                        <dodecahedronGeometry args={[data.size, 0]} />
                        <MeshTransmissionMaterial
                            backside={false} // Optimized: Don't render backside
                            samples={4}      // Optimized: Low sample count (default is often 16+)
                            resolution={256} // Optimized: Low resolution buffer
                            thickness={2}
                            roughness={0}
                            transmission={1}
                            ior={1.6}
                            chromaticAberration={0.4} // The "rainbow" look is back
                            anisotropy={0.3}
                            color={i % 2 === 0 ? "#c084fc" : "#93c5fd"} // Lighter colors (Purple 400 / Blue 300)
                            distortion={0.1}
                            distortionScale={0.3}
                            temporalDistortion={0.1}
                        />
                    </mesh>
                </Float>
            ))}

            {/* Glowing Energy Lines */}
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

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.rotation.z = time * 0.02;
    });

    return (
        <group ref={ref} rotation={[Math.PI / 3, 0, 0]} position={[0, -5, 0]}>
            {/* Main Ring - Adjusted size and lowered segments */}
            <mesh>
                <torusGeometry args={[22, 0.02, 16, 50]} /> {/* Reduced radialSegments 100 -> 50 */}
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </mesh>
        </group>
    )
}

// Lightweight floating debris for extra detail without heavy rendering cost
function FloatingDebris() {
    const group = useRef<THREE.Group>(null!);

    // Generate static random data for debris
    const debris = useMemo(() => {
        return new Array(30).fill(0).map((_, i) => {
            const t = (i / 30) * Math.PI * 2;
            const radius = 24 + Math.random() * 5; // Wider orbit than main crystals
            const x = Math.cos(t) * radius;
            const y = (Math.random() - 0.5) * 10; // More vertical spread
            const z = Math.sin(t) * radius;
            return {
                pos: [x, y, z] as [number, number, number],
                scale: 0.2 + Math.random() * 0.3,
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
            };
        });
    }, []);

    useFrame((state) => {
        // Slow counter-rotation
        group.current.rotation.y = -state.clock.getElapsedTime() * 0.02;
    });

    return (
        <group ref={group}>
            {debris.map((data, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={1}>
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
    return (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/20 z-10 pointer-events-none" />

            {/* Optimized canvas settings for performance */}
            <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                {/* Adjusted Camera: MUCH Further back (35) with tighter FOV (35) to prevent front clipping */}
                <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={35} near={0.1} far={100} />

                <ambientLight intensity={0.5} />
                <spotLight position={[20, 20, 20]} angle={0.5} penumbra={1} intensity={1} color="#d8b4fe" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                {/* HDRI Environment for real glass reflections */}
                {/* Lower resolution environment */}
                <Environment preset="city" resolution={256} />

                <CrystalNetwork />
                <FloatingDebris />
                <OrbitalSystem />

                <Sparkles
                    count={100} // Reduced 150 -> 100
                    scale={30}
                    size={2}
                    speed={0.3}
                    opacity={0.4}
                    color="#e9d5ff"
                />
            </Canvas>
        </div>
    );
}
