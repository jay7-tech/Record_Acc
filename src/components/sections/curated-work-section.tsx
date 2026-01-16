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

      <div className="mt-24 flex flex-col gap-20 pb-24">
        {projects.filter(p => p.isFeatured).map((project, index) => {
          const projectImages = project.images.map(id => getImage(id)).filter((img): img is typeof PlaceHolderImages[0] => !!img);

          // Calculate sticky top offset
          const uniqueTop = 80 + (index * 50);

          return (
            <motion.div
              key={project.title}
              style={{
                position: 'sticky',
                top: `${uniqueTop}px`,
                zIndex: index + 10,
              }}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 50, filter: "blur(10px)" },
                show: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { type: "spring", stiffness: 50, damping: 20, duration: 0.8 }
                }
              }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-700 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
            >

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 px-8 items-center relative z-10">

                {/* Image Side (Left) - Spans 6 cols with glass container */}
                <div className="lg:col-span-6 relative w-full group cursor-pointer perspective-1000">
                  {/* Aesthetic glass container for image */}
                  <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-500 hover:border-white/40">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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

                      {/* === ANIMATION 7: 3D FLIP REVEAL (Neuro-AI) === */}
                      {/* Elegant 3D card flip animation */}
                      {project.animationType === '3d-flip-reveal' && (
                        <div className="relative w-full h-full [perspective:1000px]">
                          {/* Back Card (Revealed on flip) */}
                          {projectImages[1] && (
                            <div
                              className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-white/20 bg-background shadow-2xl
                                         [backface-visibility:hidden] [transform-style:preserve-3d] transition-transform duration-700 ease-out
                                         [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)]"
                            >
                              <Image src={projectImages[1].imageUrl} alt="Revealed View" fill className="object-cover" />
                            </div>
                          )}
                          {/* Front Card (Flips away) */}
                          {projectImages[0] && (
                            <div
                              className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-white/20 bg-background shadow-2xl
                                         [backface-visibility:hidden] [transform-style:preserve-3d] transition-transform duration-700 ease-out
                                         [transform:rotateY(0deg)] group-hover:[transform:rotateY(-180deg)] group-hover:shadow-primary/30"
                            >
                              <Image src={projectImages[0].imageUrl} alt="Front View" fill className="object-cover" />
                              {/* Hover instruction overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                <span className="text-white text-sm font-medium">Hover to reveal</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* === ANIMATION 8: CINEMATIC HOVER (Professional) === */}
                      {/* Smooth scale and elegant detail reveal */}
                      {project.animationType === 'cinematic-hover' && (
                        <div className="relative w-full h-full overflow-hidden rounded-xl">
                          {/* Main Image Layer */}
                          {projectImages[0] && (
                            <div className="absolute inset-0 w-full h-full transition-transform duration-1000 cubic-bezier(0.25, 0.46, 0.45, 0.94) group-hover:scale-105">
                              <Image
                                src={projectImages[0].imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                              {/* Gradient overlay for depth */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                            </div>
                          )}

                          {/* Secondary Detail Peek (Slides up) */}
                          {projectImages[1] && (
                            <div className="absolute bottom-4 right-4 w-[40%] aspect-video rounded-lg overflow-hidden border border-white/30 shadow-2xl 
                                          transform translate-y-[120%] opacity-0 
                                          transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) 
                                          group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-[-2deg]">
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10" />
                              <Image
                                src={projectImages[1].imageUrl}
                                alt="Detail View"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Optional "View" Indicator */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Content Side (Right) - Spans 6 cols */}
                <div className="lg:col-span-6 flex flex-col justify-center">
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

                  {project.recognition && (
                    <p className="mb-6 text-sm font-semibold text-zinc-800 italic leading-relaxed">
                      {project.recognition}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => {
                        const Icon = tag.icon
                        return (
                          <Badge key={tag.name} variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-background/50 backdrop-blur-sm border-zinc-200">
                            <Icon className="h-4 w-4" />
                            {tag.name}
                          </Badge>
                        )
                      })}
                    </div>

                    <Button asChild size="sm" variant="outline" className="rounded-full border-zinc-200 bg-white/50 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0">
                      <Link href={project.githubUrl} target="_blank">
                        <SiGithub className="mr-2 h-4 w-4" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button asChild size="lg" variant="outline" className="relative rounded-full px-8 py-6 text-lg border-white/10 hover:bg-white/5 hover:border-primary/50 transition-all">
            <Link href="/projects">
              See More Projects
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
