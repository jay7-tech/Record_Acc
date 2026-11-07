"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { GithubStats } from '../github-stats';
import { projects, type Project } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedSection } from '../animated-section';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Activity, MapPin } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { TextDecoder } from '../ui/text-decoder';
import { hexToRgba } from '@/lib/utils';

function getImage(id: string) {
  return PlaceHolderImages.find((img) => img.id === id);
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const projectImages = project.images
    .map((id) => getImage(id))
    .filter((img): img is NonNullable<ReturnType<typeof getImage>> => !!img);

  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse-tracked tilt — subtle, premium parallax on the whole card
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  // Cursor-tracked spotlight — same mousemove frame as the tilt, no extra listener
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const accentSoft = hexToRgba(project.color, 0.14);
  const spotlightBackground = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, ${accentSoft}, transparent 70%)`;

  // Each project carries its own accent hex (MEMO's steel blue, Cognis's violet,
  // Rila's emerald, etc.) — surfaced here as CSS variables so the card border,
  // bullets and quote actually look distinct from one project to the next
  // instead of every card defaulting to the same sky-blue signal color.
  const accentVars = {
    '--accent-border': hexToRgba(project.color, 0.22),
    '--accent-border-strong': hexToRgba(project.color, 0.45),
    '--accent-glow': hexToRgba(project.color, 0.22),
    '--accent-text': hexToRgba(project.color, 1),
  } as React.CSSProperties;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const uniqueTop = 80 + index * 50;
  const indexLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <motion.div
      key={project.title}
      style={{ position: 'sticky', top: `${uniqueTop}px`, zIndex: index + 10 }}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 50 },
        show: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 50, damping: 20, duration: 0.8 },
        },
      }}
      className="group relative isolate"
    >
      {/* Animated conic glow ring, visible on hover */}
      <div className="glow-border absolute inset-0 rounded-3xl" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transformPerspective: 1200,
          ...accentVars,
        }}
        className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--accent-border)] via-card/90 to-card/90 border border-[var(--accent-border)] backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-700 hover:border-[var(--accent-border-strong)] hover:shadow-[0_30px_60px_-10px_var(--accent-glow)]"
      >
        {/* Cursor-tracked spotlight glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlightBackground }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 px-8 items-center relative z-10">

          {/* Image Side (Left) */}
          <div className="lg:col-span-6 relative w-full group cursor-pointer perspective-1000">
            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-border bg-gradient-to-br from-foreground/5 via-foreground/[0.02] to-transparent backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative w-full h-full flex items-center justify-center">

                {project.animationType === 'deck-shuffle' && (
                  <div className="relative w-full h-full perspective-1000">
                    {projectImages[1] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700 ease-in-out
                                z-10 scale-95 translate-x-4
                                group-hover:z-30 group-hover:scale-100 group-hover:translate-x-0">
                        <Image src={projectImages[1].imageUrl} alt="Back" fill className="object-cover" />
                      </div>
                    )}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700 ease-in-out
                                z-20 scale-100 rotate-0
                                group-hover:z-0 group-hover:scale-90 group-hover:-translate-x-12 group-hover:rotate-12 group-hover:brightness-50">
                        <Image src={projectImages[0].imageUrl} alt="Front" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {project.animationType === 'perspective-push' && (
                  <div className="relative w-full h-full perspective-1000">
                    {projectImages[1] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                                z-10 scale-90 opacity-0 translate-y-8
                                group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0">
                        <Image src={projectImages[1].imageUrl} alt="Reveal" fill className="object-cover" />
                      </div>
                    )}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                                z-20 transform-style-3d
                                group-hover:translate-z-[-200px] group-hover:rotate-x-12 group-hover:opacity-0 group-hover:scale-75">
                        <Image src={projectImages[0].imageUrl} alt="Cover" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {project.animationType === 'vertical-shuffle' && (
                  <div className="relative w-full h-full perspective-1000">
                    {projectImages[1] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                                z-10 scale-90 translate-y-12 brightness-50
                                group-hover:z-30 group-hover:scale-100 group-hover:translate-y-0 group-hover:brightness-100">
                        <Image src={projectImages[1].imageUrl} alt="Back" fill className="object-cover" />
                      </div>
                    )}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                                z-20 scale-100
                                group-hover:z-10 group-hover:scale-90 group-hover:translate-y-16 group-hover:brightness-50">
                        <Image src={projectImages[0].imageUrl} alt="Front" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {project.animationType === 'quad-gallery' && (
                  <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full h-full transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
                      {projectImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-border shadow-lg group/item">
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors z-10" />
                          <Image src={img.imageUrl} alt={img.description} fill className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.animationType === 'parallax-fan' && (
                  <>
                    {projectImages[1] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                               z-10 scale-[0.95] translate-y-0 translate-x-0 rotate-0 brightness-50
                               group-hover:z-30 group-hover:scale-105 group-hover:-translate-y-8 group-hover:-translate-x-2 group-hover:rotate-1 group-hover:brightness-100">
                        <Image src={projectImages[1].imageUrl} alt="Back Card" fill className="object-cover" />
                      </div>
                    )}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-700
                               z-20 scale-100 rotate-0
                               group-hover:scale-[0.92] group-hover:-translate-x-16 group-hover:translate-y-4 group-hover:-rotate-4 group-hover:brightness-75">
                        <Image src={projectImages[0].imageUrl} alt="Front Card" fill className="object-cover" />
                      </div>
                    )}
                  </>
                )}

                {project.animationType === '3d-flip-reveal' && (
                  <div className="relative w-full h-full [perspective:1000px]">
                    {projectImages[1] && (
                      <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-border bg-background shadow-2xl
                                 [backface-visibility:hidden] [transform-style:preserve-3d] transition-transform duration-700 ease-out
                                 [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)]">
                        <Image src={projectImages[1].imageUrl} alt="Revealed View" fill className="object-cover" />
                      </div>
                    )}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-border bg-background shadow-2xl
                                 [backface-visibility:hidden] [transform-style:preserve-3d] transition-transform duration-700 ease-out
                                 [transform:rotateY(0deg)] group-hover:[transform:rotateY(-180deg)]">
                        <Image src={projectImages[0].imageUrl} alt="Front View" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                          <span className="text-white text-sm font-medium mono-label">Hover to reveal</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {project.animationType === 'cinematic-hover' && (
                  <div className="relative w-full h-full overflow-hidden rounded-xl">
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-105">
                        <Image src={projectImages[0].imageUrl} alt={project.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                      </div>
                    )}
                    {projectImages[1] && (
                      <div className="absolute bottom-4 right-4 w-[40%] aspect-video rounded-lg overflow-hidden border border-white/30 shadow-2xl
                                    transform translate-y-[120%] opacity-0
                                    transition-all duration-700
                                    group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-[-2deg]">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10" />
                        <Image src={projectImages[1].imageUrl} alt="Detail View" fill className="object-cover" />
                      </div>
                    )}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}

                {project.animationType === 'map-ping-reveal' && (
                  <div className="relative w-full h-full overflow-hidden rounded-xl bg-background">
                    {/* Base layer: the reel/app view, always visible */}
                    {projectImages[0] && (
                      <div className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110">
                        <Image src={projectImages[0].imageUrl} alt={project.title} fill className="object-cover" />
                      </div>
                    )}

                    {/* Second layer: the map/pipeline view, masked behind a circular
                        "radar ping" that expands outward from a pin on hover — a reel
                        turning into a map, rather than another sliding inset card. */}
                    {projectImages[1] && (
                      <div
                        className="absolute inset-0 w-full h-full transition-[clip-path] duration-1000 ease-out [clip-path:circle(0%_at_50%_55%)] group-hover:[clip-path:circle(85%_at_50%_55%)]"
                      >
                        <Image src={projectImages[1].imageUrl} alt="Map view" fill className="object-cover" />
                      </div>
                    )}

                    {/* The pin itself: idles gently at rest, pulses outward like a
                        live-location ping the moment the card is hovered. */}
                    <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute inset-0 -m-5 rounded-full border-2 opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 group-hover:animate-ping" style={{ borderColor: 'var(--accent-text)' }} />
                      <MapPin
                        className="relative h-7 w-7 drop-shadow-lg transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-1"
                        style={{ color: 'var(--accent-text)' }}
                        fill="var(--accent-text)"
                        fillOpacity={0.15}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Content Side (Right) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="mono-label text-xs mb-2" style={{ color: 'var(--accent-text)' }}>{indexLabel} / {totalLabel}</span>
            <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-4 flex items-start gap-3 text-foreground break-words">
              <span>{project.title}</span>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="mt-1.5 shrink-0">
                <Activity className="h-5 w-5" style={{ color: 'var(--accent-text)' }} />
              </motion.div>
            </h3>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {project.description.paragraph}
            </p>

            <ul className="mb-8 space-y-3.5">
              {project.description.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3.5 text-muted-foreground">
                  <span
                    className="relative mt-[7px] flex h-[7px] w-[7px] shrink-0 rotate-45 rounded-[2px] border"
                    style={{ borderColor: 'var(--accent-border-strong)', background: 'var(--accent-border)', boxShadow: '0 0 8px var(--accent-glow)' }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {project.recognition && (
              <p
                className="mb-6 text-sm font-semibold text-foreground/80 italic leading-relaxed border-l-2 pl-4"
                style={{ borderColor: 'var(--accent-border-strong)' }}
              >
                {project.recognition}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <Badge key={tag.name} variant="outline" className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full bg-background/50 backdrop-blur-sm border-border text-foreground/80">
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

              <Button asChild size="sm" variant="outline" className="rounded-full border-border bg-background/50 hover:bg-background hover:border-[var(--accent-border-strong)] text-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0">
                <Link href={project.githubUrl} target="_blank">
                  <SiGithub className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export function CuratedWorkSection() {
  const featured = projects.filter((p) => p.isFeatured);

  return (
    <AnimatedSection id="projects">
      <div className="text-center">
        <p className="mono-label text-sm text-muted-foreground">/ 04 Build Records</p>
        <h2 className="font-headline text-4xl md:text-5xl mt-2 uppercase tracking-tighter">
          <TextDecoder text="Curated" /> <TextDecoder text="Work" className="text-gradient-signal" />
        </h2>
        <GithubStats />
      </div>

      <div className="mt-24 flex flex-col gap-20 pb-24">
        {featured.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} total={featured.length} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button asChild size="lg" variant="outline" className="relative rounded-full px-8 py-6 text-lg border-white/10 hover:bg-white/5 hover:border-signal/50 transition-all">
            <Link href="/projects">
              See More Projects
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
