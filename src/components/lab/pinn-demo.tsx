'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const W = 640;
const H = 300;
const PAD = 36;
const T_MAX = 4;
const HIDDEN = 8;
const N_PARAMS = HIDDEN * 3 + 1; // w1(8) + b1(8) + w2(8) + b2(1)
const N_COLLOCATION = 24;
const IC_WEIGHT = 6;
const EPS = 0.015;
const LR = 0.35;

type Params = Float32Array; // [w1(8), b1(8), w2(8), b2(1)]

function initParams(): Params {
  const p = new Float32Array(N_PARAMS);
  for (let i = 0; i < N_PARAMS; i++) p[i] = (Math.random() - 0.5) * 1.2;
  return p;
}

/** Forward pass + its exact analytic first derivative w.r.t. t — a tiny
 * single-hidden-layer tanh net is simple enough that dx/dt has a closed
 * form, so no autodiff engine is needed for the physics residual itself. */
function forward(p: Params, t: number) {
  let x = p[HIDDEN * 2 + HIDDEN];
  let dx = 0;
  for (let i = 0; i < HIDDEN; i++) {
    const w1 = p[i];
    const b1 = p[HIDDEN + i];
    const w2 = p[HIDDEN * 2 + i];
    const h = Math.tanh(w1 * t + b1);
    x += w2 * h;
    dx += w2 * (1 - h * h) * w1;
  }
  return { x, dx };
}

function lossFor(p: Params, k: number, tPoints: number[]) {
  let residualSq = 0;
  for (const t of tPoints) {
    const { x, dx } = forward(p, t);
    const r = dx + k * x; // should be ~0 everywhere if x solves x' = -k x
    residualSq += r * r;
  }
  residualSq /= tPoints.length;
  const ic = forward(p, 0).x - 1; // x(0) = 1
  return residualSq + IC_WEIGHT * ic * ic;
}

function numericalGradStep(p: Params, k: number, tPoints: number[]) {
  const grad = new Float32Array(N_PARAMS);
  for (let i = 0; i < N_PARAMS; i++) {
    const orig = p[i];
    p[i] = orig + EPS;
    const lPlus = lossFor(p, k, tPoints);
    p[i] = orig - EPS;
    const lMinus = lossFor(p, k, tPoints);
    p[i] = orig;
    grad[i] = (lPlus - lMinus) / (2 * EPS);
  }
  for (let i = 0; i < N_PARAMS; i++) p[i] -= LR * grad[i];
}

const PRESETS = [
  { label: 'Slow decay', k: 0.6 },
  { label: 'Medium decay', k: 1.2 },
  { label: 'Fast decay', k: 2.2 },
];

/**
 * No dataset at all — the network never sees a single (t, x) example. It
 * only knows the differential equation x' = -kx and the starting value
 * x(0) = 1, and is trained entirely by minimizing how badly its own
 * output violates that equation at a scatter of time points. Watching the
 * blue curve settle onto the true exponential (dashed) is watching it
 * learn physics from the equation itself, not from examples.
 */
