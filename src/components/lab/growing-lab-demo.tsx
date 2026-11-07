'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Hand, Skull } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const GRID = 16;
const CELL = 20;
const W = GRID * CELL;
const H = GRID * CELL;
const N_PARAMS = 9 * 6 + 6 + 6 * 1 + 1; // W1(6x9) + b1(6) + W2(1x6) + b2(1) = 67
const POP = 24;
const GROW_STEPS = 18;
const FITNESS_TARGET = 0.9;
const MAX_GENERATIONS = 500;
const FALL_MS = 380;
const AFTERGLOW_MS = 550;
const RECOVERY_WINDOW_MS = 3600;

type Genome = Float32Array;

function randGenome(): Genome {
  const g = new Float32Array(N_PARAMS);
  for (let i = 0; i < N_PARAMS; i++) g[i] = (Math.random() - 0.5) * 1.6;
  return g;
}

function mutate(genome: Genome, rate: number, scale: number): Genome {
  const child = new Float32Array(N_PARAMS);
  for (let i = 0; i < N_PARAMS; i++) {
    child[i] = genome[i];
    if (Math.random() < rate) child[i] += (Math.random() - 0.5) * scale;
    child[i] = Math.max(-2, Math.min(2, child[i]));
  }
  return child;
}

/** A body disk plus four symmetric limb nubs at the cardinal points. A
 * weight-shared local rule has no sense of position, so growing from one
 * central seed can only ever reach a shape that shares the grid's own
 * symmetry — this is the most "creature-like" silhouette (body + legs)
 * that's actually honest for this architecture to converge on, rather
 * than faking a one-directional dinosaur profile it could never learn. */
function buildTarget(): Float32Array {
  const t = new Float32Array(GRID * GRID);
  const cx = (GRID - 1) / 2;
  const cy = (GRID - 1) / 2;
  const limbs = [
    [0, -6.3], [0, 6.3], [-6.3, 0], [6.3, 0],
  ];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const body = Math.hypot(x - cx, y - cy) <= 4.3;
      const limb = limbs.some(([lx, ly]) => Math.hypot(x - (cx + lx), y - (cy + ly)) <= 1.4);
      t[y * GRID + x] = body || limb ? 1 : 0;
    }
  }
  return t;
}

const TARGET = buildTarget();

function scoreGrid(grid: Float32Array): number {
  let sq = 0;
  for (let i = 0; i < grid.length; i++) {
    const d = grid[i] - TARGET[i];
    sq += d * d;
  }
  return 1 - sq / grid.length;
}

function seedGrid(): Float32Array {
  const g = new Float32Array(GRID * GRID);
  g[Math.floor(GRID / 2) * GRID + Math.floor(GRID / 2)] = 1;
  return g;
}

type Impact = { gx: number; gy: number; radius: number; startTime: number; impacted: boolean; impactTime: number };

/** One synchronous update of every cell, using the SAME small weight set
 * everywhere — this weight-sharing (like a convolution) is what makes it
 * a cellular automaton rather than 256 independent little brains. */
function step(grid: Float32Array, genome: Genome): Float32Array {
  const next = new Float32Array(GRID * GRID);
  const w1Base = 0;
  const b1Base = 54;
  const w2Base = 60;
  const b2 = genome[66];
  const neigh = new Float32Array(9);
  const hidden = new Float32Array(6);

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const idx = y * GRID + x;
      const alpha = grid[idx];
      let k = 0;
      let maxNeigh = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy, nx = x + dx;
          const v = ny >= 0 && ny < GRID && nx >= 0 && nx < GRID ? grid[ny * GRID + nx] : 0;
          neigh[k++] = v;
          if (v > maxNeigh) maxNeigh = v;
        }
      }
      if (alpha < 0.02 && maxNeigh < 0.08) {
        next[idx] = 0;
        continue;
      }
      for (let j = 0; j < 6; j++) {
        let s = genome[b1Base + j];
        for (let i = 0; i < 9; i++) s += genome[w1Base + j * 9 + i] * neigh[i];
        hidden[j] = Math.tanh(s);
      }
      let out = b2;
      for (let j = 0; j < 6; j++) out += genome[w2Base + j] * hidden[j];
      const delta = Math.tanh(out);
      next[idx] = Math.min(1, Math.max(0, alpha + 0.3 * delta));
    }
  }
  return next;
}

function fitnessOf(genome: Genome): number {
  let grid = seedGrid();
  for (let s = 0; s < GROW_STEPS; s++) grid = step(grid, genome);
  return scoreGrid(grid);
}

