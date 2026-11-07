'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'hero', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Thin gradient bar fixed to the very top of the viewport that fills as the
 * page scrolls, plus a desktop-only side dock of dots for each section that
 * highlights the one currently in view and lets you jump to it.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const elements = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.2, 0.5, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-signal via-primary to-ember"
        style={{ scaleX }}
      />

      {/* Side section dock — desktop only */}
      <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
           
            className="group flex items-center gap-3"
            aria-label={`Go to ${section.label}`}
          >
            <span
              className={cn(
                'mono-label text-[10px] opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0',
                active === section.id ? 'text-signal' : 'text-muted-foreground'
              )}
            >
              {section.label}
            </span>
            <span
              className={cn(
                'block rounded-full border transition-all duration-300',
                active === section.id
                  ? 'h-2.5 w-2.5 border-signal bg-signal shadow-[0_0_12px_hsl(var(--signal)/0.8)]'
                  : 'h-1.5 w-1.5 border-muted-foreground/50 bg-transparent group-hover:border-primary'
              )}
            />
          </a>
        ))}
      </div>
    </>
  );
}
