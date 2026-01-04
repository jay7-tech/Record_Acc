import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProjectsPage() {
    const getImage = (id: string) => {
        return PlaceHolderImages.find((img) => img.id === id);
    };

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
                    {projects.map((project, index) => {
                        const image = project.images[0] ? getImage(project.images[0]) : null;

                        return (
                            <div key={index} className="group relative bg-card/50 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors">
                                {/* Image Area */}
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                                    {image && (
                                        <Image
                                            src={image.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <h2 className="text-2xl md:text-3xl font-bold font-headline leading-tight">{project.title}</h2>
                                            <div className="flex gap-2 shrink-0">
                                                <Button size="icon" variant="ghost" asChild className="rounded-full">
                                                    <Link href={project.githubUrl} target="_blank"><Github className="h-5 w-5" /></Link>
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {project.description.paragraph}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="px-3 py-1 bg-secondary/20 hover:bg-secondary/30 transition-colors">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
