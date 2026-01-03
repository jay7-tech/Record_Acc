import { experiences } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
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

      <div className="mt-12 max-w-5xl mx-auto space-y-12">
        {experiences.map((exp: any, index) => (
          /* Provide default category/images since data.ts might not have them fully populated for all entries yet */
          <ExperienceCard
            key={index}
            exp={{
              ...exp,
              category: "Work Experience",
              images: exp.images || (exp.image ? [exp.image] : [])
            }}
          />
        ))}
      </div>

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
