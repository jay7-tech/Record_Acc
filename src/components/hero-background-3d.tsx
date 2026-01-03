"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function ParticleField() {
    const ref = useRef<THREE.Points>(null!);
    const { viewport } = useThree();

    // Create particles
    const count = 500;
    const position = useMemo(() => {
        const p = new Float32Array(count * 3);
        const spread = 15;
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * spread; // X
            p[i * 3 + 1] = (Math.random() - 0.5) * spread; // Y
            p[i * 3 + 2] = (Math.random() - 0.5) * spread; // Z
        }
        return p;
    }, []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Slight constant rotation
        ref.current.rotation.x -= delta * 0.05;
        ref.current.rotation.y -= delta * 0.03;

        // Mouse interaction (parallax)
        const x = (state.mouse.x * viewport.width) / 10;
        const y = (state.mouse.y * viewport.height) / 10;

        // Gentle lerping towards mouse
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y * 0.05, 0.05);
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.05, 0.05);
    });

    return (
        <Points ref={ref} positions={position} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#a855f7" // Purple
                size={0.06}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.5}
            />
        </Points>
    );
}

export function HeroBackground3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <ParticleField />
            </Canvas>
        </div>
    );
}
