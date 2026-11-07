"use client";

import { experiences } from '@/lib/data';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExperienceShowcaseCard } from '../experience-showcase-card';
import { AnimatedSection } from '../animated-section';
import { ArrowRight, Award, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { TextDecoder } from '../ui/text-decoder';

export function ExperienceSection() {
  const internships = experiences.filter((exp: any) => exp.category === 'INTERNSHIP');
  const leadership = experiences.filter((exp: any) => exp.category !== 'INTERNSHIP');

  return (
    <AnimatedSection id="experience">
      <div className="text-center">
        <p className="mono-label text-sm text-muted-foreground">/ 05 Timeline</p>
        <h2 className="font-headline text-4xl md:text-5xl mt-2 uppercase tracking-tighter">
          <TextDecoder text="Professional" /> <TextDecoder text="Journey" className="text-gradient-signal" />
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Hands on experience across machine learning, deep learning, R&amp;D in robotics, and product design.
        </p>
      </div>

      <motion.div
        className="mt-24 flex flex-col gap-20 pb-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.25 },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-10%' }}
      >
        {internships.map((exp: any, index) => (
          <ExperienceShowcaseCard
            key={exp.organization}
            exp={{
              ...exp,
              images: exp.images || (exp.image ? [exp.image] : []),
            }}
            index={index}
            total={internships.length}
          />
        ))}
      </motion.div>

      {leadership.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Award className="h-4 w-4 text-signal" />
            <p className="mono-label text-xs text-muted-foreground">Leadership &amp; Recognition</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {leadership.map((item: any, i) => (
              <motion.div
                key={item.organization}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-signal/30 hover:bg-card/60"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-tight">{item.role}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {item.organization}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">
                    {item.details?.[0]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 flex justify-center pb-10"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button variant="outline" className="relative gap-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-signal/50 text-lg px-8 py-6 rounded-full transition-all duration-300" asChild>
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
