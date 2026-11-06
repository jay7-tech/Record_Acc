'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eraser } from 'lucide-react';

const DISPLAY_SIZE = 300; // CSS pixels
const GRID = 28; // model input is 28x28 (MNIST convention)
const INNER_BOX = 20; // standard MNIST normalization: digit's longest side -> 20px within the 28px frame
const STROKE_WIDTH = 24;

type Props = {
  onPixels: (pixels: number[], hasInk: boolean) => void;
};

/**
 * A freehand drawing pad that reproduces the classic MNIST normalization
 * pipeline: crop to the ink's bounding box, scale its longest side to 20px,
 * then re-center it inside the 28x28 frame by center of mass (not just the
 * bounding-box center) — this is what makes a mouse-drawn digit actually
 * resemble the training distribution instead of confusing the network.
 */
export function DigitCanvas({ onPixels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d', { willReadFrequently: true });
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onPixels(new Array(GRID * GRID).fill(0), false);
  }, [getCtx, onPixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = DISPLAY_SIZE * dpr;
    canvas.height = DISPLAY_SIZE * dpr;
    canvas.style.width = `${DISPLAY_SIZE}px`;
    canvas.style.height = `${DISPLAY_SIZE}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const samplePixels = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const w = DISPLAY_SIZE * dpr;
    const h = DISPLAY_SIZE * dpr;
    const { data } = ctx.getImageData(0, 0, w, h);

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let found = false;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const lum = data[(y * w + x) * 4];
        if (lum > 40) {
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!found) {
      onPixels(new Array(GRID * GRID).fill(0), false);
      return;
    }

    const boxW = Math.max(1, maxX - minX);
    const boxH = Math.max(1, maxY - minY);
    const pad = Math.max(boxW, boxH) * 0.12;

    const srcW = boxW + pad * 2;
    const srcH = boxH + pad * 2;
    const scale = INNER_BOX / Math.max(boxW, boxH);
    const scaledW = srcW * scale;
    const scaledH = srcH * scale;

    // Pass 1: render bbox-centered, to measure the center of mass.
    const off = document.createElement('canvas');
    off.width = GRID;
    off.height = GRID;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;

    const renderAt = (dx: number, dy: number) => {
      offCtx.imageSmoothingEnabled = true;
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, GRID, GRID);
      offCtx.drawImage(
        canvas,
        minX - pad, minY - pad, srcW, srcH,
        dx, dy, scaledW, scaledH
      );
    };

    const dx0 = (GRID - scaledW) / 2;
    const dy0 = (GRID - scaledH) / 2;
    renderAt(dx0, dy0);

    let probe = offCtx.getImageData(0, 0, GRID, GRID).data;
    let sumX = 0, sumY = 0, sumM = 0;
    for (let yy = 0; yy < GRID; yy++) {
      for (let xx = 0; xx < GRID; xx++) {
        const v = probe[(yy * GRID + xx) * 4];
        sumX += xx * v;
        sumY += yy * v;
        sumM += v;
      }
    }

    let dx = dx0, dy = dy0;
    if (sumM > 0) {
      const comX = sumX / sumM;
      const comY = sumY / sumM;
      const shiftX = GRID / 2 - comX;
      const shiftY = GRID / 2 - comY;
      dx = dx0 + shiftX;
      dy = dy0 + shiftY;
      renderAt(dx, dy);
    }

    const final = offCtx.getImageData(0, 0, GRID, GRID).data;
    const pixels: number[] = [];
    for (let i = 0; i < GRID * GRID; i++) {
      pixels.push(final[i * 4] / 255);
    }
    onPixels(pixels, true);
  }, [getCtx, onPixels]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(e);
    setIsEmpty(false);

    // Register a dot even on a simple tap.
    const ctx = getCtx();
    const p = lastPointRef.current;
    if (ctx && p) {
      ctx.fillStyle = '#f5faff';
      ctx.shadowColor = 'rgba(56,189,248,0.6)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
      ctx.fill();
      samplePixels();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = getCtx();
    const last = lastPointRef.current;
    const current = pointFromEvent(e);
    if (!ctx || !last) return;

    ctx.strokeStyle = '#f5faff';
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(56,189,248,0.6)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();

    lastPointRef.current = current;
    samplePixels();
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-2xl border border-sky-400/20 bg-[#05070c] p-3 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
        <canvas
          ref={canvasRef}
          className="touch-none rounded-xl cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {isEmpty && (
          <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-xl">
            <p className="text-sm text-slate-500 font-mono">draw a digit, 0–9</p>
          </div>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={clear}
        className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-signal/40 hover:text-foreground"
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear
      </motion.button>
    </div>
  );
}
