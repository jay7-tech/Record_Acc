"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedSection } from '../animated-section';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';
import { SiGithub } from 'react-icons/si';

export function CuratedWorkSection() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  return (
    <AnimatedSection id="projects">
      <div className="text-center">
        <p className="text-sm uppercase text-muted-foreground tracking-widest">Build Records</p>
        <h2 className="font-headline text-4xl md:text-5xl mt-2">
          Curated <span className="text-primary">Work</span>
        </h2>
      </div>

      <div className="mt-16 flex flex-col gap-32 pb-32">
        {projects.filter(p => p.isFeatured).map((project, index) => {
          const projectImages = project.images.map(id => getImage(id)).filter((img): img is typeof PlaceHolderImages[0] => !!img);

          // Calculate sticky top offset
          const uniqueTop = 80 + (index * 40);

          return (
            <motion.div
              key={project.title}
              style={{
                position: 'sticky',
                top: `${uniqueTop}px`,
                zIndex: index + 10,
              }}
              variants={{
                hidden: { opacity: 0, y: 100, scale: 0.9 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 40, damping: 15 }
                }
              }}
              className="relative rounded-3xl overflow-hidden border border-white/10 transition-all duration-700 hover:border-white/20 bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
            >
              {/* Opaque backing to ensure legibility when stacked - Reduced for glassier look */}
              <div className="absolute inset-0 bg-background/40 -z-20" />

              {/* Ambient Color Glow Blob */}
              <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 pointer-events-none ${project.color}`} />

              {/* Noise Texture (Optional, simulates high-end feel) */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10 brightness-100 invert" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 items-center relative z-10">

                {/* Image Side (Left) - Spans 8 cols for larger visual impact */}
                <div className="lg:col-span-8 relative h-[400px] md:h-[500px] w-full flex items-center justify-center group cursor-pointer perspective-1000">
                  <div className="relative w-full h-full flex items-center justify-center">

                    {/* === ANIMATION 1: DECK SHUFFLE (YoloMart) === */}
                    {/* Front card rotates and moves to the back, revealing the second card */}
                    {project.animationType === 'deck-shuffle' && (
                      <div className="relative w-full h-full perspective-1000">
                        {/* Back Card (Initially behind) */}
                        {projectImages[1] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 ease-in-out
                                      z-10 scale-95 translate-x-4
                                      group-hover:z-30 group-hover:scale-100 group-hover:translate-x-0"
                          >
                            <Image src={projectImages[1].imageUrl} alt="Back" fill className="object-cover" />
                          </div>
                        )}
                        {/* Front Card (Moves away and behind) */}
                        {projectImages[0] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 ease-in-out
                                      z-20 scale-100 rotate-0
                                      group-hover:z-0 group-hover:scale-90 group-hover:-translate-x-12 group-hover:rotate-12 group-hover:brightness-50"
                          >
                            <Image src={projectImages[0].imageUrl} alt="Front" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* === ANIMATION 2: PERSPECTIVE PUSH (High Five) === */}
                    {/* Front card pushes back deep into Z space, Back card floats up */}
                    {project.animationType === 'perspective-push' && (
                      <div className="relative w-full h-full perspective-1000">
                        {/* Back Card (Floats Up) */}
                        {projectImages[1] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
                                      z-10 scale-90 opacity-0 translate-y-8
                                      group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
                          >
                            <Image src={projectImages[1].imageUrl} alt="Reveal" fill className="object-cover" />
                          </div>
                        )}
                        {/* Front Card (Pushes Back) */}
                        {projectImages[0] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
                                      z-20 transform-style-3d
                                      group-hover:translate-z-[-200px] group-hover:rotate-x-12 group-hover:opacity-0 group-hover:scale-75"
                          >
                            <Image src={projectImages[0].imageUrl} alt="Cover" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* === ANIMATION 3: VERTICAL SHUFFLE (Movifi) === */}
                    {/* Front card slides down and behind, Back card slides up to front */}
                    {project.animationType === 'vertical-shuffle' && (
                      <div className="relative w-full h-full perspective-1000">
                        {/* Back Card (Initially behind & below) */}
                        {projectImages[1] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.25, 0.4, 0.25, 1)
                                      z-10 scale-90 translate-y-12 brightness-50
                                      group-hover:z-30 group-hover:scale-100 group-hover:translate-y-0 group-hover:brightness-100"
                          >
                            <Image src={projectImages[1].imageUrl} alt="Back" fill className="object-cover" />
                          </div>
                        )}
                        {/* Front Card (Slides down & back) */}
                        {projectImages[0] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.25, 0.4, 0.25, 1)
                                      z-20 scale-100
                                      group-hover:z-10 group-hover:scale-90 group-hover:translate-y-16 group-hover:brightness-50"
                          >
                            <Image src={projectImages[0].imageUrl} alt="Front" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    )}


                    {/* === ANIMATION 6: QUAD GALLERY (Neuro-AI) === */}
                    {/* Custom 2x2 Interactive Collage */}
                    {project.animationType === 'quad-gallery' && (
                      <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-3 w-full h-full transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
                          {projectImages.slice(0, 4).map((img, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-white/20 shadow-lg group/item">
                              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors z-10" />
                              <Image
                                src={img.imageUrl}
                                alt={img.description}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* === ANIMATION 5: COMBINED PARALLAX-FAN (All Projects) === */}
                    {project.animationType === 'parallax-fan' && (
                      <>
                        {/* Back Card (Pop & Vertical/Left -> Ensuring no intersection with text) */}
                        {projectImages[1] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.25, 0.4, 0.25, 1)
                                     z-10 scale-[0.95] translate-y-0 translate-x-0 rotate-0 brightness-50
                                     group-hover:z-30 group-hover:scale-105 group-hover:-translate-y-8 group-hover:-translate-x-2 group-hover:rotate-1 group-hover:brightness-100 group-hover:shadow-primary/30"
                          >
                            <Image src={projectImages[1].imageUrl} alt="Back Card" fill className="object-cover" />
                          </div>
                        )}

                        {/* Front Card (Tilt & Far Left -> Aggressive pull away from text) */}
                        {projectImages[0] && (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-background shadow-2xl transition-all duration-700 cubic-bezier(0.25, 0.4, 0.25, 1)
                                     z-20 scale-100 rotate-0
                                     group-hover:scale-[0.92] group-hover:-translate-x-16 group-hover:translate-y-4 group-hover:-rotate-4 group-hover:brightness-75"
                          >
                            <Image src={projectImages[0].imageUrl} alt="Front Card" fill className="object-cover" />
                          </div>
                        )}
                      </>
                    )}

                  </div>
                </div>

                {/* Content Side (Right) - Spans 4 cols */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  {project.recognition && (
                    <Badge variant="secondary" className="mb-4 w-fit px-3 py-1">{project.recognition}</Badge>
                  )}
                  <h3 className="font-headline text-3xl md:text-4xl font-bold mb-4">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {project.description.paragraph}
                  </p>

                  <ul className="mb-8 space-y-3">
                    {project.description.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <Plus className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => {
                      const Icon = tag.icon
                      return (
                        <Badge key={tag.name} variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-background/50 backdrop-blur-sm">
                          <Icon className="h-4 w-4" />
                          {tag.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button asChild size="lg" className="rounded-full w-full sm:w-auto">
                      <Link href={project.githubUrl} target="_blank">
                        <SiGithub className="mr-2 h-5 w-5" />
                        View on GitHub
                      </Link>
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 flex justify-center">
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-white/10 hover:bg-white/5 hover:border-primary/50 transition-all">
          <Link href="/projects">
            See More Projects
          </Link>
        </Button>
      </div>
    </AnimatedSection>
  );
}
