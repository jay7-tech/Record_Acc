'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw } from 'lucide-react';
import { runAttentionForwardPass, sampleNext, topK, VOCAB } from '@/lib/attn-model';
import { TrainingConsole } from './training-console';

const HEAD_COLORS = ['#38bdf8', '#f472b6', '#facc15', '#34d399'];
const SUGGESTIONS = ['machine learning is', 'the cat sat on the', 'a neural network', 'every day, she'];
const MAX_DISPLAY_LEN = 240;

function glyph(c: string) {
  if (c === ' ') return '·';
  if (c === '\n') return '⏎';
  return c;
}

/**
 * A real, trained-from-scratch tiny transformer (2 layers, 4 attention
 * heads, 64-dim, trained with an actual PyTorch loop — see
 * train_transformer.py) running character-by-character in the browser.
 * Type anything: the bars under each character are the model's real
 * final-layer attention weights — which earlier characters it's actually
 * looking at to predict the next one — and the ranked list is its real
 * next-character distribution. Autocomplete samples from that
 * distribution and feeds the result back in, live.
 */
export function AttentionLabDemo() {
  const [text, setText] = useState(SUGGESTIONS[0]);
  const [autoRunning, setAutoRunning] = useState(false);
  const [log, setLog] = useState<string[]>(['tiny transformer loaded — 2 layers, 4 heads, trained from scratch']);
  const lastLoggedRef = useRef('');

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const result = useMemo(() => runAttentionForwardPass(text), [text]);
  const predictions = useMemo(() => topK(result.probs, 8), [result]);

  useEffect(() => {
    if (!result.tokens.length || autoRunning) return;
    if (lastLoggedRef.current === text) return;
    lastLoggedRef.current = text;
    const avg = result.lastLayerAttention[0]?.map((_, i) =>
      result.lastLayerAttention.reduce((s, row) => s + row[i], 0) / result.lastLayerAttention.length
    ) ?? [];
    let bestIdx = 0;
    for (let i = 0; i < avg.length - 1; i++) if (avg[i] > avg[bestIdx]) bestIdx = i;
    const bestChar = glyph(result.tokens[bestIdx] ?? '');
    const top = predictions[0];
    pushLog(
      `"${text.slice(-16)}" → attending most to '${bestChar}' (pos ${bestIdx}) · predicts '${glyph(top.char)}' at ${(top.p * 100).toFixed(1)}%`
    );
  }, [text, result, predictions, autoRunning, pushLog]);

  useEffect(() => {
    if (!autoRunning) return;
    let stopped = false;
    let count = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (stopped || count >= 90) {
        setAutoRunning(false);
        return;
      }
      setText((prev) => {
        const r = runAttentionForwardPass(prev);
        const idx = sampleNext(r.probs, 0.65);
        const nextChar = VOCAB[idx];
        if (count % 4 === 0) {
          pushLog(`sampled '${glyph(nextChar)}' at ${(r.probs[idx] * 100).toFixed(1)}% confidence`);
        }
        const grown = prev + nextChar;
        return grown.length > MAX_DISPLAY_LEN ? grown.slice(grown.length - MAX_DISPLAY_LEN) : grown;
      });
      count++;
      timeout = setTimeout(tick, 55);
    };

    timeout = setTimeout(tick, 55);
    return () => {
      stopped = true;
      clearTimeout(timeout);
    };
  }, [autoRunning, pushLog]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-2xl">
        <input
          value={text}
          onChange={(e) => !autoRunning && setText(e.target.value.slice(0, MAX_DISPLAY_LEN))}
          readOnly={autoRunning}
          placeholder="type anything…"
          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#05070c] px-4 py-3 font-mono text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-60"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              disabled={autoRunning}
              onClick={() => setText(s)}
              className="rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-xs text-slate-500 dark:text-slate-400 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-sky-300 transition-colors disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-white dark:bg-[#05070c] p-5 shadow-[0_0_40px_rgba(56,189,248,0.08)] overflow-x-auto">
        <p className="mb-3 text-center text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-600">
          final-layer attention — 4 heads, from the last character
        </p>
        <div className="flex flex-wrap items-end justify-center gap-1 min-h-[70px]">
          {result.tokens.map((c, i) => {
            const isLast = i === result.tokens.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`inline-flex h-6 w-5 items-center justify-center rounded text-[12px] font-mono ${
                    isLast
                      ? 'bg-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {glyph(c)}
                </span>
                <div className="flex gap-[2px] h-6 items-end">
                  {HEAD_COLORS.map((color, h) => {
                    const w = result.lastLayerAttention[h]?.[i] ?? 0;
                    return (
                      <div
                        key={h}
                        className="w-[3px] rounded-sm transition-all duration-150"
                        style={{ height: `${Math.max(2, w * 22)}px`, background: color, opacity: 0.3 + w * 0.7 }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-md space-y-1.5">
        <p className="mb-1 text-center text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-600">
          next-character prediction
        </p>
        {predictions.map(({ char, p }) => (
          <div key={char} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center font-mono text-xs text-slate-500 dark:text-slate-400">{glyph(char)}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                animate={{ width: `${Math.max(1, p * 100)}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-xs text-slate-500 dark:text-slate-400">{(p * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAutoRunning((r) => !r)}
          className="flex items-center gap-2 rounded-full border border-sky-500/40 dark:border-sky-400/40 bg-sky-500/10 dark:bg-sky-400/10 px-5 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors hover:bg-sky-500/20 dark:hover:bg-sky-400/20"
        >
          {autoRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {autoRunning ? 'Stop' : 'Autocomplete'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setAutoRunning(false);
            setText('');
          }}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </motion.button>
      </div>

      <TrainingConsole lines={log} label="attention.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        Trained from scratch on a synthetic corpus — the bars are its real attention weights, not a
        canned animation, and Autocomplete is genuine sampling from its learned next-character
        distribution, one real forward pass at a time.
      </p>
    </div>
  );
}
