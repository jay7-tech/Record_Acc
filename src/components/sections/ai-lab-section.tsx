'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Swords, Sparkles, Hand, ArrowUpRight } from 'lucide-react';
import { AnimatedSection } from '../animated-section';

const TOOLS = [
  { icon: Brain, label: 'Digit Recognizer', hint: 'neural net' },
  { icon: TrendingUp, label: 'Regression Lab', hint: 'gradient descent' },
  { icon: Swords, label: 'RL Arena', hint: 'Q-learning agent' },
  { icon: Sparkles, label: 'Attention Lab', hint: 'mini transformer' },
  { icon: Hand, label: 'Hand Tracker', hint: 'live pose model' },
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
          Five things I actually built, not just talked about — a neural net that reads your
          handwriting, a tiny transformer that finishes your sentences, an agent teaching itself to
          find the goal, a camera that tracks your hand, and the gradient descent running under all of
          it. Go on, poke at it — it&apos;s all live, right here.
        </p>
      </div>

      <Link
        href="/lab"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-6 block max-w-6xl mx-auto overflow-hidden rounded-[32px] border border-sky-400/20 bg-[#070a12] shadow-[0_30px_90px_-20px_rgba(56,189,248,0.3)] transition-all duration-500 hover:-translate-y-1 hover:border-sky-400/35"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative flex items-center gap-2.5 border-b border-white/10 bg-white/[0.03] px-7 py-5">
          <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" />
          <span className="font-mono text-sm text-slate-400 ml-3">ai-lab.tsx</span>
          <span className="ml-auto flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            live
          </span>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white/5">
          {TOOLS.map(({ icon: Icon, label, hint }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-col items-center gap-4 bg-[#070a12] px-4 py-14 transition-colors duration-300 group-hover:bg-sky-400/[0.03] hover:!bg-sky-400/[0.07]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-7 w-7" />
              </span>
              <span className="text-base font-medium text-slate-300 text-center">{label}</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 text-center">{hint}</span>
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
