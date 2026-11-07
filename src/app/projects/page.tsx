import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { TextDecoder } from "@/components/ui/text-decoder";
import { hexToRgba } from "@/lib/utils";

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
                            <TextDecoder text="All" /> <TextDecoder text="Projects" className="text-primary" />
                        </h1>
                        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                            My technical projects, experiments, and open source work.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, index) => {
                        const image = project.images[0] ? getImage(project.images[0]) : null;
                        const accentVars = {
                            '--accent-border': hexToRgba(project.color, 0.22),
                            '--accent-border-strong': hexToRgba(project.color, 0.5),
                            '--accent-text': hexToRgba(project.color, 1),
                        } as React.CSSProperties;

                        return (
                            <div
                                key={index}
                                style={accentVars}
                                className="group relative bg-card/50 border border-[var(--accent-border)] rounded-3xl overflow-hidden hover:border-[var(--accent-border-strong)] transition-colors"
                            >
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
                                <div className="p-5 sm:p-6 md:p-8 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-3">
                                            <h2 className="min-w-0 flex-1 break-words text-xl sm:text-2xl md:text-3xl font-bold font-headline leading-tight">{project.title}</h2>
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
                                        {project.tags.map((tag, i) => {
                                            const Icon = tag.icon;
                                            return (
                                                <Badge key={i} variant="outline" className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full border-[var(--accent-border)] bg-background/50 text-foreground/80">
                                                    <span
                                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                                        style={{ background: 'var(--accent-border)' }}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent-text)' }} />
                                                    </span>
                                                    {tag.name}
                                                </Badge>
                                            );
                                        })}
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
