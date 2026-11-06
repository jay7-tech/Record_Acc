'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const TIPS: Record<string, string> = {
  'digit-recognizer':
    "This is a real neural network — 784 to 64 to 32 to 10 neurons. Draw any digit and watch the signal pass through it live.",
  'regression-lab':
    "Click to drop data points, then hit run — you're watching batch gradient descent minimize loss in real time.",
  'rl-arena':
    "Watch reinforcement learning happen from a cold start — this agent knows nothing at first, stumbles into hazards, and teaches itself the safe route through real Q learning.",
  'attention-lab':
    "This is a real tiny transformer — the same architecture behind LLMs. The bars are its actual attention weights; try Autocomplete and watch it generate text one real prediction at a time.",
  'pose-tracker':
    "A pretrained computer vision model tracking your hand live, 21 points at once, straight from your webcam, fully on device, nothing uploaded.",
};

const GREETING = "Hey — I'm your guide. Pick a tool and I'll tell you what's actually happening under the hood.";

type Props = {
  activeTab: string;
};

/**
 * A small floating AI guide that reacts to whichever lab tool is active,
 * giving the whole page a sense of a character walking you through it
 * rather than a static demo grid.
 */
export function LabGuide({ activeTab }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState(GREETING);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    setMessage(TIPS[activeTab] ?? GREETING);
  }, [activeTab, dismissed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[260px] rounded-2xl rounded-br-sm border border-sky-500/20 dark:border-sky-400/25 bg-white dark:bg-[#0c1120] px-4 py-3 text-sm text-slate-700 dark:text-slate-200 shadow-xl"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              aria-label="Dismiss guide"
            >
              <X className="h-3 w-3" />
            </button>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setDismissed((d) => !d)}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle lab guide"
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-400/90 to-blue-600/90 shadow-[0_8px_30px_rgba(56,189,248,0.45)]"
      >
        <span className="absolute inset-0 rounded-full bg-sky-400/40 blur-md animate-pulse" />
        <span className="relative flex items-center gap-0.5">
          <span
            className="block h-2 w-2 rounded-full bg-white transition-transform duration-100"
            style={{ transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
          />
          <span
            className="block h-2 w-2 rounded-full bg-white transition-transform duration-100"
            style={{ transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
          />
        </span>
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-200 drop-shadow" />
      </motion.button>
    </div>
  );
}
