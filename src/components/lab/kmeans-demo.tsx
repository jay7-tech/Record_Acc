'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, RotateCcw } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

const W = 640;
const H = 420;
const PAD = 30;

type Point = { x: number; y: number; cluster: number };
type Centroid = { x: number; y: number };

const PALETTE = ['#38bdf8', '#f472b6', '#facc15', '#34d399', '#a78bfa'];

function randomPoints(k: number): Point[] {
  const pts: Point[] = [];
  const blobCount = k;
  for (let b = 0; b < blobCount; b++) {
    const cx = 60 + Math.random() * (W - 120);
    const cy = 60 + Math.random() * (H - 120);
    const n = 10 + Math.floor(Math.random() * 10);
    for (let i = 0; i < n; i++) {
      pts.push({
        x: cx + (Math.random() - 0.5) * 110,
        y: cy + (Math.random() - 0.5) * 110,
        cluster: -1,
      });
    }
  }
  return pts.map((p) => ({
    x: Math.min(W - PAD, Math.max(PAD, p.x)),
    y: Math.min(H - PAD, Math.max(PAD, p.y)),
    cluster: -1,
  }));
}

/**
 * Live k-means: points get assigned to the nearest centroid, centroids
 * recompute as the mean of their members, repeat — the classic
 * unsupervised-learning loop, animated step by step.
 */
export function KMeansDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const [k, setK] = useState(3);
  const [points, setPoints] = useState<Point[]>(() => randomPoints(3));
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [inertia, setInertia] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const stateRef = useRef({ points, centroids, running, isDark });
  stateRef.current = { points, centroids, running, isDark };
  const lastStepRef = useRef(0);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const initCentroids = useCallback((pts: Point[], kVal: number) => {
    const shuffled = [...pts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, kVal).map((p) => ({ x: p.x, y: p.y }));
  }, []);

  const resetRun = useCallback((newPoints?: Point[], newK?: number) => {
    const pts = (newPoints ?? points).map((p) => ({ ...p, cluster: -1 }));
    const kVal = newK ?? k;
    setPoints(pts);
    setCentroids(initCentroids(pts, kVal));
    setIteration(0);
    setInertia(0);
    setRunning(false);
    setLog([`initialized k=${kVal} centroids from ${pts.length} points`]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, k, initCentroids]);

  useEffect(() => {
    setCentroids(initCentroids(points, k));
    setLog([`initialized k=${k} centroids from ${points.length} points`]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let raf = 0;

    const step = (time: number) => {
      const { points, centroids, running } = stateRef.current;

      if (running && centroids.length > 0 && time - lastStepRef.current > 550) {
        lastStepRef.current = time;

        let totalInertia = 0;
        const assigned = points.map((p) => {
          let best = 0, bestDist = Infinity;
          centroids.forEach((c, ci) => {
            const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
            if (d < bestDist) { bestDist = d; best = ci; }
          });
          totalInertia += bestDist;
          return { ...p, cluster: best };
        });

        const newCentroids = centroids.map((c, ci) => {
          const members = assigned.filter((p) => p.cluster === ci);
          if (members.length === 0) return c;
          return {
            x: members.reduce((s, p) => s + p.x, 0) / members.length,
            y: members.reduce((s, p) => s + p.y, 0) / members.length,
          };
        });

        const moved = newCentroids.reduce(
          (max, c, i) => Math.max(max, Math.hypot(c.x - centroids[i].x, c.y - centroids[i].y)),
          0
        );

        setPoints(assigned);
        setCentroids(newCentroids);
        setInertia(totalInertia);
        setIteration((i) => i + 1);
        pushLog(`iter ${iteration + 1}: inertia ${Math.round(totalInertia)}, max centroid shift ${moved.toFixed(1)}px`);
        if (moved < 0.5) pushLog('converged — centroids stopped moving');
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

      const { points, centroids, isDark } = stateRef.current;
      const pal = getLabPalette(isDark);
      ctx.fillStyle = pal.canvasBg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, W, H);

      points.forEach((p) => {
        if (p.cluster >= 0 && centroids[p.cluster]) {
          const c = centroids[p.cluster];
          ctx.strokeStyle = `${PALETTE[p.cluster % PALETTE.length]}33`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      });

      points.forEach((p) => {
        const color = p.cluster >= 0 ? PALETTE[p.cluster % PALETTE.length] : pal.textDim;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      centroids.forEach((c, i) => {
        const color = PALETTE[i % PALETTE.length];
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = `${color}22`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(c.x - 7, c.y);
        ctx.lineTo(c.x + 7, c.y);
        ctx.moveTo(c.x, c.y - 7);
        ctx.lineTo(c.x, c.y + 7);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
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
    setPoints((prev) => [...prev, { x, y, cluster: -1 }]);
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
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => { setK(n); resetRun(points, n); }}
              className={`h-8 w-8 rounded-full text-sm font-mono transition-colors ${
                k === n ? 'bg-sky-500/15 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 dark:border-sky-400/40' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Run k-Means'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => resetRun(randomPoints(k), k)}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Randomize
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => resetRun([], k)}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </motion.button>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>k <span className="text-slate-800 dark:text-slate-100">{k}</span></span>
        <span>iter <span className="text-slate-800 dark:text-slate-100">{iteration}</span></span>
        <span>inertia <span className="text-slate-800 dark:text-slate-100">{Math.round(inertia)}</span></span>
      </div>

      <TrainingConsole lines={log} label="kmeans.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">Click anywhere to drop a point, then watch the centroids converge.</p>
    </div>
  );
}
