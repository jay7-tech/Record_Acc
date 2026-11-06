'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, Flame } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const COLS = 16;
const ROWS = 10;
const CELL = 34;
const W = COLS * CELL;
const H = ROWS * CELL;
const START = { x: 0, y: ROWS - 1 };
const GOAL = { x: COLS - 1, y: 0 };
const N_HAZARDS = 11;
const MAX_STEPS = 140;
const ALPHA = 0.5;
const GAMMA = 0.92;
const EPSILON_DECAY = 0.982;
const EPSILON_FLOOR = 0.04;

// 0 up, 1 right, 2 down, 3 left
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

function key(x: number, y: number) {
  return y * COLS + x;
}

function makeHazards(): Set<number> {
  const set = new Set<number>();
  while (set.size < N_HAZARDS) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if ((x === START.x && y === START.y) || (x === GOAL.x && y === GOAL.y)) continue;
    // keep a clear ring around the goal so it's always reachable, never sealed in
    if (Math.abs(x - GOAL.x) + Math.abs(y - GOAL.y) <= 1) continue;
    set.add(key(x, y));
  }
  return set;
}

type Stats = { episode: number; epsilon: number; best: number; avg: number; lastSteps: number };

/**
 * A genuinely-training Q-learning agent: no pretrained weights, no canned
 * path. It starts knowing nothing, stumbles into hazards, and over a few
 * seconds of real tabular Q-learning (run live, in-browser) works out the
 * shortest safe route — visualized as both the agent's live path and a
 * heatmap of the value function it's building up, spreading out from the
 * goal the way Q-learning actually propagates value.
 */
