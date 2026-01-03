import { personalInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { HeroBackground3D } from '../hero-background-3d';

export function HeroSection() {
  return (
    <section id="hero" className="relative w-full h-auto min-h-[85vh] flex flex-col items-center justify-center text-center px-4">

      {/* Interactive 3D Background */}
      <HeroBackground3D />

      <div className="relative z-10 max-w-4xl pt-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight">
          JAYADEEP GOWDA
        </h1>
        <h2 className="mt-6 font-headline text-2xl md:text-3xl lg:text-4xl max-w-2xl mx-auto text-foreground/90 leading-snug">
          {personalInfo.title}
        </h2>

        <p className="mt-8 text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Building the future with intelligent robotics and seamless digital ecosystems.
        </p>

        <div className="mt-10 flex gap-6 justify-center">
          <Button size="lg" asChild className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-primary/25">
            <Link href="#contact">Let&apos;s Connect</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full px-8 py-6 text-lg backdrop-blur-md bg-background/30 hover:bg-white/10 border-white/10">
            <Link href="#projects">View My Work</Link>
          </Button>
        </div>
      </div>

      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-bounce bg-white/5 border border-white/10 rounded-full p-2 backdrop-blur-sm z-10 hidden md:block">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/10">
          <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="h-6 w-6 text-foreground/70" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
