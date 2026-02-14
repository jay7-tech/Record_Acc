"use client";

import { Badge } from "@/components/ui/badge";
import { Building2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

export function ExperienceCard({ exp, alwaysExpanded = false }: { exp: any, alwaysExpanded?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(alwaysExpanded);

    // Handle single image or array of images
    const images = exp.images || (exp.image ? [exp.image] : []);
    const hasMultipleImages = images.length > 1;

    // Ensure category has a fallback
    const category = exp.category || "Role";

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const toggleExpand = () => {
        if (!alwaysExpanded) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div
            onClick={toggleExpand}
            className={`
            group relative bg-card/40 border border-white/5 rounded-2xl p-6
            transition-all duration-300
            ${!alwaysExpanded ? 'cursor-pointer hover:border-primary/20 hover:bg-white/5' : ''}
            ${isExpanded ? 'bg-white/5 border-primary/20 shadow-2xl' : ''}
        `}
        >
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">

                {/* Header Row: Always Visible */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold font-headline text-primary group-hover:text-primary-foreground transition-colors flex items-center gap-3">
                            {exp.role}
                            {!alwaysExpanded && (
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    className="text-muted-foreground/50 transition-colors group-hover:text-primary"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            )}
                        </h3>
                        <div className="text-lg font-medium text-foreground/90 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary/70" />
                            {exp.organization}
                        </div>
                    </div>

                    {/* Gold Bar Badge - Right Aligned */}
                    <div className="self-start">
                        <div className="relative overflow-hidden shadow-[0_2px_10px_0_rgba(255,193,7,0.3)] rounded-lg transform group-hover:scale-105 transition-transform duration-300">
                            <Badge
                                className={`
                            rounded-md px-4 py-1.5 text-xs font-bold tracking-wider uppercase border-none
                            bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500
                            text-black shadow-none
                        `}
                            >
                                {/* Shine effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                {category}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Collapsible Body: Image & Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className={`flex flex-col ${alwaysExpanded ? 'gap-6' : 'md:flex-row gap-8'} items-start pt-4 border-t border-white/5 mt-2`}>

                                {/* Left Column: Clean Simple Image */}
                                <div
                                    className={`${alwaysExpanded ? 'w-full aspect-[16/9]' : 'w-full md:w-2/5 aspect-video md:aspect-[4/3] lg:aspect-video'} flex-shrink-0 relative rounded-xl overflow-hidden border border-white/10 bg-muted/20 shadow-2xl group/carousel transition-all duration-300`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <AnimatePresence mode="wait">
                                        {images.length > 0 ? (
                                            <motion.div
                                                key={currentIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative w-full h-full flex flex-col"
                                            >
                                                {images[currentIndex].toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-muted-foreground p-4 text-center">
                                                        <div className="bg-white/10 p-4 rounded-full mb-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 opacity-70"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M8 15a2 2 0 0 0 4 0 4 4 0 0 0-8 0" /></svg>
                                                        </div>
                                                        <span className="text-sm font-medium mb-1">Certificate Document</span>
                                                        <a
                                                            href={images[currentIndex]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-primary hover:underline underline-offset-4 mt-2"
                                                        >
                                                            Open PDF in new tab
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Blurred Background Layer to fill space */}
                                                        <Image
                                                            src={images[currentIndex]}
                                                            alt="background"
                                                            fill
                                                            className="object-cover blur-xl opacity-40 scale-110 grayscale"
                                                        />
                                                        {/* Main Image Layer - Fully Visible */}
                                                        <Image
                                                            src={images[currentIndex]}
                                                            alt={`${exp.role} - image ${currentIndex + 1}`}
                                                            fill
                                                            className="object-contain relative z-10"
                                                        />
                                                    </>
                                                )}

                                                {/* Simple Controls (only if multiple) */}
                                                {hasMultipleImages && (
                                                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity pointer-events-none">
                                                        <button
                                                            onClick={(e) => prevImage(e)}
                                                            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors pointer-events-auto"
                                                        >
                                                            <ChevronLeft className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => nextImage(e)}
                                                            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors pointer-events-auto"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>

                                                        {/* Dots Bottom */}
                                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur-sm pointer-events-auto">
                                                            {images.map((_: any, idx: number) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-muted-foreground">
                                                <Building2 className="w-12 h-12 opacity-30" />
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right Column: Details & Extra Meta */}
                                <div
                                    className="flex-1 space-y-4 text-left"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ul className="space-y-3">
                                        {exp.details.map((detail: string, i: number) => (
                                            <li key={i} className="text-muted-foreground/90 leading-relaxed flex gap-3 text-base">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
