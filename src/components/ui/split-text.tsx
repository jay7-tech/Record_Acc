'use client';

import { motion } from 'framer-motion';

/**
 * Splits a string into per-letter <motion.span>s that stagger in, and
 * individually lift/glow on hover — a small kinetic-type signature for
 * headings that should feel "alive" rather than just faded-in.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2';
}) {
  const letters = Array.from(text);

  return (
    <Tag className={className} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block will-change-transform"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', filter: 'blur(0px)' }}
          initial={{ opacity: 0, y: 34, scale: 0.75, rotateX: -70, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
          whileHover={{ y: -8, scale: 1.08, color: 'hsl(var(--signal))', transition: { duration: 0.15 } }}
          transition={{
            duration: 0.75,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  );
}
