'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export function HudOverlay() {
    const { scrollYProgress } = useScroll();
    const yRange = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] hidden lg:block opacity-30 select-none">
            {/* Top Left HUD */}
            <motion.div
                style={{ y: yRange }}
                className="absolute top-10 left-10 flex flex-col gap-1 font-mono text-[10px] text-primary"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span>SYSTEM_INTERFACE_v2.0</span>
                </div>
                <div className="w-24 h-[1px] bg-primary/30" />
                <span>LOC: BENGALURU_83.10</span>
            </motion.div>

            {/* Top Right HUD */}
            <motion.div
                style={{ y: yRange }}
                className="absolute top-10 right-10 flex flex-col items-end gap-1 font-mono text-[10px] text-primary"
            >
                <span>UPLINK: ACTIVE</span>
                <div className="w-24 h-[1px] bg-primary/30" />
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-1.5 h-3 bg-primary/20">
                            <motion.div
                                animate={{ height: ['20%', '100%', '20%'] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-full bg-primary"
                            />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Bottom Left Corner Decoration */}
            <div className="absolute bottom-10 left-10 w-16 h-16 border-l border-b border-primary/20">
                <div className="absolute top-0 left-0 w-2 h-0.5 bg-primary" />
                <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-primary" />
            </div>

            {/* Bottom Right Corner Decoration */}
            <div className="absolute bottom-10 right-10 w-16 h-16 border-r border-b border-primary/20">
                <div className="absolute top-0 right-0 w-2 h-0.5 bg-primary" />
                <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-primary" />
            </div>
        </div>
    );
}
