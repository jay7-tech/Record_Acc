'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, RotateCcw } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const W = 640;
const H = 420;
const PAD = 40;
const DOMAIN = 10; // x, y both range 0..DOMAIN in data space

type Point = { x: number; y: number };

function toCanvas(p: Point) {
  return {
    x: PAD + (p.x / DOMAIN) * (W - PAD * 2),
    y: H - PAD - (p.y / DOMAIN) * (H - PAD * 2),
  };
}

function fromCanvas(px: number, py: number): Point {
  return {
    x: ((px - PAD) / (W - PAD * 2)) * DOMAIN,
    y: ((H - PAD - py) / (H - PAD * 2)) * DOMAIN,
  };
}

function randomDataset(): Point[] {
  const trueW = 0.4 + Math.random() * 1.2;
  const trueB = Math.random() * 4;
  const n = 14 + Math.floor(Math.random() * 6);
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * DOMAIN;
    const noise = (Math.random() - 0.5) * 2.2;
    const y = Math.min(DOMAIN, Math.max(0, trueW * x + trueB + noise));
    pts.push({ x, y });
  }
  return pts;
}

/**
 * A live, clickable gradient-descent demo: add points (or generate a random
 * noisy dataset), hit run, and watch batch gradient descent fit a line in
 * real time — same loop every ML course teaches, actually running here.
 */
export function RegressionLabDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [points, setPoints] = useState<Point[]>(() => randomDataset());
  const [w, setW] = useState(0.1);
  const [b, setB] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [loss, setLoss] = useState(0);
  const [log, setLog] = useState<string[]>(['ready — click run or add your own points']);
  const lossHistoryRef = useRef<number[]>([]);
  const stateRef = useRef({ points, w, b, running, isDark });
  stateRef.current = { points, w, b, running, isDark };
  const lastLogRef = useRef(0);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const reset = useCallback((newPoints?: Point[]) => {
    setW(Math.random() * 0.4 - 0.2);
    setB(Math.random() * 2);
    setIteration(0);
    setLoss(0);
    lossHistoryRef.current = [];
    setLog(['reset — ready to train']);
    if (newPoints) setPoints(newPoints);
  }, []);

  useEffect(() => {
    let raf = 0;
    const LR = 0.012;

    const step = (time: number) => {
      const { points, w, b, running } = stateRef.current;

      if (running && points.length > 1) {
        let gw = 0, gb = 0, totalLoss = 0;
        for (const p of points) {
          const pred = w * p.x + b;
          const err = pred - p.y;
          gw += err * p.x;
          gb += err;
          totalLoss += err * err;
        }
        const n = points.length;
        gw = (2 * gw) / n;
        gb = (2 * gb) / n;
        const newW = w - LR * gw;
        const newB = b - LR * gb;
        const newLoss = totalLoss / n;

        setW(newW);
        setB(newB);
        setLoss(newLoss);
        setIteration((i) => i + 1);
        lossHistoryRef.current.push(newLoss);
        if (lossHistoryRef.current.length > 120) lossHistoryRef.current.shift();

        if (time - lastLogRef.current > 450) {
          lastLogRef.current = time;
          pushLog(`step ${iteration + 1}: loss ${newLoss.toFixed(3)}, w=${newW.toFixed(3)} b=${newB.toFixed(3)}`);
        }
      }

      draw();
      raf = requestAnimationFrame(step);
    };

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

      const { points, w, b, isDark } = stateRef.current;
      const pal = getLabPalette(isDark);
      ctx.fillStyle = pal.canvasBg;
      ctx.fillRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = pal.gridLine;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const gx = PAD + (i / 10) * (W - PAD * 2);
        const gy = PAD + (i / 10) * (H - PAD * 2);
        ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, H - PAD); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(W - PAD, gy); ctx.stroke();
      }
      ctx.strokeStyle = pal.border;
      ctx.strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

      // residuals
      ctx.strokeStyle = pal.negative(0.4);
      ctx.lineWidth = 1;
      for (const p of points) {
        const predY = w * p.x + b;
        const a = toCanvas(p);
        const bPt = toCanvas({ x: p.x, y: predY });
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bPt.x, bPt.y);
        ctx.stroke();
      }

      // fitted line
      const lineStart = toCanvas({ x: 0, y: w * 0 + b });
      const lineEnd = toCanvas({ x: DOMAIN, y: w * DOMAIN + b });
      ctx.strokeStyle = pal.positive(0.9);
      ctx.lineWidth = 2.5;
      ctx.shadowColor = pal.positive(0.6);
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(lineEnd.x, lineEnd.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // points — glowing orbs
      for (const p of points) {
        const c = toCanvas(p);
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 11);
        grad.addColorStop(0, pal.pointFill);
        grad.addColorStop(1, `${pal.pointFill}00`);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = pal.pointFill;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = pal.pointStroke;
        ctx.stroke();
      }

      // loss sparkline
      const hist = lossHistoryRef.current;
      if (hist.length > 1) {
        const sparkX = W - 150, sparkY = 20, sparkW = 130, sparkH = 36;
        const maxLoss = Math.max(...hist, 0.001);
        ctx.strokeStyle = pal.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(sparkX, sparkY, sparkW, sparkH);
        ctx.beginPath();
        hist.forEach((l, i) => {
          const x = sparkX + (i / (hist.length - 1)) * sparkW;
          const y = sparkY + sparkH - (l / maxLoss) * sparkH;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = pal.positive(0.9);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = pal.textDim;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('loss', sparkX, sparkY - 4);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [iteration, pushLog]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    if (px < PAD || px > W - PAD || py < PAD || py > H - PAD) return;
    const p = fromCanvas(px, py);
    setPoints((prev) => [...prev, p]);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-[664px] mx-auto rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas
          ref={canvasRef}
          className="block w-full h-auto rounded-xl cursor-crosshair"
          style={{ aspectRatio: `${W} / ${H}` }}
          onClick={handleCanvasClick}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Run Gradient Descent'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => reset(randomDataset())}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Randomize
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => reset([])}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </motion.button>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>iter <span className="text-slate-800 dark:text-slate-100">{iteration}</span></span>
        <span>loss <span className="text-slate-800 dark:text-slate-100">{loss.toFixed(3)}</span></span>
        <span>y = <span className="text-sky-600 dark:text-sky-300">{w.toFixed(2)}</span>x + <span className="text-sky-600 dark:text-sky-300">{b.toFixed(2)}</span></span>
      </div>

      <TrainingConsole lines={log} label="gradient.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">Click anywhere on the grid to add your own data points.</p>
    </div>
  );
}
