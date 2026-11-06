'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MousePointerClick } from 'lucide-react';
import {
  DigitGlyphIcon,
  ScatterFitIcon,
  MazeGoalIcon,
  AttentionGridIcon,
  HandKeypointsIcon,
  WalkerGaitIcon,
  CellGrowthIcon,
  ConvergingCurveIcon,
} from '@/components/lab/lab-icons';
import { LabShell } from '@/components/lab/lab-shell';
import { DigitRecognizerDemo } from '@/components/lab/digit-recognizer-demo';
import { RegressionLabDemo } from '@/components/lab/regression-lab-demo';
import { RLArenaDemo } from '@/components/lab/rl-arena-demo';
import { AttentionLabDemo } from '@/components/lab/attention-lab-demo';
import { PoseTrackerDemo } from '@/components/lab/pose-tracker-demo';
import { EvolvingWalkersDemo } from '@/components/lab/evolving-walkers-demo';
import { GrowingLabDemo } from '@/components/lab/growing-lab-demo';
import { PinnDemo } from '@/components/lab/pinn-demo';
import { LabGuide } from '@/components/lab/lab-guide';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';

const TAB_META = {
  'digit-recognizer': { label: 'Digit Recognizer', icon: DigitGlyphIcon },
  'regression-lab': { label: 'Regression Lab', icon: ScatterFitIcon },
  'rl-arena': { label: 'RL Arena', icon: MazeGoalIcon },
  'attention-lab': { label: 'Attention Lab', icon: AttentionGridIcon },
  'pose-tracker': { label: 'Hand Tracker', icon: HandKeypointsIcon },
  'evolving-walkers': { label: 'Evolving Walkers', icon: WalkerGaitIcon },
  'growing-lab': { label: 'Growing Lab', icon: CellGrowthIcon },
  'pinn': { label: 'Physics-Informed NN', icon: ConvergingCurveIcon },
} as const;

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_META>('digit-recognizer');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.5), transparent 70%)' }}
      />

      <div className="relative container px-4 md:px-6 py-6 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <Link
            href="/#ai-lab"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="mono-label text-sm text-sky-600 dark:text-sky-400/80">The AI Lab</p>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl mt-3 text-slate-900 dark:text-white">
            Built, Not <span className="bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-300 dark:to-blue-500 bg-clip-text text-transparent">Described</span>
          </h1>
          <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-400 hidden sm:block">
            Real learning systems — backprop, genetic algorithms, cellular automata — trained or
            evolved from scratch and running live, right here in your browser. No pretrained
            checkpoints, no canned demos.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:hidden">
            Real ML systems, trained from scratch, running live right in your browser.
          </p>
          <p className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-sky-600 dark:text-sky-300">
            <MousePointerClick className="h-4 w-4" />
            Pick a tool and try it
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 sm:mt-12"
        >
          <LabShell
            activeId={activeTab}
            onActiveChange={(id) => setActiveTab(id as keyof typeof TAB_META)}
            tabs={[
              {
                id: 'digit-recognizer',
                label: 'Digit Recognizer',
                tagline: '784-64-32-10 MLP',
                icon: <DigitGlyphIcon className="h-4 w-4" />,
                content: <DigitRecognizerDemo />,
              },
              {
                id: 'regression-lab',
                label: 'Regression Lab',
                tagline: 'Live gradient descent',
                icon: <ScatterFitIcon className="h-4 w-4" />,
                content: <RegressionLabDemo />,
              },
              {
                id: 'rl-arena',
                label: 'RL Arena',
                tagline: 'Live Q-learning',
                icon: <MazeGoalIcon className="h-4 w-4" />,
                content: <RLArenaDemo />,
              },
              {
                id: 'attention-lab',
                label: 'Attention Lab',
                tagline: 'A tiny transformer',
                icon: <AttentionGridIcon className="h-4 w-4" />,
                content: <AttentionLabDemo />,
              },
              {
                id: 'pose-tracker',
                label: 'Hand Tracker',
                tagline: 'Live computer vision',
                icon: <HandKeypointsIcon className="h-4 w-4" />,
                content: <PoseTrackerDemo />,
              },
              {
                id: 'evolving-walkers',
                label: 'Evolving Walkers',
                tagline: 'Genetic algorithm',
                icon: <WalkerGaitIcon className="h-4 w-4" />,
                content: <EvolvingWalkersDemo />,
              },
              {
                id: 'growing-lab',
                label: 'Growing Lab',
                tagline: 'Evolved cellular automaton',
                icon: <CellGrowthIcon className="h-4 w-4" />,
                content: <GrowingLabDemo />,
              },
              {
                id: 'pinn',
                label: 'Physics-Informed NN',
                tagline: 'Zero training data',
                icon: <ConvergingCurveIcon className="h-4 w-4" />,
                content: <PinnDemo />,
              },
            ]}
          />
        </motion.div>

        <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-600 font-mono">
          Everything above runs client-side — no API, no server, just the math.
        </p>
      </div>

      <LabGuide activeTab={activeTab} />
    </div>
  );
}
