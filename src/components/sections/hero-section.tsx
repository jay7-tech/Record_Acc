'use client';

import { personalInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { HeroBackground3D } from '../hero-background-3d';
import { motion } from 'framer-motion';
import { SplitText } from '@/components/ui/split-text';
import { Magnetic } from '@/components/ui/magnetic';

export function HeroSection() {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 1.1,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1.5,
        ease: "easeOut" as const,
      }
    }
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1.8,
        staggerChildren: 0.15,
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section id="hero" className="relative w-full h-auto min-h-[90vh] flex flex-col items-center justify-center text-center px-4">

      {/* Interactive 3D Background */}
      <HeroBackground3D />

      <div className="relative z-10 max-w-5xl pt-20 sm:pt-24 flex flex-col items-center px-2">
        {/* Kinetic per-letter name reveal */}
        <h1 className="relative font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.15] md:leading-tight tracking-tight [perspective:600px] flex flex-wrap justify-center gap-x-2 gap-y-1">
          <SplitText
            as="span"
            text="JAYADEEP GOWDA"
            className="relative inline-flex flex-wrap justify-center text-foreground drop-shadow-2xl"
            delay={0.25}
          />
        </h1>

        {/* Animated Subtitle */}
        <motion.h2
          className="mt-5 sm:mt-6 font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-2xl mx-auto text-foreground/90 leading-snug drop-shadow-md"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-gradient-signal bg-[length:200%_auto] animate-shimmer">
            {personalInfo.title}
          </span>
        </motion.h2>

        {/* Animated Description */}
        <motion.p
          className="mt-8 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          variants={descriptionVariants}
          initial="hidden"
          animate="visible"
        >
          Engineering at the intersection of AI & Machine Learning, Robotics, and Full-Stack Project Building to architect high-impact, intelligent solutions.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          className="mt-10 flex gap-6 justify-center"
          variants={buttonContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={buttonVariants}>
            <Magnetic>
              <Button
                size="lg"
                asChild
               
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-signal text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-primary/25"
              >
                <Link href="#contact">Let&apos;s Connect</Link>
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <Magnetic>
              <Button
                size="lg"
                variant="outline"
                asChild
               
                className="rounded-full px-8 py-6 text-lg backdrop-blur-md bg-background/30 hover:bg-white/10 border-white/10"
              >
                <Link href="#projects">View My Work</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator with Glass Bubble */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-3 bg-background/30 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:bg-white/10 transition-colors"
        >
          <Button variant="ghost" size="icon" asChild className="rounded-full w-10 h-10 hover:bg-transparent">
            <Link href="#about" aria-label="Scroll to about section">
              <ArrowDown className="h-5 w-5 text-foreground/80" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
