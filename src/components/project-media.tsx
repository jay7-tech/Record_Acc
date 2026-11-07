"use client";

import Image from 'next/image';
import { Plus, MapPin } from 'lucide-react';
import type { Project } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

/**
 * Renders a project's hover-reveal image treatment for a given animationType.
 * Shared between the homepage's Curated Work cards and the /projects grid so
 * every project — featured or not — gets its own distinct animation instead
 * of only the three featured cards having one.
 *
 * Expects an ancestor with the `group` class (for group-hover: variants) and
 * the `--accent-text` CSS custom property set (for the map-ping-reveal pin).
 */
export function ProjectMedia({ project, projectImages }: { project: Project; projectImages: ImagePlaceholder[] }) {
  return (
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
            {(() => {
              const shown = projectImages.slice(0, 4);
              // A 3-image set gets a full-width strip as the last tile
              // instead of leaving one grid cell empty.
              const lastIsOddOneOut = shown.length === 3;
              return shown.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-xl overflow-hidden border border-border shadow-lg group/item ${lastIsOddOneOut && idx === 2 ? 'col-span-2' : ''}`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors z-10" />
                  <Image src={img.imageUrl} alt={img.description} fill className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                </div>
              ));
            })()}
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
            <div className="absolute inset-0 w-full h-full transition-[clip-path] duration-1000 ease-out [clip-path:circle(0%_at_50%_55%)] group-hover:[clip-path:circle(85%_at_50%_55%)]">
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
  );
}
