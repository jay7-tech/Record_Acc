"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Entity {
    id: number;
    x: number;
    y: number;
    startX?: number;
    startY?: number;
    angle?: number;
    color: string;
    type: "projectile" | "explosion";
}

export function ClickSparkle() {
    const [entities, setEntities] = useState<Entity[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const id = Date.now();

            // Target position
            const targetX = e.clientX;
            const targetY = e.clientY;

            // Start position (Top Center Header Area)
            // Spread slightly so they don't all look identical
            const startX = (window.innerWidth / 2) + ((Math.random() - 0.5) * 100);
            const startY = -50; // Start slightly off-screen

            // Calculate angle
            const deltaX = targetX - startX;
            const deltaY = targetY - startY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            const newProjectile: Entity = {
                id,
                x: targetX,
                y: targetY,
                startX,
                startY,
                angle,
                type: "projectile",
                color: Math.random() > 0.5 ? "#60A5FA" : "#A78BFA", // Blue or Purple base
            };

            setEntities((prev) => [...prev, newProjectile]);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handleAnimationComplete = (id: number, x: number, y: number, color: string) => {
        // Remove projectile
        setEntities((prev) => prev.filter((e) => e.id !== id));

        // Spawn Explosion at target
        const explosionId = Date.now() + Math.random();
        const explosion: Entity = {
            id: explosionId,
            x,
            y,
            color,
            type: "explosion"
        };

        setEntities((prev) => [...prev, explosion]);

        // Cleanup explosion after animation
        setTimeout(() => {
            setEntities((prev) => prev.filter((e) => e.id !== explosionId));
        }, 600);
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            <AnimatePresence>
                {entities.map((entity) => {
                    if (entity.type === "projectile") {
                        return (
                            <motion.div
                                key={entity.id}
                                initial={{
                                    x: entity.startX,
                                    y: entity.startY,
                                    opacity: 0,
                                    scale: 0.5
                                }}
                                animate={{
                                    x: entity.x,
                                    y: entity.y,
                                    opacity: 1,
                                    scale: 1
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "linear" // Linear for projectile feel
                                }}
                                onAnimationComplete={() => handleAnimationComplete(entity.id, entity.x, entity.y, entity.color)}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                }}
                                className="flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            >
                                {/* Asteroid Core */}
                                <div
                                    className="w-3 h-3 bg-white rounded-full relative z-10"
                                />
                                {/* Flaming Head */}
                                <div
                                    className="absolute w-6 h-6 rounded-full blur-[2px] opacity-80"
                                    style={{ backgroundColor: entity.color }}
                                />

                                {/* Fiery Trail */}
                                <div
                                    className="absolute h-[6px] rounded-full origin-right blur-[1px]"
                                    style={{
                                        width: '180px',
                                        right: '2px',
                                        rotate: `${entity.angle}deg`,
                                        background: `linear-gradient(to right, transparent, ${entity.color}, white)`
                                    }}
                                />
                            </motion.div>
                        );
                    } else {
                        // Explosion Entity
                        return (
                            <motion.div
                                key={entity.id}
                                initial={{ x: entity.x, y: entity.y, scale: 0, opacity: 1 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{ position: "absolute", left: 0, top: 0, translateX: "-50%", translateY: "-50%" }}
                                className="relative flex items-center justify-center"
                            >
                                {/* Shockwave Ring */}
                                <div
                                    className="absolute inset-0 rounded-full border-2 border-white opacity-80"
                                    style={{ width: 40, height: 40 }}
                                />
                                {/* Core Burst */}
                                <div
                                    className="w-20 h-20 rounded-full blur-md opacity-60"
                                    style={{ backgroundColor: entity.color }}
                                />
                                {/* Spark particles (Simulated with distinct dots in a grid) */}
                                <div className="absolute w-full h-full animate-spin">
                                    <div className="absolute top-0 left-1/2 w-1 h-3 bg-white blur-[1px]" />
                                    <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-white blur-[1px]" />
                                    <div className="absolute left-0 top-1/2 w-3 h-1 bg-white blur-[1px]" />
                                    <div className="absolute right-0 top-1/2 w-3 h-1 bg-white blur-[1px]" />
                                </div>
                            </motion.div>
                        );
                    }
                })}
            </AnimatePresence>
        </div>
    );
}