export function RLArenaDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [running, setRunning] = useState(true);
  const [log, setLog] = useState<string[]>(['agent initialized — zero knowledge, exploring randomly']);
  const [stats, setStats] = useState<Stats>({ episode: 0, epsilon: 1, best: -Infinity, avg: 0, lastSteps: 0 });
  const [showHeatmap, setShowHeatmap] = useState(true);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const worldRef = useRef({
    hazards: makeHazards(),
    q: new Float64Array(COLS * ROWS * 4),
    epsilon: 1,
    episode: 0,
    bestReward: -Infinity,
    rewardHistory: [] as number[],
    running: true,
    isDark,
    showHeatmap: true,
    // live episode state
    pos: { x: START.x, y: START.y },
    trail: [{ x: START.x, y: START.y }] as { x: number; y: number }[],
    stepInEpisode: 0,
    episodeReward: 0,
  });
  worldRef.current.running = running;
  worldRef.current.isDark = isDark;
  worldRef.current.showHeatmap = showHeatmap;

  const resetTerrain = useCallback(() => {
    const w = worldRef.current;
    w.hazards = makeHazards();
    w.q = new Float64Array(COLS * ROWS * 4);
    w.epsilon = 1;
    w.episode = 0;
    w.bestReward = -Infinity;
    w.rewardHistory = [];
    w.pos = { x: START.x, y: START.y };
    w.trail = [{ x: START.x, y: START.y }];
    w.stepInEpisode = 0;
    w.episodeReward = 0;
    setStats({ episode: 0, epsilon: 1, best: -Infinity, avg: 0, lastSteps: 0 });
    setLog(['new terrain generated — Q-table wiped, learning from scratch again']);
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastStatTick = 0;

    const maxQ = (x: number, y: number) => {
      const w = worldRef.current;
      const base = key(x, y) * 4;
      return Math.max(w.q[base], w.q[base + 1], w.q[base + 2], w.q[base + 3]);
    };

    const chooseAction = (x: number, y: number) => {
      const w = worldRef.current;
      if (Math.random() < w.epsilon) return Math.floor(Math.random() * 4);
      const base = key(x, y) * 4;
      let best = 0;
      for (let a = 1; a < 4; a++) if (w.q[base + a] > w.q[base + best]) best = a;
      return best;
    };

    const stepOnce = () => {
      const w = worldRef.current;
      const { x, y } = w.pos;
      const a = chooseAction(x, y);
      let nx = x + DX[a];
      let ny = y + DY[a];
      let reward = -1;
      let terminal = false;

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        nx = x;
        ny = y;
        reward = -2;
      } else if (w.hazards.has(key(nx, ny))) {
        reward = -25;
        terminal = true;
      } else if (nx === GOAL.x && ny === GOAL.y) {
        reward = 60;
        terminal = true;
      }

      const base = key(x, y) * 4;
      const nextBest = terminal ? 0 : maxQ(nx, ny);
      w.q[base + a] += ALPHA * (reward + GAMMA * nextBest - w.q[base + a]);

      w.pos = { x: nx, y: ny };
      w.trail.push({ x: nx, y: ny });
      if (w.trail.length > MAX_STEPS + 2) w.trail.shift();
      w.stepInEpisode++;
      w.episodeReward += reward;

      if (terminal || w.stepInEpisode >= MAX_STEPS) {
        const finishedSteps = w.stepInEpisode;
        const finishedReward = w.episodeReward;
        const reachedGoal = nx === GOAL.x && ny === GOAL.y;
        w.episode++;
        w.rewardHistory.push(finishedReward);
        if (w.rewardHistory.length > 180) w.rewardHistory.shift();
        if (finishedReward > w.bestReward) {
          w.bestReward = finishedReward;
          if (w.episode > 1) pushLog(`episode ${w.episode}: new best — reward ${finishedReward.toFixed(0)} in ${finishedSteps} steps`);
        }
        if (reachedGoal && (w.episode <= 3 || w.episode % 25 === 0)) {
          pushLog(`episode ${w.episode}: reached the goal in ${finishedSteps} steps (ε=${w.epsilon.toFixed(2)})`);
        }
        if (!reachedGoal && w.episode <= 3) {
          pushLog(`episode ${w.episode}: ${finishedSteps >= MAX_STEPS ? 'ran out of time' : 'hit a hazard'} — reward ${finishedReward.toFixed(0)}`);
        }
        const prevEps = w.epsilon;
        w.epsilon = Math.max(EPSILON_FLOOR, w.epsilon * EPSILON_DECAY);
        if (prevEps > EPSILON_FLOOR && w.epsilon <= EPSILON_FLOOR) {
          pushLog('epsilon floor reached — mostly exploiting what it has learned now');
        }
        w.pos = { x: START.x, y: START.y };
        w.trail = [{ x: START.x, y: START.y }];
        w.stepInEpisode = 0;
        w.episodeReward = 0;
      }
    };

    const drawGrid = () => {
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

      // value-function heatmap: brighter cells are ones the agent now
      // believes are closer to a safe route to the goal
      if (w.showHeatmap) {
        let maxVal = 1e-6;
        const vals = new Float64Array(COLS * ROWS);
        for (let gy = 0; gy < ROWS; gy++) {
          for (let gx = 0; gx < COLS; gx++) {
            const v = Math.max(0, maxQ(gx, gy));
            vals[key(gx, gy)] = v;
            if (v > maxVal) maxVal = v;
          }
        }
        for (let gy = 0; gy < ROWS; gy++) {
          for (let gx = 0; gx < COLS; gx++) {
            const v = vals[key(gx, gy)] / maxVal;
            if (v <= 0.01) continue;
            ctx.fillStyle = pal.positive(Math.min(0.55, v * 0.6));
            ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
          }
        }
      }

      ctx.strokeStyle = pal.gridLine;
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= COLS; gx++) {
        ctx.beginPath();
        ctx.moveTo(gx * CELL, 0);
        ctx.lineTo(gx * CELL, H);
        ctx.stroke();
      }
      for (let gy = 0; gy <= ROWS; gy++) {
        ctx.beginPath();
        ctx.moveTo(0, gy * CELL);
        ctx.lineTo(W, gy * CELL);
        ctx.stroke();
      }

      // hazards
      w.hazards.forEach((idx) => {
        const gx = idx % COLS;
        const gy = Math.floor(idx / COLS);
        ctx.fillStyle = pal.negative(0.22);
        ctx.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4);
        ctx.strokeStyle = pal.negative(0.6);
        ctx.lineWidth = 1.5;
        const cx = gx * CELL + CELL / 2;
        const cy = gy * CELL + CELL / 2;
        const r = CELL * 0.22;
        ctx.beginPath();
        ctx.moveTo(cx - r, cy - r);
        ctx.lineTo(cx + r, cy + r);
        ctx.moveTo(cx + r, cy - r);
        ctx.lineTo(cx - r, cy + r);
        ctx.stroke();
      });

      // goal
      const goalGrad = ctx.createRadialGradient(
        GOAL.x * CELL + CELL / 2, GOAL.y * CELL + CELL / 2, 0,
        GOAL.x * CELL + CELL / 2, GOAL.y * CELL + CELL / 2, CELL * 0.9
      );
      goalGrad.addColorStop(0, 'rgba(52,211,153,0.9)');
      goalGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = goalGrad;
      ctx.fillRect(GOAL.x * CELL - CELL / 2, GOAL.y * CELL - CELL / 2, CELL * 2, CELL * 2);
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(GOAL.x * CELL + CELL / 2, GOAL.y * CELL + CELL / 2, CELL * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // start marker
      ctx.strokeStyle = pal.textDim;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(START.x * CELL + 5, START.y * CELL + 5, CELL - 10, CELL - 10);

      // trail (fading)
      const trail = w.trail;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        ctx.strokeStyle = `rgba(251,191,36,${0.08 + t * 0.35})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x * CELL + CELL / 2, trail[i - 1].y * CELL + CELL / 2);
        ctx.lineTo(trail[i].x * CELL + CELL / 2, trail[i].y * CELL + CELL / 2);
        ctx.stroke();
      }

      // agent
      const ax = w.pos.x * CELL + CELL / 2;
      const ay = w.pos.y * CELL + CELL / 2;
      const agentGrad = ctx.createRadialGradient(ax, ay, 0, ax, ay, CELL * 0.6);
      agentGrad.addColorStop(0, '#fbbf24');
      agentGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = agentGrad;
      ctx.beginPath();
      ctx.arc(ax, ay, CELL * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(ax, ay, CELL * 0.22, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawChart = () => {
      const canvas = chartRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cw = canvas.clientWidth || 300;
      const ch = canvas.clientHeight || 90;
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      if (canvas.width !== cw * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = worldRef.current;
      const pal = getLabPalette(w.isDark);
      ctx.clearRect(0, 0, cw, ch);

      const hist = w.rewardHistory;
      if (hist.length < 2) return;
      const min = Math.min(...hist, -5);
      const max = Math.max(...hist, 10);
      const range = Math.max(1, max - min);
      const zeroY = ch - ((0 - min) / range) * ch;

      ctx.strokeStyle = pal.gridLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(cw, zeroY);
      ctx.stroke();

      ctx.strokeStyle = pal.positive(0.9);
      ctx.lineWidth = 2;
      ctx.beginPath();
      hist.forEach((r, i) => {
        const x = (i / (hist.length - 1)) * cw;
        const y = ch - ((r - min) / range) * ch;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const loop = (time: number) => {
      const w = worldRef.current;
      if (w.running) {
        stepOnce();
      }
      drawGrid();
      drawChart();

      if (time - lastStatTick > 180) {
        lastStatTick = time;
        const hist = w.rewardHistory;
        const avgSlice = hist.slice(-20);
        const avg = avgSlice.length ? avgSlice.reduce((a, b) => a + b, 0) / avgSlice.length : 0;
        setStats({
          episode: w.episode,
          epsilon: w.epsilon,
          best: w.bestReward,
          avg,
          lastSteps: w.trail.length - 1,
        });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pushLog]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas ref={canvasRef} className="rounded-xl" style={{ width: W, height: H }} />
      </div>

      <div className="w-full max-w-xl">
        <canvas ref={chartRef} className="w-full" style={{ height: 70 }} />
        <p className="mt-1 text-center text-[11px] font-mono text-slate-400 dark:text-slate-600">reward per episode — climbing is the agent getting better</p>
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
          onClick={resetTerrain}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <Shuffle className="h-3.5 w-3.5" />
          New Terrain
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHeatmap((s) => !s)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
            showHeatmap
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          Value Heatmap
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>episode <span className="text-slate-800 dark:text-slate-100">{stats.episode}</span></span>
        <span>ε <span className="text-slate-800 dark:text-slate-100">{stats.epsilon.toFixed(2)}</span></span>
        <span>best reward <span className="text-slate-800 dark:text-slate-100">{stats.best === -Infinity ? '—' : stats.best.toFixed(0)}</span></span>
        <span>avg (last 20) <span className="text-slate-800 dark:text-slate-100">{stats.avg.toFixed(1)}</span></span>
      </div>

      <TrainingConsole lines={log} label="qlearn.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        No pretrained policy — this agent starts knowing nothing and learns the safe route to the
        goal live, through tabular Q-learning, right in your browser. The glow is its real learned
        value function spreading out from the goal as it trains.
      </p>
    </div>
  );
}
