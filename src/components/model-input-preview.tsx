'use client';

import { useEffect, useRef } from 'react';

type Props = {
  pixels: number[]; // length = size*size, 0-1
  size: number; // e.g. 28
  displaySize?: number;
};

/**
 * Renders the exact bitmap the network receives — nearest-neighbor
 * upscaled so every input pixel is visible. This is what makes the
 * pipeline feel honest rather than a black box: you can see precisely
 * what got fed into layer one.
 */
export function ModelInputPreview({ pixels, size, displaySize = 92 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const offCtx = off.getContext('2d');
    if (!offCtx) return;
    const imgData = offCtx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const v = Math.round(Math.min(1, Math.max(0, pixels[i] ?? 0)) * 255);
      imgData.data[i * 4] = v;
      imgData.data[i * 4 + 1] = v;
      imgData.data[i * 4 + 2] = v;
      imgData.data[i * 4 + 3] = 255;
    }
    offCtx.putImageData(imgData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, size, size, 0, 0, displaySize * dpr, displaySize * dpr);
  }, [pixels, size, displaySize]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border border-sky-400/20 bg-black"
      style={{ width: displaySize, height: displaySize }}
    />
  );
}
