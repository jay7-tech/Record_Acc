"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { experiences } from "@/lib/data";
import { useState } from "react";
import { ExperienceCard } from "@/components/experience-card";
import Image from "next/image";

export default function ExperiencePage() {
    // Combine real experiences with some expanded/older ones for the "full list" feel
    const allExperiences = [
        ...experiences.map(exp => ({
            ...exp,
            category: "Work Experience",
            date: "2024 - Present",
            location: "Bangalore, India",
            // Prioritize the array we just added in data.ts
            images: exp.images || (exp.image ? [exp.image] : [])
        })),
        {
            role: "Robotics Club Lead",
            organization: "College Robotics Society",
            details: [
                "Mentored 50+ juniors in Arduino and Raspberry Pi foundations.",
                "Organized 3 internal hackathons focusing on IoT solutions.",
                "Led the college team to regional victories in line-follower competitions."
            ],
            images: [
                "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=800&auto=format&fit=crop", // Robotics Arm
                "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=800&auto=format&fit=crop"  // Workshop
            ],
            category: "Leadership",
            date: "2023 - Present",
            location: "Bangalore, India"
        },
        {
            role: "Advanced Python Certification",
            organization: "Coursera / University of Michigan",
            details: [
                "Mastered data structures, databases, and visualized data using Python.",
                "Completed strict capstone project analyzing real-world datasets."
            ],
            images: ["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"], // Code/Matrix
            category: "Certificate",
            date: "2023",
            location: "Online"
        },
        {
            role: "Freelance Web Developer",
            organization: "Self-Employed",
            details: [
                "Delivered custom portfolio websites for local businesses using React and Tailwind.",
                "Optimized site performance, achieving 95+ Lighthouse scores.",
                "Managed client requirements and delivered projects on strict timelines."
            ],
            images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"], // Web Design/Laptop
            category: "Freelance",
            date: "2022 - 2023",
            location: "Remote"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="space-y-6">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                        <Link href="/#experience" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Portfolio
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-headline font-bold">
                            Professional <span className="text-primary">Journey</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
                            A detailed timeline of my roles, leadership positions, and technical contributions.
                        </p>
                    </div>
                </div>

                {/* Clean Creative Z-Pattern Layout */}
                <div className="space-y-24 mt-12 md:mt-20">
                    {allExperiences.map((exp, index) => {
                        const isEven = index % 2 === 0;
                        const displayImage = (exp.images && exp.images.length > 0) ? exp.images[0] : ((exp as any).image || "");

                        return (
                            <div key={index}
                                className="flex flex-col md:flex-row items-center gap-12 md:gap-16"
                            >
                                {/* IMAGE SIDE */}
                                <div className={`w-full md:w-1/2 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                    <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                        {/* Image overlay/interaction */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />

                                        {displayImage ? (
                                            <div className="relative aspect-[16/9] md:aspect-[4/3] w-full overflow-hidden">
                                                <Image
                                                    src={displayImage}
                                                    alt={exp.role}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                                                No Image
                                            </div>
                                        )}

                                        {/* Floating Badge on Image */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-primary border border-primary/20 shadow-lg">
                                                {exp.date}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT SIDE */}
                                <div className={`w-full md:w-1/2 space-y-6 ${isEven ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
                                    <div className={`space-y-2 flex flex-col ${isEven ? '' : 'md:items-end'}`}>
                                        <Badge variant="outline" className="w-fit text-primary border-primary/30 px-3 py-1 bg-primary/5">
                                            {typeof exp.category === 'string' ? exp.category : 'Experience'}
                                        </Badge>
                                        <h2 className="text-3xl md:text-4xl font-bold font-headline leading-tight text-foreground/90">
                                            {exp.role}
                                        </h2>
                                        <h3 className="text-xl font-medium text-muted-foreground flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            {exp.organization}
                                        </h3>
                                    </div>

                                    <ul className={`space-y-3 text-muted-foreground/80 leading-relaxed text-lg ${isEven ? '' : 'md:items-end flex flex-col'}`}>
                                        {exp.details.map((detail: string, i: number) => (
                                            <li key={i} className={`flex gap-3 ${isEven ? 'items-start' : 'items-start md:flex-row-reverse md:text-right'}`}>
                                                <span className={`mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 ${isEven ? '' : 'order-1'} `} />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={`pt-4 flex items-center gap-2 text-sm text-muted-foreground/60 ${isEven ? '' : 'md:justify-end'}`}>
                                        <MapPin className="w-4 h-4" />
                                        {exp.location}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="text-center pt-32 pb-12 text-muted-foreground z-10 relative">
                    <p className="text-lg mb-4">Want to see the full timeline?</p>
                    <Button size="lg" className="rounded-full px-8 text-lg hover:shadow-lg hover:shadow-primary/20 transition-all font-bold" asChild>
                        <Link href="/resume.pdf" target="_blank">View CV</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
