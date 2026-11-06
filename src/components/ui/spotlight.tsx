'use client';

import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Cursor-tracked radial highlight — the "linear.app" card signature.
 * Wrap any card content in this; a soft light follows the pointer across
 * the surface and fades in/out on enter/leave. Pure CSS custom
 * properties updated on mousemove, no re-renders.
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current!.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    ref.current!.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn('group/spotlight relative', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--signal) / 0.12), transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
