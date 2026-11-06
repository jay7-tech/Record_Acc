'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const W = 760;
const H = 300;
const TRACK_Y = H - 60;
const POP = 20;
const GENES = 4; // period, duty, phase-offset, leg-energy-split
const STEPS_PER_GEN = 260;
const TOTAL_ENERGY = 3.2;
const ELITES = 2;

type Genome = Float32Array; // 4 values in [0,1]
type Phenotype = { period: number; duty: number; offset: number; strengthA: number; strengthB: number };

function randGenome(): Genome {
  return new Float32Array([Math.random(), Math.random(), Math.random(), Math.random()]);
}

function decode(g: Genome): Phenotype {
  const period = 20 + g[0] * 40;
  const duty = 0.15 + g[1] * 0.6;
  const offset = g[2];
  const strengthA = TOTAL_ENERGY * g[3];
  const strengthB = TOTAL_ENERGY * (1 - g[3]);
  return { period, duty, offset, strengthA, strengthB };
}

function legState(t: number, period: number, duty: number, offsetSteps: number) {
  const ph = (((t + offsetSteps) % period) / period + 1) % 1;
  return { active: ph < duty, ph };
}

function stepVelocity(t: number, p: Phenotype) {
  const a = legState(t, p.period, p.duty, 0);
  const b = legState(t, p.period, p.duty, p.offset * p.period);
  const vA = a.active ? p.strengthA * Math.sin((Math.PI * a.ph) / p.duty) : 0;
  const vB = b.active ? p.strengthB * Math.sin((Math.PI * b.ph) / p.duty) : 0;
  if (a.active && b.active) return Math.max(vA, vB) * 0.5; // legs fighting each other — wasted effort
  if (!a.active && !b.active) return -0.06; // airborne, no support — tiny stall
  return vA + vB; // clean single-leg stance — full efficiency
}

type Creature = { genome: Genome; pheno: Phenotype; pos: number; terrain: number; color: string };

/**
 * A population of two-legged creatures, each just a gait encoded as four
 * numbers (stride period, ground-contact duty cycle, the phase offset
 * between its legs, and how it splits a FIXED energy budget between
 * them). Nothing here is hand-tuned to walk — natural selection has to
 * discover on its own that legs need to alternate instead of firing
 * together, purely from genomes starting out as random noise.
 */
