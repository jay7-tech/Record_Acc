'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const TIPS: Record<string, string> = {
  'digit-recognizer':
    "Real 4-layer network. Draw a digit, watch the signal fire through it live.",
  'regression-lab':
    "Click to drop points, hit run — real gradient descent fitting a line live.",
  'rl-arena':
    "An agent that knows nothing yet. Watch it learn the safe path through real Q learning.",
  'attention-lab':
    "A real tiny transformer. Try Autocomplete to see its live attention weights predict text.",
  'pose-tracker':
    "Live on-device hand tracking, 21 points, straight from your webcam — nothing uploaded.",
  'evolving-walkers':
    "20 random creatures, zero coaching. Hit Play and watch natural selection breed a better gait each generation.",
  'growing-lab':
    "A tiny evolved network growing a target shape cell by cell. Watch mutation and selection sculpt it.",
  'pinn':
    "Zero training data — it only knows a physics equation, and learns the curve by solving the math.",
};

const GREETING = "Tap a tool, then tap me for a quick read on what's happening under the hood.";

type Props = {
  activeTab: string;
};

/**
 * A small floating guide for the lab. Collapsed by default so it never
 * competes for attention with the demo's own animation — tap it to read a
 * one-line explanation of whichever tool is active, tap again to close it.
 * A single brief pulse marks a tab switch so the hint stays discoverable
 * without auto-popping a bubble over the canvas every time.
 */
export function LabGuide({ activeTab }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [justSwitched, setJustSwitched] = useState(false);

  const message = TIPS[activeTab] ?? GREETING;

  useEffect(() => {
    setJustSwitched(true);
    const t = setTimeout(() => setJustSwitched(false), 1800);
    return () => clearTimeout(t);
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-[200px] sm:max-w-[230px] rounded-xl rounded-br-sm border border-sky-500/20 dark:border-sky-400/25 bg-white dark:bg-[#0c1120] px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200 shadow-xl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle lab guide"
        className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-400/90 to-blue-600/90 shadow-[0_4px_16px_rgba(56,189,248,0.4)]"
      >
        {justSwitched && !expanded && (
          <span className="absolute inset-0 rounded-full bg-sky-400/50 animate-ping" />
        )}
        <span className="relative flex items-center gap-0.5">
          <span
            className="block h-1.5 w-1.5 rounded-full bg-white transition-transform duration-100"
            style={{ transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
          />
          <span
            className="block h-1.5 w-1.5 rounded-full bg-white transition-transform duration-100"
            style={{ transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
          />
        </span>
        {expanded ? (
          <X className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-600 p-0.5 text-white" />
        ) : (
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-200 drop-shadow" />
        )}
      </motion.button>
    </div>
  );
}
