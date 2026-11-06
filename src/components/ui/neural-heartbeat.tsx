'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = [
    "NEURAL ENGINE: ACTIVE",
    "LLM LATENCY: 12ms",
    "AGENTIC FLOW: STABLE",
    "ROBOTIC CORE: SYNCED",
    "QUANTUM LOGIC: READY",
    "SYSTEM ENTROPY: 0.04%",
    "PERFECTION RATIO: 100%"
];

export function NeuralHeartbeat() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % statuses.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-widest text-primary/70 uppercase">
            <div className="relative h-2 w-2">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
                <div className="absolute inset-0 rounded-full bg-primary opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>

            <div className="flex h-5 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center whitespace-nowrap"
                    >
                        {statuses[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
