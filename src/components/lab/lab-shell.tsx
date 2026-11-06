'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type LabTab = {
  id: string;
  label: string;
  tagline: string;
  icon: ReactNode;
  content: ReactNode;
};

type Props = {
  tabs: LabTab[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
};

/**
 * A code-editor-chrome shell that frames the interactive demos as one
 * cohesive "lab" — a vertical tool rail on the left (dashboard style),
 * crossfading content on the right. Fully respects the site's light/dark
 * toggle instead of forcing one look.
 */
export function LabShell({ tabs, activeId: controlledId, onActiveChange }: Props) {
  const [internalId, setInternalId] = useState(tabs[0]?.id);
  const activeId = controlledId ?? internalId;
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const setActive = (id: string) => {
    setInternalId(id);
    onActiveChange?.(id);
  };

  return (
    <div className="relative rounded-[28px] border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#070a12] shadow-[0_30px_90px_-20px_rgba(56,189,248,0.2)] dark:shadow-[0_40px_120px_-20px_rgba(56,189,248,0.3)] overflow-hidden transition-colors duration-300">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* window chrome bar */}
      <div className="relative flex items-center gap-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 ml-2">ai-lab.tsx</span>
        <span className="relative ml-auto flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </span>
          live
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row">
        {/* tool rail — a wrapping grid on mobile so every tool is visible at once,
            no scroll gesture required; the full labeled vertical list from md up */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:flex md:flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.015] p-3 md:p-4 md:w-64 md:shrink-0">
          {tabs.map((tab) => {
            const isActive = tab.id === active?.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative flex flex-col md:flex-row items-center md:items-start gap-1.5 md:gap-3 rounded-2xl px-2 py-2.5 md:px-4 md:py-3 text-center md:text-left transition-colors w-full ${
                  isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="lab-tab-pill"
                    className="absolute inset-0 rounded-2xl border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-sky-500/20 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300' : 'bg-slate-900/5 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10 min-w-0">
                  <span className="block text-[11px] md:text-sm font-semibold leading-tight">{tab.label}</span>
                  <span className="hidden md:block text-xs text-slate-500 dark:text-slate-500 truncate">{tab.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* content */}
        <div className="relative flex-1 p-4 sm:p-6 md:p-12 min-h-0 md:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {active?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
