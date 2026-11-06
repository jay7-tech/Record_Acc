'use client';

import { useEffect, useRef } from 'react';
import { MODEL_WEIGHTS } from '@/lib/digit-model';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';

const LOGICAL_W = 920;
const LOGICAL_H = 600;
const COLUMN_X = [0.1, 0.4, 0.66, 0.92];
const DIGIT_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

type Props = {
  rawInput: number[]; // size*size, 0-1
  layerActivations: number[][]; // [h1, h2, probs(10)]
  predictedDigit: number;
  hasInk: boolean;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function NeuralNetworkViz({ rawInput, layerActivations, predictedDigit, hasInk }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  const stateRef = useRef({ rawInput, layerActivations, predictedDigit, hasInk, isDark });
  stateRef.current = { rawInput, layerActivations, predictedDigit, hasInk, isDark };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let t = 0;

    const nodeY = (count: number, i: number) => {
      const margin = 28;
      const usable = LOGICAL_H - margin * 2;
      if (count === 1) return LOGICAL_H / 2;
      return margin + (usable * i) / (count - 1);
    };

    const draw = () => {
      t += 0.02;
      const { rawInput, layerActivations, predictedDigit, hasInk, isDark } = stateRef.current;
      const pal = getLabPalette(isDark);
      const [h1, h2, probs] = layerActivations;

      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

      const inputX = LOGICAL_W * COLUMN_X[0];
      const h1X = LOGICAL_W * COLUMN_X[1];
      const h2X = LOGICAL_W * COLUMN_X[2];
      const outX = LOGICAL_W * COLUMN_X[3];

      // ---- Input layer: a mini heatmap of the exact bitmap fed to the model ----
      const gridSide = Math.max(1, Math.round(Math.sqrt(rawInput.length)));
      const gridTargetH = 170;
      const cell = gridTargetH / gridSide;
      const gridH = gridSide * cell;
      const gridTop = LOGICAL_H / 2 - gridH / 2;
      const inputCenters: { x: number; y: number }[] = [];
      for (let r = 0; r < gridSide; r++) {
        for (let c = 0; c < gridSide; c++) {
          const idx = r * gridSide + c;
          const v = rawInput[idx] ?? 0;
          const x = inputX - gridH / 2 + c * cell;
          const y = gridTop + r * cell;
          inputCenters.push({ x: x + cell / 2, y: y + cell / 2 });
          const intensity = Math.min(1, v);
          if (isDark) {
            ctx.fillStyle = `rgba(${lerp(15, 245, intensity)}, ${lerp(20, 250, intensity)}, ${lerp(30, 255, intensity)}, 1)`;
          } else {
            ctx.fillStyle = `rgba(${lerp(241, 10, intensity)}, ${lerp(245, 25, intensity)}, ${lerp(249, 50, intensity)}, 1)`;
          }
          ctx.fillRect(x, y, cell - 0.4, cell - 0.4);
        }
      }
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(inputX - gridH / 2, gridTop, gridH, gridH);

      const h1Centers = h1.map((_, i) => ({ x: h1X, y: nodeY(h1.length, i) }));
      const h2Centers = h2.map((_, i) => ({ x: h2X, y: nodeY(h2.length, i) }));
      const outCenters = probs.map((_, i) => ({ x: outX, y: nodeY(probs.length, i) }));

      const pulse = hasInk ? 0.55 + 0.45 * Math.sin(t * 2) : 0;

      // ---- Connections: input -> hidden1 (top-K salient per hidden node) ----
      const W0 = MODEL_WEIGHTS[0];
      const K = 6;
      for (let j = 0; j < h1.length; j++) {
        const contributions: { i: number; score: number; signed: number }[] = [];
        for (let i = 0; i < rawInput.length; i++) {
          const v = rawInput[i];
          if (v === 0) continue;
          const w = W0[i]?.[j] ?? 0;
          contributions.push({ i, score: Math.abs(v * w), signed: v * w });
        }
        contributions.sort((a, b) => b.score - a.score);
        const maxScore = contributions[0]?.score || 1;
        for (let k = 0; k < Math.min(K, contributions.length); k++) {
          const { i, score, signed } = contributions[k];
          if (score <= 0) continue;
          const strength = score / maxScore;
          const from = inputCenters[i];
          const to = h1Centers[j];
          const fade = hasInk ? 1 : 0.15;
          ctx.strokeStyle = signed >= 0
            ? pal.positive(0.1 + strength * 0.45 * fade)
            : pal.negative(0.08 + strength * 0.3 * fade);
          ctx.lineWidth = 0.6 + strength * 1.4;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      }

      const drawDenseLayer = (
        fromCenters: { x: number; y: number }[],
        toCenters: { x: number; y: number }[],
        fromActs: number[],
        weights: number[][]
      ) => {
        const maxAbs = Math.max(
          1e-6,
          ...fromActs.map((a, i) => Math.max(...weights[i].map((w) => Math.abs(w * a))))
        );
        for (let i = 0; i < fromCenters.length; i++) {
          for (let j = 0; j < toCenters.length; j++) {
            const signed = fromActs[i] * (weights[i]?.[j] ?? 0);
            const strength = Math.abs(signed) / maxAbs;
            if (strength < 0.06) continue;
            const fade = hasInk ? 1 : 0.12;
            ctx.strokeStyle = signed >= 0
              ? pal.positive(0.06 + strength * 0.55 * fade)
              : pal.negative(0.05 + strength * 0.4 * fade);
            ctx.lineWidth = 0.5 + strength * 1.8;
            ctx.beginPath();
            ctx.moveTo(fromCenters[i].x, fromCenters[i].y);
            ctx.lineTo(toCenters[j].x, toCenters[j].y);
            ctx.stroke();
          }
        }
      };

      drawDenseLayer(h1Centers, h2Centers, h1, MODEL_WEIGHTS[1]);
      drawDenseLayer(h2Centers, outCenters, h2, MODEL_WEIGHTS[2]);

      // ---- Nodes: glowing gradient orbs instead of flat circles ----
      const drawNodeColumn = (
        centers: { x: number; y: number }[],
        activations: number[],
        radius: number,
        isOutput = false
      ) => {
        const maxAct = Math.max(1e-6, ...activations.map((a) => Math.abs(a)));
        centers.forEach((c, i) => {
          const a = Math.abs(activations[i]) / maxAct;
          const isPredicted = isOutput && i === predictedDigit && hasInk;
          const glow = isPredicted ? 0.5 + 0.5 * pulse : a * (hasInk ? 1 : 0.25);

          if (isPredicted) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, radius + 9 + pulse * 5, 0, Math.PI * 2);
            ctx.strokeStyle = pal.positive(0.3 + pulse * 0.4);
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          const outerR = radius + 2 + glow * 5;
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, outerR);
          grad.addColorStop(0, `rgba(${pal.nodeCoreRGB},${0.5 + glow * 0.5})`);
          grad.addColorStop(0.55, `rgba(${pal.nodeGlowRGB},${0.25 + glow * 0.45})`);
          grad.addColorStop(1, `rgba(${pal.nodeGlowRGB},0)`);
          ctx.beginPath();
          ctx.arc(c.x, c.y, outerR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pal.nodeGlowRGB},${0.5 + glow * 0.5})`;
          ctx.fill();

          if (isOutput) {
            ctx.fillStyle = isPredicted ? pal.text : pal.textDim;
            ctx.font = isPredicted ? 'bold 14px "JetBrains Mono", monospace' : '13px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(DIGIT_LABELS[i], c.x + radius + 12, c.y);

            const barMaxW = 54;
            const barW = Math.max(2, activations[i] * barMaxW);
            ctx.fillStyle = isPredicted ? pal.positive(0.85) : pal.textDim;
            ctx.fillRect(c.x + radius + 30, c.y - 3, barW, 6);

            if (hasInk) {
              ctx.fillStyle = pal.textDim;
              ctx.font = '10px "JetBrains Mono", monospace';
              ctx.fillText(`${Math.round(activations[i] * 100)}%`, c.x + radius + 30 + barMaxW + 8, c.y);
            }
          }
        });
      };

      drawNodeColumn(h1Centers, h1, 2.6);
      drawNodeColumn(h2Centers, h2, 3.8);
      drawNodeColumn(outCenters, probs, 6, true);

      // ---- Column labels ----
      ctx.fillStyle = pal.textDim;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`INPUT · ${gridSide}×${gridSide}`, inputX, gridTop + gridH + 22);
      ctx.fillText(`HIDDEN · ${h1.length}`, h1X, LOGICAL_H - 10);
      ctx.fillText(`HIDDEN · ${h2.length}`, h2X, LOGICAL_H - 10);
      ctx.fillText('OUTPUT · 10', outX + 30, LOGICAL_H - 10);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto"
      style={{ aspectRatio: `${LOGICAL_W} / ${LOGICAL_H}` }}
    />
  );
}