export function PinnDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [running, setRunning] = useState(true);
  const [k, setK] = useState(PRESETS[1].k);
  const [log, setLog] = useState<string[]>(['net initialized — knows nothing but the equation x\' = -kx and x(0) = 1']);
  const [stats, setStats] = useState({ step: 0, loss: 0 });

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const worldRef = useRef({
    params: initParams(),
    k,
    step: 0,
    lossHistory: [] as number[],
    running: true,
    isDark,
    lastLog: -1,
  });
  worldRef.current.running = running;
  worldRef.current.isDark = isDark;
  worldRef.current.k = k;

  const tPointsRef = useRef<number[]>(
    Array.from({ length: N_COLLOCATION }, (_, i) => (i / (N_COLLOCATION - 1)) * T_MAX)
  );

  const reinit = useCallback(() => {
    const w = worldRef.current;
    w.params = initParams();
    w.step = 0;
    w.lossHistory = [];
    w.lastLog = -1;
    setStats({ step: 0, loss: 0 });
    setLog(["net re-initialized — knows nothing but the equation x' = -kx and x(0) = 1"]);
  }, []);

  const applyPreset = (newK: number, label: string) => {
    setK(newK);
    reinit();
    pushLog(`switched physics: ${label} (k=${newK.toFixed(1)}) — relearning from scratch`);
  };

  useEffect(() => {
    let raf = 0;

    const draw = () => {
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

      const toX = (t: number) => PAD + (t / T_MAX) * (W - PAD * 2);
      const toY = (x: number) => H - PAD - Math.max(0, Math.min(1.15, x)) / 1.15 * (H - PAD * 2);

      ctx.strokeStyle = pal.gridLine;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const gx = PAD + (i / 8) * (W - PAD * 2);
        ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, H - PAD); ctx.stroke();
      }
      for (let i = 0; i <= 5; i++) {
        const gy = PAD + (i / 5) * (H - PAD * 2);
        ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(W - PAD, gy); ctx.stroke();
      }
      ctx.strokeStyle = pal.border;
      ctx.strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

      // true analytic solution — dashed
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal.textDim;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * T_MAX;
        const x = Math.exp(-w.k * t);
        const px = toX(t), py = toY(x);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // network's current curve — solid
      ctx.strokeStyle = pal.positive(0.95);
      ctx.lineWidth = 2.5;
      ctx.shadowColor = pal.positive(0.6);
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * T_MAX;
        const { x } = forward(w.params, t);
        const px = toX(t), py = toY(x);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // collocation points, where the residual is actually measured
      ctx.fillStyle = pal.negative(0.5);
      for (const t of tPointsRef.current) {
        const { x } = forward(w.params, t);
        ctx.beginPath();
        ctx.arc(toX(t), toY(x), 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = pal.textDim;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('— true  solution', PAD + 4, PAD + 14);
      ctx.fillStyle = pal.positive(0.9);
      ctx.fillText('— network (training live)', PAD + 4, PAD + 28);
    };

    const drawChart = () => {
      const canvas = chartRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cw = canvas.clientWidth || 300;
      const ch = canvas.clientHeight || 56;
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      if (canvas.width !== cw * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = worldRef.current;
      const pal = getLabPalette(w.isDark);
      ctx.clearRect(0, 0, cw, ch);
      const hist = w.lossHistory;
      if (hist.length < 2) return;
      const max = Math.max(...hist, 1e-4);
      ctx.strokeStyle = pal.negative(0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / (hist.length - 1)) * cw;
        const y = ch - (v / max) * ch;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const loop = () => {
      const w = worldRef.current;
      if (w.running) {
        for (let s = 0; s < 3; s++) {
          numericalGradStep(w.params, w.k, tPointsRef.current);
          w.step++;
        }
        const l = lossFor(w.params, w.k, tPointsRef.current);
        w.lossHistory.push(l);
        if (w.lossHistory.length > 200) w.lossHistory.shift();
        setStats({ step: w.step, loss: l });

        if (w.lastLog < 0 || w.step - w.lastLog > 150) {
          w.lastLog = w.step;
          pushLog(`step ${w.step}: physics-residual loss ${l.toFixed(4)}${l < 0.002 ? ' — converged' : ''}`);
        }
      }
      draw();
      drawChart();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pushLog]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-[664px] mx-auto rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas ref={canvasRef} className="block w-full h-auto rounded-xl" style={{ aspectRatio: `${W} / ${H}` }} />
      </div>

      <div className="w-full max-w-xl">
        <canvas ref={chartRef} className="w-full" style={{ height: 56 }} />
        <p className="mt-1 text-center text-[11px] font-mono text-slate-400 dark:text-slate-600">physics-residual loss — falling means the curve is settling onto the true solution</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset.k, preset.label)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              k === preset.k
                ? 'border-sky-500/50 bg-sky-500/15 text-sky-700 dark:text-sky-300'
                : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-500/40'
            }`}
          >
            {preset.label}
          </button>
        ))}
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
          onClick={reinit}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reinitialize
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>step <span className="text-slate-800 dark:text-slate-100">{stats.step}</span></span>
        <span>loss <span className="text-slate-800 dark:text-slate-100">{stats.loss.toFixed(4)}</span></span>
        <span>k <span className="text-slate-800 dark:text-slate-100">{k.toFixed(1)}</span></span>
      </div>

      <TrainingConsole lines={log} label="pinn.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        Zero training data — the red dots are where the equation's own residual is measured, and
        the only two things the net is ever told are the differential equation and the value at
        t=0. Everything else it has to work out itself.
      </p>
    </div>
  );
}
