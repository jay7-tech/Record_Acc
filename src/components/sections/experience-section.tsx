"use client";

import { experiences } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExperienceCard } from '../experience-card';
import { AnimatedSection } from '../animated-section';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export function ExperienceSection() {
  return (
    <AnimatedSection id="experience">
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl">
          Professional Journey & Achievements
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A timeline of technical expertise, leadership roles, and recognition.
        </p>
      </div>

      <motion.div
        className="mt-12 max-w-5xl mx-auto space-y-12"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {experiences.map((exp: any, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, x: -50 },
              show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
            }}
          >
            <ExperienceCard
              exp={{
                ...exp,
                images: exp.images || (exp.image ? [exp.image] : [])
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center">
        <Button variant="outline" className="group gap-2 border-primary/20 hover:border-primary/50" asChild>
          <Link href="/experience">
            See More Experiences
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </AnimatedSection>
  );
}
