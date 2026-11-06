'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { personalInfo } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedSection } from '../animated-section';
import { TextDecoder } from '../ui/text-decoder';

export function AboutSection() {
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile-picture');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Continuous scroll-linked parallax — the portrait drifts and the copy
  // settles into place as the section passes through the viewport, rather
  // than a one-shot fade that's already finished by the time you look.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'end 0.1'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <AnimatedSection id="about" className="w-full">
      <p className="mono-label text-sm text-muted-foreground text-center md:text-left mb-2">/ 02 Profile</p>
      <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <motion.div
          style={{ y: imageY, rotate: imageRotate }}
          className="md:col-span-1 flex justify-center relative group"
        >
          {/* Tech HUD Effect Container - Cosmic Theme */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">

            {/* 1. Outer Rotating Dashed Ring - Violet */}
            <div className="absolute inset-0 rounded-full border border-violet-500/20 border-dashed animate-[spin_10s_linear_infinite]" />

            {/* 2. Inner Counter-Rotating Tech Arc - Fuchsia */}
            <div className="absolute inset-2 rounded-full border-2 border-t-fuchsia-500/60 border-r-transparent border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite_reverse]" />

            {/* 3. Pulsing Glow Layer */}
            <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl animate-pulse" />

            {profileImage && (
              <div className="relative w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-violet-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] z-10 transition-transform duration-500 group-hover:scale-95">
                <Image
                  src={profileImage.imageUrl}
                  alt="A photo of Jaydeep Gowda"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: 'center 35%' }}
                  data-ai-hint={profileImage.imageHint}
                />
              </div>
            )}

            {/* 4. Orbiting Dot (Satellite) */}
            <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
              <div className="w-3 h-3 bg-fuchsia-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(232,121,249,1)]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="md:col-span-2 text-center md:text-left"
        >
          <h2 className="font-headline text-3xl md:text-4xl mb-4 text-foreground uppercase tracking-tight">
            <TextDecoder text="About Me" />
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {personalInfo.summary}
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
