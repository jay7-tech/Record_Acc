"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Building2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { experiences, certifications, impactMetrics } from "@/lib/data";
import { useState } from "react";
import { ExperienceCard } from "@/components/experience-card";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ExperiencePage() {
    // Keep only work/leadership in the timeline
    const allExperiences = [
        ...experiences.map((exp: any) => ({
            ...exp,
            category: exp.category || "Experience",
            location: exp.location || "Bangalore, India",
            images: exp.images || (exp.image ? [exp.image] : [])
        })),
        {
            role: "Robotics Club Co-Head",
            organization: "College Robotics Society (ROBO CELL)",
            details: [
                "Collaborated with the team on the end-to-end building and prototyping of diverse multi-disciplinary robotics projects.",
                "Contributed to organizing technical workshops and club events aimed at fostering innovation and hands-on learning within ROBO CELL."
            ],
            images: [
                "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=800&auto=format&fit=crop"
            ],
            category: "Leadership",
            location: "Bangalore, India"
        },
        {
            role: "Freelance Web Developer",
            organization: "Self-Employed",
            details: [
                "Delivered custom portfolio websites for local businesses using React and Tailwind.",
                "Optimized site performance, achieving 95+ Lighthouse scores.",
                "Managed client requirements and delivered projects on strict timelines."
            ],
            images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"],
            category: "Freelance",
            location: "Remote"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-32">

                {/* Header */}
                <div className="space-y-6 relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary relative z-10 transition-colors">
                        <Link href="/#experience" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Portfolio
                        </Link>
                    </Button>
                    <div className="relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-headline font-bold"
                        >
                            Professional <span className="text-primary">Journey</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground mt-4 text-xl max-w-2xl leading-relaxed"
                        >
                            Architecting intelligent systems and leading technical innovation through hands-on experience and validated expertise.
                        </motion.p>
                    </div>
                </div>

                {/* EXPERIENCE TIMELINE */}
                <div className="space-y-32">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-headline font-bold">Experience & Leadership</h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </div>

                    <div className="space-y-24">
                        {allExperiences.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            const displayImage = (exp.images && exp.images.length > 0) ? exp.images[0] : ((exp as any).image || "");

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="flex flex-col md:flex-row items-center gap-12 md:gap-16 relative"
                                >
                                    {/* IMAGE SIDE */}
                                    <div className={`w-full md:w-1/2 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                        <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl skew-y-0 hover:skew-y-1 transition-transform duration-500">
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-overlay" />

                                            {displayImage ? (
                                                <div className="relative aspect-[16/9] md:aspect-[4/3] w-full overflow-hidden">
                                                    <Image
                                                        src={displayImage}
                                                        alt={exp.role}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONTENT SIDE */}
                                    <div className={`w-full md:w-1/2 space-y-6 ${isEven ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
                                        <div className={`space-y-2 flex flex-col ${isEven ? '' : 'md:items-end'}`}>
                                            <Badge variant="outline" className="w-fit text-primary border-primary/30 px-4 py-1.5 bg-primary/5 rounded-full">
                                                {typeof exp.category === 'string' ? exp.category : 'Experience'}
                                            </Badge>
                                            <h2 className="text-3xl md:text-5xl font-bold font-headline leading-tight text-foreground/90">
                                                {exp.role}
                                            </h2>
                                            <h3 className="text-xl font-medium text-muted-foreground flex items-center gap-2">
                                                <Building2 className={`w-5 h-5 text-primary ${!isEven && 'md:order-2'}`} />
                                                {exp.organization}
                                            </h3>
                                        </div>

                                        <ul className={`space-y-4 text-muted-foreground/80 leading-relaxed text-lg ${isEven ? '' : 'md:items-end flex flex-col'}`}>
                                            {exp.details.map((detail: string, i: number) => (
                                                <li key={i} className={`flex gap-4 ${isEven ? 'items-start' : 'items-start md:flex-row-reverse md:text-right'}`}>
                                                    <span className={`mt-2.5 w-2 h-2 rounded-full bg-primary/40 flex-shrink-0`} />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={`pt-6 flex items-center gap-2 text-sm text-muted-foreground/60 ${isEven ? '' : 'md:justify-end'}`}>
                                            <MapPin className="w-4 h-4" />
                                            {exp.location}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CERTIFICATIONS BENTO GRID */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-headline font-bold">Validated Expertise</h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[350px]">
                        {certifications.map((cert: any, i: number) => {
                            // Balanced layout for 4 items: Row 1 (8, 4), Row 2 (4, 8)
                            const isLarge = i === 0 || i === 3;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative group rounded-3xl overflow-hidden border border-white/5 bg-secondary/20 shadow-xl ${isLarge ? 'md:col-span-8' : 'md:col-span-4'}`}
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-0 z-0 text-left">
                                        <Image
                                            src={cert.image}
                                            alt={cert.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.25] group-hover:brightness-[0.35]"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-30`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
                                    </div>

                                    {/* Content Area */}
                                    <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end text-left">
                                        <Badge className="w-fit mb-4 bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md">
                                            {cert.category}
                                        </Badge>
                                        <h3 className={`font-headline font-bold text-white mb-2 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                                            {cert.title}
                                        </h3>
                                        <p className="text-white/70 text-sm line-clamp-2 max-w-md">
                                            {cert.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="text-xs font-bold text-primary tracking-widest uppercase">
                                                {cert.issuer}
                                            </div>
                                            {cert.link && (
                                                <Button size="sm" variant="ghost" className="text-white hover:text-primary p-0 h-auto" asChild>
                                                    <Link href={cert.link} target="_blank" className="flex items-center gap-1">
                                                        View Certificate
                                                        <Plus className="w-4 h-4 rotate-45" /> {/* Using Plus rotated as X/Link icon */}
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Spacer */}
                <div className="h-20" />
            </div>
        </div>
    );
}
