'use client';

import { personalInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { HeroBackground3D } from '../hero-background-3d';
import { motion } from 'framer-motion';

export function HeroSection() {
  // Subtle and Aesthetic Animation Variants
  const nameVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1],
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
        delay: 1,
        ease: "easeOut",
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
        delay: 1.3,
        staggerChildren: 0.15,
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      }
    }
  };

  return (
    <section id="hero" className="relative w-full h-auto min-h-[85vh] flex flex-col items-center justify-center text-center px-4">

      {/* Interactive 3D Background */}
      <HeroBackground3D />

      <div className="relative z-10 max-w-4xl pt-24">
        {/* Subtle Animated Name with Glow Effect */}
        <motion.h1
          className="relative font-headline text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight drop-shadow-2xl"
          variants={nameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="relative inline-block text-foreground">
            JAYADEEP GOWDA

            {/* Continuous Glow Pulse */}
            <motion.span
              className="absolute inset-0 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              JAYADEEP GOWDA
            </motion.span>
          </span>

          {/* Gradient Shimmer Overlay */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2.5,
              delay: 1.5,
              ease: "easeInOut",
            }}
            style={{
              maskImage: 'linear-gradient(to right, transparent, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
            }}
          />
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.h2
          className="mt-6 font-headline text-2xl md:text-3xl lg:text-4xl max-w-2xl mx-auto text-foreground/90 leading-snug drop-shadow-md"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
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
            <Button
              size="lg"
              asChild
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-primary/25"
            >
              <Link href="#contact">Let&apos;s Connect</Link>
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full px-8 py-6 text-lg backdrop-blur-md bg-background/30 hover:bg-white/10 border-white/10"
            >
              <Link href="#projects">View My Work</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator with Glass Bubble */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block" // increased z-index
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }} // Bouncing animation
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