/** Simulates a genome forward from an arbitrary (possibly damaged) grid
 * rather than from the seed — used to test whether a mutated rule would
 * recover a wounded colony better than the one currently running. */
function fitnessFrom(grid: Float32Array, genome: Genome, steps: number): number {
  let g = grid;
  for (let s = 0; s < steps; s++) g = step(g, genome);
  return scoreGrid(g);
}

/**
 * A single tiny local rule — the same ~67 numbers applied to every cell,
 * every step, like a hand-rolled convolution — evolved (not backprop-
 * trained) until it reliably grows a blob from one seed pixel. Once it's
 * good enough, click any grown cell to damage it and watch whether the
 * rule's own dynamics heal the wound, the way real neural-cellular-
 * automata papers demonstrate self-repair.
 */
export function GrowingLabDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<'evolving' | 'interactive'>('evolving');
  const [log, setLog] = useState<string[]>(['gen 0 — random rule, mostly static noise around the seed']);
  const [stats, setStats] = useState({ gen: 0, bestFit: 0 });

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const worldRef = useRef({
    population: Array.from({ length: POP }, randGenome),
    gen: 0,
    bestGenome: null as Genome | null,
    bestFitness: -Infinity,
    fitHistory: [] as number[],
    running: true,
    mode: 'evolving' as 'evolving' | 'interactive',
    previewGrid: seedGrid(),
    previewStep: 0,
    frameCount: 0,
    isDark,
    impacts: [] as Impact[],
    extinction: { active: false, triggeredAt: 0, resolved: true },
  });
  worldRef.current.running = running;
  worldRef.current.isDark = isDark;
  worldRef.current.mode = mode;

  const spawnImpact = useCallback((gx: number, gy: number, radius: number, delayMs: number) => {
    worldRef.current.impacts.push({
      gx, gy, radius,
      startTime: performance.now() + delayMs,
      impacted: false,
      impactTime: 0,
    });
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (worldRef.current.mode !== 'interactive') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const gx = Math.floor(((e.clientX - rect.left) / rect.width) * GRID);
    const gy = Math.floor(((e.clientY - rect.top) / rect.height) * GRID);
    if (gx < 0 || gx >= GRID || gy < 0 || gy >= GRID) return;
    spawnImpact(gx, gy, 1, 0);
    pushLog(`asteroid incoming at (${gx}, ${gy})…`);
  };

  const triggerExtinction = useCallback(() => {
    if (worldRef.current.mode !== 'interactive') return;
    const n = 6;
    for (let i = 0; i < n; i++) {
      const gx = Math.floor(Math.random() * GRID);
      const gy = Math.floor(Math.random() * GRID);
      const radius = Math.random() < 0.4 ? 2 : 1;
      spawnImpact(gx, gy, radius, i * 140);
    }
    pushLog('mass extinction event triggered — a swarm of asteroids inbound');
  }, [spawnImpact, pushLog]);

  const restart = useCallback(() => {
    const w = worldRef.current;
    w.population = Array.from({ length: POP }, randGenome);
    w.gen = 0;
    w.bestGenome = null;
    w.bestFitness = -Infinity;
    w.fitHistory = [];
    w.previewGrid = seedGrid();
    w.previewStep = 0;
    w.impacts = [];
    w.extinction = { active: false, triggeredAt: 0, resolved: true };
    setMode('evolving');
    setStats({ gen: 0, bestFit: 0 });
    setLog(['new random colony — gen 0']);
  }, []);

  useEffect(() => {
    let raf = 0;

    const drawGrid = (grid: Float32Array) => {
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

      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          const v = grid[y * GRID + x];
          if (v < 0.03) continue;
          const r = Math.round(56 + v * 60);
          const g = Math.round(100 + v * 90);
          const b = Math.round(220 - v * 20);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.25 + v * 0.75})`;
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }

      ctx.strokeStyle = pal.gridLine;
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
      }

      // Falling asteroids and their impact craters/shockwaves — purely a
      // rendering overlay, the actual grid wipe happens once in the loop.
      const nowT = performance.now();
      for (const imp of w.impacts) {
        const cx = imp.gx * CELL + CELL / 2;
        const cyTarget = imp.gy * CELL + CELL / 2;
        if (!imp.impacted) {
          const t = (nowT - imp.startTime) / FALL_MS;
          if (t < 0 || t > 1) continue;
          const cy = -20 + t * (cyTarget + 20);
          ctx.strokeStyle = 'rgba(255,140,60,0.55)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 16);
          ctx.lineTo(cx, cy - 4);
          ctx.stroke();
          ctx.fillStyle = '#8a5236';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,205,130,0.95)';
          ctx.beginPath();
          ctx.arc(cx, cy, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const t = (nowT - imp.impactTime) / AFTERGLOW_MS;
          if (t > 1) continue;
          const ringR = 6 + t * CELL * (imp.radius + 1);
          ctx.strokeStyle = `rgba(255,120,60,${(1 - t) * 0.8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cyTarget, ringR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(50,25,15,${(1 - t) * 0.35})`;
          ctx.beginPath();
          ctx.arc(cx, cyTarget, CELL * (imp.radius + 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawChart = () => {
      const canvas = chartRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cw = canvas.clientWidth || 300;
      const ch = canvas.clientHeight || 60;
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      if (canvas.width !== cw * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = worldRef.current;
      const pal = getLabPalette(w.isDark);
      ctx.clearRect(0, 0, cw, ch);
      const hist = w.fitHistory;
      if (hist.length < 2) return;
      ctx.strokeStyle = pal.positive(0.9);
      ctx.lineWidth = 2;
      ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / (hist.length - 1)) * cw;
        const y = ch - Math.max(0, Math.min(1, v)) * ch;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const runGeneration = () => {
      const w = worldRef.current;
      const scored = w.population.map((genome) => ({ genome, fit: fitnessOf(genome) }));
      scored.sort((a, b) => b.fit - a.fit);
      const best = scored[0];

      if (best.fit > w.bestFitness) {
        w.bestFitness = best.fit;
        w.bestGenome = best.genome.slice();
        if (w.gen % 3 === 0 || best.fit > FITNESS_TARGET - 0.05) {
          pushLog(`gen ${w.gen}: new best rule — ${(best.fit * 100).toFixed(1)}% match to target`);
        }
      }
      w.fitHistory.push(best.fit);
      if (w.fitHistory.length > 300) w.fitHistory.shift();
      w.gen += 1;
      setStats({ gen: w.gen, bestFit: w.bestFitness });

      if (w.bestFitness >= FITNESS_TARGET || w.gen >= MAX_GENERATIONS) {
        w.mode = 'interactive';
        w.previewGrid = seedGrid();
        w.previewStep = 0;
        w.impacts = [];
        w.extinction = { active: false, triggeredAt: 0, resolved: true };
        setMode('interactive');
        pushLog(`gen ${w.gen}: colony locked in at ${(w.bestFitness * 100).toFixed(1)}% — tap the grid to send an asteroid`);
        return;
      }

      const survivors = scored.slice(0, Math.max(3, Math.ceil(POP / 2)));
      const nextPop: Genome[] = scored.slice(0, 2).map((s) => s.genome.slice());
      while (nextPop.length < POP) {
        const pa = survivors[Math.floor(Math.random() * survivors.length)].genome;
        const pb = survivors[Math.floor(Math.random() * survivors.length)].genome;
        const child = new Float32Array(N_PARAMS);
        for (let i = 0; i < N_PARAMS; i++) {
          child[i] = Math.random() < 0.5 ? pa[i] : pb[i];
          if (Math.random() < 0.15) child[i] += (Math.random() - 0.5) * 0.6;
          child[i] = Math.max(-2, Math.min(2, child[i]));
        }
        nextPop.push(child);
      }
      w.population = nextPop;
    };

    const loop = () => {
      const w = worldRef.current;
      w.frameCount++;

      if (w.mode === 'evolving') {
        // Throttled rather than once per frame — full-speed evolution finishes
        // in well under a second, which reads as a glitch rather than a process.
        if (w.running && w.frameCount % 2 === 0) runGeneration();
        if (w.bestGenome) {
          // Replay the current best rule's growth, looping, as a live preview.
          if (w.frameCount % 3 === 0) {
            w.previewStep++;
            if (w.previewStep > GROW_STEPS) {
              w.previewGrid = seedGrid();
              w.previewStep = 0;
            } else {
              w.previewGrid = step(w.previewGrid, w.bestGenome);
            }
          }
        }
        drawGrid(w.previewGrid);
      } else {
        // Interactive: keep applying the locked-in rule to whatever state
        // is currently on screen, damage included — no reset to seed.
        if (w.running && w.bestGenome && w.frameCount % 4 === 0) {
          w.previewGrid = step(w.previewGrid, w.bestGenome);
        }

        // Land any asteroids whose fall animation has finished, carving a
        // real crater into the grid and starting a recovery watch.
        const nowT = performance.now();
        w.impacts = w.impacts.filter((imp) => {
          if (!imp.impacted) {
            if (nowT >= imp.startTime + FALL_MS) {
              for (let dy = -imp.radius; dy <= imp.radius; dy++) {
                for (let dx = -imp.radius; dx <= imp.radius; dx++) {
                  const ny = imp.gy + dy, nx = imp.gx + dx;
                  if (ny >= 0 && ny < GRID && nx >= 0 && nx < GRID && Math.hypot(dx, dy) <= imp.radius + 0.3) {
                    w.previewGrid[ny * GRID + nx] = 0;
                  }
                }
              }
              imp.impacted = true;
              imp.impactTime = nowT;
              w.extinction = { active: true, resolved: false, triggeredAt: nowT };
            }
            return true;
          }
          return nowT - imp.impactTime < AFTERGLOW_MS;
        });

        // A few seconds after the last impact lands, check whether the
        // colony recovered on its own. If it's still badly damaged, try a
        // handful of small mutations of the locked-in rule and adopt
        // whichever one regrows the colony best from its current, wounded
        // state — a real evolutionary rescue, not a scripted outcome.
        if (w.bestGenome && w.extinction.active && !w.extinction.resolved && nowT - w.extinction.triggeredAt > RECOVERY_WINDOW_MS) {
          const currentFit = scoreGrid(w.previewGrid);
          const threshold = w.bestFitness * 0.6;
          if (currentFit < threshold) {
            const baseline = fitnessFrom(w.previewGrid, w.bestGenome, 24);
            let bestMutant = w.bestGenome;
            let bestMutantFit = baseline;
            for (let k = 0; k < 6; k++) {
              const cand = mutate(w.bestGenome, 0.25, 0.6);
              const fit = fitnessFrom(w.previewGrid, cand, 24);
              if (fit > bestMutantFit) { bestMutantFit = fit; bestMutant = cand; }
            }
            if (bestMutantFit > baseline + 0.04) {
              w.bestGenome = bestMutant;
              pushLog(`rescue mutation: a hardier rule took over, +${((bestMutantFit - baseline) * 100).toFixed(1)}% recovery`);
            } else {
              pushLog(`the colony is struggling to recover — only ${(currentFit * 100).toFixed(1)}% of the shape is left`);
            }
          } else {
            pushLog(`colony recovered on its own — ${(currentFit * 100).toFixed(1)}% match restored`);
          }
          w.extinction.resolved = true;
          w.extinction.active = false;
        }

        drawGrid(w.previewGrid);
      }
      drawChart();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pushLog]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-sm mx-auto rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`block w-full h-auto rounded-xl ${mode === 'interactive' ? 'cursor-crosshair' : ''}`}
          style={{ aspectRatio: `${W} / ${H}` }}
        />
      </div>

      <div className="w-full max-w-xl">
        <canvas ref={chartRef} className="w-full" style={{ height: 56 }} />
        <p className="mt-1 text-center text-[11px] font-mono text-slate-400 dark:text-slate-600">best match-to-target per generation</p>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${
          mode === 'interactive'
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
            : 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
        }`}
      >
        {mode === 'interactive' ? <Hand className="h-3.5 w-3.5" /> : null}
        {mode === 'interactive' ? 'Rule locked in — tap the grid to send an asteroid' : 'Evolving the growth rule…'}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {running ? 'Pause' : 'Resume'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={restart}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Evolve Again
        </motion.button>
        {mode === 'interactive' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={triggerExtinction}
            className="flex items-center gap-2 rounded-full border border-orange-500/40 dark:border-orange-400/40 bg-orange-500/10 dark:bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 transition-colors hover:bg-orange-500/20 dark:hover:bg-orange-400/20"
          >
            <Skull className="h-3.5 w-3.5" />
            Mass Extinction
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>generation <span className="text-slate-800 dark:text-slate-100">{stats.gen}</span></span>
        <span>best match <span className="text-slate-800 dark:text-slate-100">{(stats.bestFit * 100).toFixed(1)}%</span></span>
      </div>

      <TrainingConsole lines={log} label="grow.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        The same ~70 numbers run on every cell, every step — one shared rule, evolved rather than
        backprop trained, that grows a creature-like colony from a single seed. Tap the grid to
        send down an asteroid, or trigger a mass extinction for a swarm of them. Craters wipe real
        cells, and if the colony can&apos;t recover on its own after a few seconds, a round of small
        mutations is tried against the damage — the first one that regrows the colony better takes
        over the rule, live.
      </p>
    </div>
  );
}
