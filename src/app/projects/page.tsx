import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsPage() {
    // Dummy data for the projects page
    const projects = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        title: `Project ${i + 1}`,
        description: "A brief description of this awesome project. It solves a real-world problem and uses cutting-edge tech.",
        tags: ["React", "Next.js", "TypeScript", "Tailwind"],
        image: `/images/project-assets/icon.54fa1035.jpg`, // Using existing asset as placeholder
        link: "#",
        github: "#"
    }));

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                        <h1 className="text-4xl md:text-6xl font-headline font-bold">
                            All <span className="text-primary">Projects</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                            A comprehensive list of my technical projects, experiments, and open-source contributions.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project) => (
                        <div key={project.id} className="group relative bg-card/50 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors">
                            {/* Image Area */}
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                                {/* Placeholder for project image */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-9xl font-bold select-none">
                                    {project.id + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl md:text-3xl font-bold font-headline">{project.title}</h2>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild className="rounded-full">
                                                <Link href={project.github}><Github className="h-5 w-5" /></Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" asChild className="rounded-full">
                                                <Link href={project.link}><ExternalLink className="h-5 w-5" /></Link>
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1 bg-secondary/20 hover:bg-secondary/30 transition-colors">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