export function EvolvingWalkersDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [running, setRunning] = useState(true);
  const [log, setLog] = useState<string[]>(['generation 0 — random gaits, mostly just twitching in place']);
  const [stats, setStats] = useState({ gen: 0, bestEver: 0, bestGen: 0, avgGen: 0 });

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const makePopulation = useCallback((): Creature[] => {
    return Array.from({ length: POP }, () => {
      const genome = randGenome();
      return { genome, pheno: decode(genome), pos: 0, terrain: 0.85 + Math.random() * 0.3, color: '#64748b' };
    });
  }, []);

  const worldRef = useRef({
    creatures: makePopulation(),
    step: 0,
    gen: 0,
    bestEverFitness: 0,
    bestEverGenome: null as Genome | null,
    maxDistSeen: 60,
    bestFitHistory: [] as number[],
    running: true,
    isDark,
  });
  worldRef.current.running = running;
  worldRef.current.isDark = isDark;

  const colorFor = (rank: number) => {
    if (rank === 0) return '#fbbf24';
    if (rank === 1) return '#38bdf8';
    if (rank === 2) return '#a78bfa';
    return '#64748b';
  };

  const nextGeneration = useCallback(() => {
    const w = worldRef.current;
    const ranked = [...w.creatures].sort((a, b) => b.pos - a.pos);
    const best = ranked[0];
    const avg = ranked.reduce((s, c) => s + c.pos, 0) / ranked.length;

    if (best.pos > w.bestEverFitness) {
      w.bestEverFitness = best.pos;
      w.bestEverGenome = best.genome.slice() as Genome;
      pushLog(`gen ${w.gen}: new best — traveled ${best.pos.toFixed(0)}px (duty ${best.pheno.duty.toFixed(2)}, offset ${best.pheno.offset.toFixed(2)})`);
    } else if (w.gen % 5 === 0) {
      pushLog(`gen ${w.gen}: best ${best.pos.toFixed(0)}px, population avg ${avg.toFixed(0)}px`);
    }

    w.bestFitHistory.push(best.pos);
    if (w.bestFitHistory.length > 200) w.bestFitHistory.shift();
    w.maxDistSeen = Math.max(w.maxDistSeen, best.pos);

    const survivors = ranked.slice(0, Math.max(ELITES, Math.ceil(POP / 2)));
    const nextPop: Creature[] = ranked.slice(0, ELITES).map((c) => ({
      genome: c.genome.slice() as Genome,
      pheno: c.pheno,
      pos: 0,
      terrain: 0.85 + Math.random() * 0.3,
      color: '#64748b',
    }));

    while (nextPop.length < POP) {
      const pa = survivors[Math.floor(Math.random() * survivors.length)];
      const pb = survivors[Math.floor(Math.random() * survivors.length)];
      const child = new Float32Array(GENES) as Genome;
      for (let i = 0; i < GENES; i++) {
        child[i] = Math.random() < 0.5 ? pa.genome[i] : pb.genome[i];
        if (Math.random() < 0.25) {
          child[i] = Math.min(1, Math.max(0, child[i] + (Math.random() - 0.5) * 0.3));
        }
      }
      nextPop.push({ genome: child, pheno: decode(child), pos: 0, terrain: 0.85 + Math.random() * 0.3, color: '#64748b' });
    }

    nextPop.forEach((c, i) => {
      c.color = colorFor(i);
    });

    w.creatures = nextPop;
    w.step = 0;
    w.gen += 1;
    setStats({ gen: w.gen, bestEver: w.bestEverFitness, bestGen: best.pos, avgGen: avg });
  }, [pushLog]);

  const resetAll = useCallback(() => {
    const w = worldRef.current;
    w.creatures = makePopulation();
    w.step = 0;
    w.gen = 0;
    w.bestEverFitness = 0;
    w.bestEverGenome = null;
    w.maxDistSeen = 60;
    w.bestFitHistory = [];
    setStats({ gen: 0, bestEver: 0, bestGen: 0, avgGen: 0 });
    setLog(['new random population — generation 0, mostly just twitching in place']);
  }, [makePopulation]);

  useEffect(() => {
    let raf = 0;

    const drawTrack = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      if (canvas.width !== W * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = worldRef.current;
      const pal = getLabPalette(w.isDark);
      ctx.fillStyle = pal.canvasBg;
      ctx.fillRect(0, 0, W, H);

      // ground
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, TRACK_Y);
      ctx.lineTo(W, TRACK_Y);
      ctx.stroke();

      const scaleRef = Math.max(60, w.maxDistSeen * 1.08);

      w.creatures.forEach((c, i) => {
        const px = 20 + (c.pos / scaleRef) * (W - 40);
        const bodyY = TRACK_Y - 16;
        const t = w.step;
        const legA = legState(t, c.pheno.period, c.pheno.duty, 0);
        const legB = legState(t, c.pheno.period, c.pheno.duty, c.pheno.offset * c.pheno.period);
        const swingA = legA.active ? -8 + legA.ph * 16 : 10;
        const swingB = legB.active ? -8 + legB.ph * 16 : 10;

        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, bodyY);
        ctx.lineTo(px + swingA, TRACK_Y);
        ctx.moveTo(px, bodyY);
        ctx.lineTo(px - swingB, TRACK_Y);
        ctx.stroke();

        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(px, bodyY, i === 0 ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = pal.textDim;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`scale: ${scaleRef.toFixed(0)}px track`, W - 10, 16);
    };

    const drawChart = () => {
      const canvas = chartRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cw = canvas.clientWidth || 300;
      const ch = canvas.clientHeight || 70;
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      if (canvas.width !== cw * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = worldRef.current;
      const pal = getLabPalette(w.isDark);
      ctx.clearRect(0, 0, cw, ch);

      const hist = w.bestFitHistory;
      if (hist.length < 2) return;
      const max = Math.max(...hist, 1);
      ctx.strokeStyle = pal.positive(0.9);
      ctx.lineWidth = 2;
      ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / (hist.length - 1)) * cw;
        const y = ch - (v / max) * ch;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const loop = () => {
      const w = worldRef.current;
      if (w.running) {
        w.creatures.forEach((c) => {
          const v = stepVelocity(w.step, c.pheno) * c.terrain;
          c.pos = Math.max(0, c.pos + v);
        });
        w.step += 1;
        if (w.step >= STEPS_PER_GEN) {
          nextGeneration();
        }
      }
      drawTrack();
      drawChart();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [nextGeneration]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas ref={canvasRef} className="block w-full h-auto rounded-xl" style={{ aspectRatio: `${W} / ${H}` }} />
      </div>

      <div className="w-full max-w-xl">
        <canvas ref={chartRef} className="w-full" style={{ height: 60 }} />
        <p className="mt-1 text-center text-[11px] font-mono text-slate-400 dark:text-slate-600">best distance per generation — climbing is the gait getting more efficient</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Resume'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={resetAll}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <Shuffle className="h-3.5 w-3.5" />
          New Population
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>generation <span className="text-slate-800 dark:text-slate-100">{stats.gen}</span></span>
        <span>best ever <span className="text-slate-800 dark:text-slate-100">{stats.bestEver.toFixed(0)}px</span></span>
        <span>this gen <span className="text-slate-800 dark:text-slate-100">{stats.bestGen.toFixed(0)}px</span></span>
        <span>avg <span className="text-slate-800 dark:text-slate-100">{stats.avgGen.toFixed(0)}px</span></span>
      </div>

      <TrainingConsole lines={log} label="evolve.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        No hand-coded gait — every creature is just four numbers (stride length, ground-contact
        time, leg timing offset, energy split) scored by how far it gets on a fixed energy budget.
        Legs that fire together waste half their push; natural selection has to find alternation on
        its own.
      </p>
    </div>
  );
}
