'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, RotateCcw } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const W = 640;
const H = 420;

type Point = { x: number; y: number; label: 0 | 1 };

function randomPoints(): Point[] {
  const pts: Point[] = [];
  const angle = Math.random() * Math.PI;
  const cx = W / 2 + (Math.random() - 0.5) * 100;
  const cy = H / 2 + (Math.random() - 0.5) * 80;
  const dx = Math.cos(angle) * 120;
  const dy = Math.sin(angle) * 120;
  for (let i = 0; i < 16; i++) {
    pts.push({
      x: Math.min(W - 30, Math.max(30, cx + dx + (Math.random() - 0.5) * 160)),
      y: Math.min(H - 30, Math.max(30, cy + dy + (Math.random() - 0.5) * 160)),
      label: 0,
    });
  }
  for (let i = 0; i < 16; i++) {
    pts.push({
      x: Math.min(W - 30, Math.max(30, cx - dx + (Math.random() - 0.5) * 160)),
      y: Math.min(H - 30, Math.max(30, cy - dy + (Math.random() - 0.5) * 160)),
      label: 1,
    });
  }
  return pts;
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * A tiny single-layer perceptron learning a decision boundary live: drop
 * points for two classes, run gradient descent on logistic regression,
 * and watch the boundary line rotate into place as it separates them.
 */
export function DecisionBoundaryDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [points, setPoints] = useState<Point[]>(() => randomPoints());
  const [activeLabel, setActiveLabel] = useState<0 | 1>(0);
  const [w, setW] = useState({ w1: 0.01, w2: 0.01, b: 0 });
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [log, setLog] = useState<string[]>(['ready — place points for class A and B']);
  const stateRef = useRef({ points, w, running, isDark });
  stateRef.current = { points, w, running, isDark };
  const lastLogRef = useRef(0);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const reset = useCallback((newPoints?: Point[]) => {
    setW({ w1: (Math.random() - 0.5) * 0.02, w2: (Math.random() - 0.5) * 0.02, b: 0 });
    setIteration(0);
    setAccuracy(0);
    setLog(['reset — ready to train']);
    if (newPoints) setPoints(newPoints);
  }, []);

  useEffect(() => {
    let raf = 0;
    const LR = 0.00006;

    const normalize = (p: Point) => ({ x: p.x - W / 2, y: p.y - H / 2, label: p.label });

    const step = (time: number) => {
      const { points, w, running } = stateRef.current;

      if (running && points.length > 2) {
        let gW1 = 0, gW2 = 0, gB = 0, correct = 0;
        const norm = points.map(normalize);
        for (const p of norm) {
          const z = w.w1 * p.x + w.w2 * p.y + w.b;
          const pred = sigmoid(z);
          const err = pred - p.label;
          gW1 += err * p.x;
          gW2 += err * p.y;
          gB += err;
          if ((pred >= 0.5 ? 1 : 0) === p.label) correct++;
        }
        const n = norm.length;
        const newW = {
          w1: w.w1 - LR * (gW1 / n),
          w2: w.w2 - LR * (gW2 / n),
          b: w.b - LR * 4 * (gB / n),
        };
        setW(newW);
        setIteration((i) => i + 1);
        const acc = correct / n;
        setAccuracy(acc);

        if (time - lastLogRef.current > 450) {
          lastLogRef.current = time;
          pushLog(`epoch ${iteration + 1}: accuracy ${Math.round(acc * 100)}%, |w|=${Math.hypot(newW.w1, newW.w2).toFixed(4)}`);
          if (acc === 1) pushLog('separated the classes perfectly');
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

      const { points, w, isDark } = stateRef.current;
      const pal = getLabPalette(isDark);
      ctx.fillStyle = pal.canvasBg;
      ctx.fillRect(0, 0, W, H);

      // Pre-blend each class tint against the opaque background color and
      // paint fully-opaque pixels. putImageData writes raw RGBA straight to
      // the bitmap with no alpha compositing against what's already drawn —
      // writing a translucent alpha there made the canvas itself partially
      // see-through (showing whatever sits behind it in the page), which is
      // what read as a stray, unexplained "mark" rather than a soft tint.
      const imgData = ctx.getImageData(0, 0, W, H);
      const step2 = 6;
      const bg = hexToRgb(pal.canvasBg);
      const classAColor = isDark ? [56, 189, 248] : [2, 132, 199];
      const classBColor = isDark ? [248, 113, 113] : [220, 38, 38];
      const tintAlpha = isDark ? 14 / 255 : 20 / 255;
      for (let y = 0; y < H; y += step2) {
        for (let x = 0; x < W; x += step2) {
          const nx = x - W / 2, ny = y - H / 2;
          const z = w.w1 * nx + w.w2 * ny + w.b;
          const p = sigmoid(z);
          const isClass1 = p >= 0.5;
          const fg = isClass1 ? classBColor : classAColor;
          const r = Math.round(bg[0] * (1 - tintAlpha) + fg[0] * tintAlpha);
          const g = Math.round(bg[1] * (1 - tintAlpha) + fg[1] * tintAlpha);
          const b = Math.round(bg[2] * (1 - tintAlpha) + fg[2] * tintAlpha);
          for (let dy = 0; dy < step2 && y + dy < H; dy++) {
            for (let dx = 0; dx < step2 && x + dx < W; dx++) {
              const idx = ((y + dy) * W + (x + dx)) * 4;
              imgData.data[idx] = r;
              imgData.data[idx + 1] = g;
              imgData.data[idx + 2] = b;
              imgData.data[idx + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);

      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, W, H);

      if (Math.abs(w.w2) > 1e-6 || Math.abs(w.w1) > 1e-6) {
        const pts: { x: number; y: number }[] = [];
        for (const nx of [-W / 2, W / 2]) {
          if (Math.abs(w.w2) > 1e-6) {
            const ny = -(w.w1 * nx + w.b) / w.w2;
            pts.push({ x: nx + W / 2, y: ny + H / 2 });
          }
        }
        if (pts.length === 2) {
          ctx.strokeStyle = pal.text;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = pal.positive(0.5);
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(pts[1].x, pts[1].y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      points.forEach((p) => {
        const color = p.label === 0 ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#f87171' : '#dc2626');
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 11);
        grad.addColorStop(0, color);
        grad.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [iteration, pushLog]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setPoints((prev) => [...prev, { x, y, label: activeLabel }]);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-2 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas
          ref={canvasRef}
          className="rounded-xl cursor-crosshair"
          style={{ width: W, height: H }}
          onClick={handleClick}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 p-1">
          <button
            onClick={() => setActiveLabel(0)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeLabel === 0 ? 'bg-sky-500/15 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 dark:border-sky-400/40' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" /> Class A
          </button>
          <button
            onClick={() => setActiveLabel(1)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeLabel === 1 ? 'bg-rose-500/15 dark:bg-rose-400/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 dark:border-rose-400/40' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 dark:bg-rose-400" /> Class B
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Train'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => reset(randomPoints())}
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
        <span>accuracy <span className="text-slate-800 dark:text-slate-100">{Math.round(accuracy * 100)}%</span></span>
      </div>

      <TrainingConsole lines={log} label="train.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        Pick a class, click to place points, then hit Train. The glowing line is the
        decision boundary the model learns — it rotates and shifts live as gradient
        descent runs, with the shaded halves showing which side counts as Class A vs Class B.
      </p>
    </div>
  );
}
