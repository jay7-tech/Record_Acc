'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  lines: string[];
  label?: string;
};

/**
 * A terminal-style readout of what the model is actually doing — gives
 * every demo a running "voice" instead of silently updating numbers.
 */
export function TrainingConsole({ lines, label = 'console' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">{label}</span>
      </div>
      <div ref={scrollRef} className="h-24 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: i === lines.length - 1 ? 1 : 0.55, x: 0 }}
              className="text-slate-600 dark:text-slate-400 whitespace-pre"
            >
              <span className="text-sky-600 dark:text-sky-400">&gt;</span> {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {lines.length === 0 && (
          <span className="text-slate-400 dark:text-slate-600">waiting for input…</span>
        )}
      </div>
    </div>
  );
}
