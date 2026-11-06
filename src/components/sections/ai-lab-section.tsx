'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileCode2 } from 'lucide-react';
import { AnimatedSection } from '../animated-section';
import {
  DigitGlyphIcon,
  ScatterFitIcon,
  MazeGoalIcon,
  AttentionGridIcon,
  HandKeypointsIcon,
  WalkerGaitIcon,
  CellGrowthIcon,
  ConvergingCurveIcon,
} from '../lab/lab-icons';

const TOOLS = [
  { icon: DigitGlyphIcon, label: 'Digit Recognizer', hint: 'neural net' },
  { icon: ScatterFitIcon, label: 'Regression Lab', hint: 'gradient descent' },
  { icon: MazeGoalIcon, label: 'RL Arena', hint: 'Q learning agent' },
  { icon: AttentionGridIcon, label: 'Attention Lab', hint: 'mini transformer' },
  { icon: HandKeypointsIcon, label: 'Hand Tracker', hint: 'live pose model' },
  { icon: WalkerGaitIcon, label: 'Evolving Walkers', hint: 'genetic algorithm' },
  { icon: CellGrowthIcon, label: 'Growing Lab', hint: 'cellular automaton' },
  { icon: ConvergingCurveIcon, label: 'Physics Informed NN', hint: 'zero training data' },
];

export function AiLabSection() {
  return (
    <AnimatedSection id="ai-lab">
      <div className="text-center">
        <p className="mono-label text-sm text-muted-foreground">/ 01 The Lab</p>
        <h2 className="font-headline text-3xl md:text-4xl mt-2">
          Jay&apos;s <span className="text-gradient-signal bg-[length:200%_auto] animate-shimmer">Lab</span>
        </h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Eight things I actually built. A net that reads handwriting. An agent that finds its own
          goal. Creatures evolving how to walk. A rule that grows and heals itself. A network that
          learns physics with zero training data. Poke around, it&apos;s all live.
        </p>
      </div>

      <Link
        href="/lab"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-6 block max-w-6xl mx-auto overflow-hidden rounded-[22px] border border-white/[0.08] ring-1 ring-white/[0.06] bg-[#0a0d14] shadow-[0_30px_90px_-20px_rgba(56,189,248,0.3)] transition-all duration-500 hover:-translate-y-1 hover:border-sky-400/30"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative flex items-center border-b border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.015] backdrop-blur-xl px-5 py-3.5">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="flex items-center gap-2">
            <span
              className="relative h-3 w-3 rounded-full ring-1 ring-black/25"
              style={{ background: 'radial-gradient(circle at 32% 28%, #ff9d93, #ff5f57 55%, #e0443e)' }}
            >
              <svg viewBox="0 0 10 10" className="absolute inset-0 m-auto h-1.5 w-1.5 text-[#5c0400] opacity-0 transition-opacity duration-200 group-hover:opacity-80">
                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span
              className="relative h-3 w-3 rounded-full ring-1 ring-black/25"
              style={{ background: 'radial-gradient(circle at 32% 28%, #ffe29a, #febc2e 55%, #d89a1d)' }}
            >
              <svg viewBox="0 0 10 10" className="absolute inset-0 m-auto h-1.5 w-1.5 text-[#5c4300] opacity-0 transition-opacity duration-200 group-hover:opacity-80">
                <path d="M1.5 5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span
              className="relative h-3 w-3 rounded-full ring-1 ring-black/25"
              style={{ background: 'radial-gradient(circle at 32% 28%, #9af5ae, #28c840 55%, #1a9c30)' }}
            >
              <svg viewBox="0 0 10 10" className="absolute inset-0 m-auto h-1.5 w-1.5 text-[#02400f] opacity-0 transition-opacity duration-200 group-hover:opacity-80">
                <path d="M2 6.5L3.8 8 8 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          </div>

          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-[13px] text-slate-400">
            <FileCode2 className="h-3.5 w-3.5 text-sky-400/70" />
            lab.tsx
          </span>

          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/25 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-px bg-white/5">
          {TOOLS.map(({ icon: Icon, label, hint }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-row sm:flex-col items-center gap-4 bg-[#070a12] px-5 py-5 sm:px-4 sm:py-14 border-b border-white/5 sm:border-b-0 transition-colors duration-300 group-hover:bg-sky-400/[0.03] hover:!bg-sky-400/[0.07]"
            >
              <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="flex flex-col items-start sm:items-center gap-1 sm:gap-0 text-left sm:text-center">
                <span className="text-base font-medium text-slate-300">{label}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{hint}</span>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="relative flex items-center justify-center gap-2 border-t border-white/10 bg-white/[0.02] px-6 py-6 text-lg font-semibold text-white">
          Come See What I Built
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          <span className="absolute right-6 text-xs font-normal text-slate-500 hidden sm:inline">opens in a new tab</span>
        </div>
      </Link>
    </AnimatedSection>
  );
}
