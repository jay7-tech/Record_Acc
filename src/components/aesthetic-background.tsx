"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Star = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => (
    <motion.div
        className="absolute rounded-full bg-white dark:bg-white bg-black"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
        }}
        animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: delay,
            ease: "easeInOut",
        }}
    />
);

const Grid = () => (
    <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
);

const OrbitalLine = ({ size, duration, delay, reverse = false }: { size: number; duration: number; delay: number; reverse?: boolean }) => (
    <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 dark:border-white/5 border-dashed"
        style={{
            width: `${size}vw`,
            height: `${size}vw`,
            maxWidth: `${size * 10}px`,
            maxHeight: `${size * 10}px`,
        }}
        animate={{
            rotate: reverse ? -360 : 360,
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
        }}
    />
);

const TwinkleStar = ({ x, y, delay, duration }: { x: number; y: number; delay: number; duration: number }) => (
    <motion.div
        className="absolute"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180] }}
        transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "easeInOut" }}
    >
        <div className="w-[1px] h-4 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="w-4 h-[1px] bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
    </motion.div>
);

const SpaceDust = () => {
    const [dust, setDust] = useState<{ x: number; y: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        const newDust = Array.from({ length: 40 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 20 + 20, // Slow drift
            delay: Math.random() * 10,
        }));
        setDust(newDust);
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            {dust.map((d, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[2px] h-[2px] bg-white/30 rounded-full"
                    style={{ left: `${d.x}%`, top: `${d.y}%` }}
                    animate={{ y: [0, -100], x: [0, Math.random() * 50 - 25], opacity: [0, 0.5, 0] }}
                    transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "linear" }}
                />
            ))}
        </div>
    );
};

export function AestheticBackground() {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate static stars
        const newStars = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

            {/* 1. Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background dark:via-background/50 dark:to-background z-0" />

            {/* 2. Technical Grid */}
            <Grid />

            {/* 2.1 Nebula / Auroras */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse dark:opacity-30 opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse animation-delay-4000 dark:opacity-20 opacity-50 pointer-events-none" />

            {/* 2.2 Distant Planet */}
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/5 blur-2xl opacity-50 dark:opacity-80 pointer-events-none" />

            {/* 3. Space/Orbital Lines */}
            <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-50">
                <OrbitalLine size={40} duration={60} delay={0} />
                <OrbitalLine size={60} duration={80} delay={5} reverse />
                <OrbitalLine size={90} duration={100} delay={2} />
            </div>

            {/* 4. Stars */}
            <div className="absolute inset-0 z-0">
                {stars.map((star, i) => (
                    <Star key={i} {...star} />
                ))}
            </div>

            {/* 4.1 Twinkling Flare Stars (Big Crosses) */}
            <TwinkleStar x={15} y={25} delay={0} duration={4} />
            <TwinkleStar x={85} y={15} delay={2} duration={5} />
            <TwinkleStar x={50} y={80} delay={1} duration={6} />

            {/* 4.2 Floating Space Dust */}
            <SpaceDust />

            {/* 5. Shooting Star (Occasional) */}
            <motion.div
                className="absolute top-0 left-0 w-[100px] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ x: -100, y: 100, opacity: 0, rotate: 45 }}
                animate={{
                    x: ['0vw', '100vw'],
                    y: ['0vh', '100vh'],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 10,
                    ease: "easeIn"
                }}
            />

        </div>
    );
}
