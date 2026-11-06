'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Signature magnetic cursor. Two layers:
 *  - a tiny solid dot that tracks the pointer with ~0 lag
 *  - a larger ring that trails with spring physics and scales/blends
 *    when hovering interactive elements (links, buttons, [data-cursor-hover])
 *
 * Disabled automatically on touch devices and respects
 * prefers-reduced-motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30, mass: 0.4 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, [data-cursor-hover]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const down = () => setIsPointerDown(true);
    const up = () => setIsPointerDown(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      {/* core dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-signal mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isPointerDown ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* trailing ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-primary/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHovering ? 56 : 28,
          height: isHovering ? 56 : 28,
          opacity: isHovering ? 0.9 : 0.6,
          backgroundColor: isHovering ? 'hsl(var(--signal) / 0.12)' : 'transparent',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  );
}
