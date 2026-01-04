"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles, Float, Cloud } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function ShootingStar() {
    const ref = useRef<THREE.Mesh>(null!);
    const [active, setActive] = useState(false);

    // Random start position and speed
    const [startPos] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 + 10,
        (Math.random() - 0.5) * 10 - 10
    ));

    useFrame((state, delta) => {
        if (!active) {
            if (Math.random() > 0.995) { // 0.5% chance per frame to start
                setActive(true);
                ref.current.position.copy(startPos);
                ref.current.visible = true;
            }
            return;
        }

        // Move the star
        ref.current.position.x -= delta * 15; // Move left
        ref.current.position.y -= delta * 5;  // Move down

        // Reset if out of bounds
        if (ref.current.position.x < -30 || ref.current.position.y < -20) {
            setActive(false);
            ref.current.visible = false;
            // Reset random Y for variety
            startPos.y = (Math.random() - 0.5) * 20 + 10;
        }
    });

    return (
        <mesh ref={ref} visible={false}>
            <cylinderGeometry args={[0.05, 0, 4]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
    );
}

function CosmicField() {
    const groupRef = useRef<THREE.Group>(null!);
    const { mouse, viewport } = useThree();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Constant rotation for the galaxy
        groupRef.current.rotation.z -= delta * 0.005;

        // Interactive movement based on mouse (Parallax)
        const x = (mouse.x * viewport.width) / 25;
        const y = (mouse.y * viewport.height) / 25;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.1, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.1, 0.05);
    });

    return (
        <group ref={groupRef}>
            {/* Deep space stars - denser and further */}
            <Stars
                radius={300}
                depth={100}
                count={8000}
                factor={6}
                saturation={0.5}
                fade
                speed={1}
            />

            {/* Nebula Clouds - Volumetric effect */}
            <group position={[0, -2, -15]}>
                <Cloud opacity={0.1} speed={0.4} bounds={[20, 2, 2]} segments={20} color="#6d28d9" /> {/* Purple */}
                <Cloud opacity={0.1} speed={0.4} bounds={[20, 2, 2]} segments={20} color="#1e40af" position={[10, 5, 0]} /> {/* Blue */}
            </group>

            {/* Floating Sparkles - Closer interactive elements */}
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sparkles
                    color="#d8b4fe" // Light Purple
                    count={300}
                    scale={18}
                    size={3}
                    speed={0.4}
                    opacity={0.6}
                    noise={0.2}
                />
                <Sparkles
                    color="#93c5fd" // Light Blue
                    count={200}
                    scale={20}
                    size={4}
                    speed={0.3}
                    opacity={0.5}
                    noise={0.3}
                />
            </Float>

            {/* Shooting Stars */}
            <group rotation={[0, 0, Math.PI / 4]}>
                <ShootingStar />
                <ShootingStar />
                <ShootingStar />
            </group>
        </group>
    );
}

export function HeroBackground3D() {
    return (
        <div className="absolute inset-0 z-0">
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10 pointer-events-none" />

            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
                {/* Ambient light for clouds */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />

                <CosmicField />
                {/* Fog to blend distant stars */}
                <fog attach="fog" args={['#020617', 5, 30]} />
            </Canvas>
        </div>
    );
}
