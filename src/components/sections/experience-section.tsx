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

      <div className="relative mt-12 max-w-5xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-[20px] md:left-1/2 top-4 bottom-12 w-0.5 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 hidden md:block" />

        <motion.div
          className="space-y-16 relative"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          {experiences.map((exp: any, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 40,
                    damping: 15,
                    duration: 0.8
                  }
                }
              }}
              className="relative z-10"
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center pb-10"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button variant="outline" className="relative gap-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-lg px-8 py-6 rounded-full transition-all duration-300" asChild>
            <Link href="/experience">
              See More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
