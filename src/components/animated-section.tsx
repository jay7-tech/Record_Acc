"use client";

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AnimatedSection({ children, className, id }: { children: ReactNode, className?: string, id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      if(element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        // The nav is a floating pill fixed near the top rather than a
        // full-width bar, so without this, jumping to a section via the nav
        // links (or a direct #hash) lands its heading half-hidden behind
        // the pill instead of just below it.
        'scroll-mt-24 transform transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        className
      )}
    >
      {children}
    </section>
  );
}
