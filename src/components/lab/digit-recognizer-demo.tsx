'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { DigitCanvas } from '../digit-canvas';
import { NeuralNetworkViz } from '../neural-network-viz';
import { ModelInputPreview } from '../model-input-preview';
import { TrainingConsole } from './training-console';
import { runForwardPass, MODEL_TEST_ACCURACY, MODEL_LAYER_SIZES, MODEL_IMAGE_SIZE } from '@/lib/digit-model';
import idleExamples from '@/lib/digit-idle-examples.json';

const ZERO_INPUT = new Array(MODEL_LAYER_SIZES[0]).fill(0);
const ZERO_LAYERS = [
  new Array(MODEL_LAYER_SIZES[1]).fill(0),
  new Array(MODEL_LAYER_SIZES[2]).fill(0),
  new Array(MODEL_LAYER_SIZES[3]).fill(0.1),
];

export function DigitRecognizerDemo() {
  const [rawInput, setRawInput] = useState<number[]>(ZERO_INPUT);
  const [layerActivations, setLayerActivations] = useState<number[][]>(ZERO_LAYERS);
  const [predictedDigit, setPredictedDigit] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [hasInk, setHasInk] = useState(false);
  const [idleMode, setIdleMode] = useState(true);
  const [log, setLog] = useState<string[]>(['model loaded — 784 → 64 → 32 → 10, 96% held out accuracy']);
  const idleIndexRef = useRef(0);
  const resumeIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const runIdleExample = useCallback(() => {
    const ex = idleExamples[idleIndexRef.current % idleExamples.length];
    idleIndexRef.current += 1;
    const result = runForwardPass(ex.pixels);
    setRawInput(result.rawInput);
    setLayerActivations(result.layerActivations);
    setPredictedDigit(result.predictedDigit);
    setConfidence(result.confidence);
    pushLog(`sample digit ${ex.digit} → predicted ${result.predictedDigit} (${Math.round(result.confidence * 100)}%)`);
  }, [pushLog]);

  useEffect(() => {
    if (!idleMode) return;
    runIdleExample();
    const interval = setInterval(runIdleExample, 2600);
    return () => clearInterval(interval);
  }, [idleMode, runIdleExample]);

  const handlePixels = useCallback((pixels: number[], ink: boolean) => {
    setIdleMode(false);
    setHasInk(ink);
    if (resumeIdleTimerRef.current) clearTimeout(resumeIdleTimerRef.current);

    if (!ink) {
      setRawInput(ZERO_INPUT);
      setLayerActivations(ZERO_LAYERS);
      setConfidence(0);
      resumeIdleTimerRef.current = setTimeout(() => setIdleMode(true), 7000);
      return;
    }
    const result = runForwardPass(pixels);
    setRawInput(result.rawInput);
    setLayerActivations(result.layerActivations);
    setPredictedDigit(result.predictedDigit);
    setConfidence(result.confidence);
    pushLog(`forward pass → layer1 peak ${Math.max(...result.layerActivations[0]).toFixed(2)}, predicted ${result.predictedDigit} (${Math.round(result.confidence * 100)}%)`);
  }, [pushLog]);

  useEffect(() => () => {
    if (resumeIdleTimerRef.current) clearTimeout(resumeIdleTimerRef.current);
  }, []);

  return (
    <div>
      <p className="text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-4 sm:mb-10">
        A real {MODEL_LAYER_SIZES.join('-')} network, trained on handwritten digits with backprop —
        running live in your browser.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 sm:gap-10 items-center">
        <div className="flex flex-col items-center gap-4">
          <DigitCanvas onPixels={handlePixels} />
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>what the model sees</span>
            <ModelInputPreview pixels={rawInput} size={MODEL_IMAGE_SIZE} displaySize={56} />
          </div>
        </div>

        <div className="relative rounded-3xl border border-sky-500/15 dark:border-sky-400/15 bg-slate-50 dark:bg-[#0a0e17] p-4 md:p-6 overflow-hidden">
          <NeuralNetworkViz
            rawInput={rawInput}
            layerActivations={layerActivations}
            predictedDigit={predictedDigit}
            hasInk={hasInk || idleMode}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={idleMode ? 'idle' : hasInk ? 'live' : 'empty'}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-4 right-4 flex items-center gap-3 rounded-2xl border border-sky-500/30 dark:border-sky-400/30 bg-white/85 dark:bg-black/70 backdrop-blur-xl pl-2.5 pr-4 py-2 shadow-[0_8px_28px_-8px_rgba(56,189,248,0.5)]"
            >
              {idleMode ? (
                <>
                  {/* "box" the user wants more impressive: a glowing gradient chip instead of a bare icon */}
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-[0_0_16px_rgba(56,189,248,0.6)]">
                    <Wand2 className="h-4 w-4 text-white" />
                    <motion.span
                      className="absolute inset-0 rounded-xl border border-white/40"
                      animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.4, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Watching it think</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">digit {predictedDigit} · {Math.round(confidence * 100)}% sure</span>
                  </div>
                </>
              ) : hasInk ? (
                <>
                  {/* the predicted digit itself IS the icon now — a gradient badge with a pulsing ring and a sparkle accent */}
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 text-base font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.65)]">
                    {predictedDigit}
                    <motion.span
                      className="absolute -inset-0.5 rounded-xl border-2 border-white/50"
                      animate={{ opacity: [0.9, 0.2, 0.9] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <Sparkles className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-amber-300 drop-shadow-[0_0_4px_rgba(252,211,77,0.9)]" />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Predicted {predictedDigit}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1 w-14 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(confidence * 100)}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{Math.round(confidence * 100)}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-slate-700/60">
                    <Sparkles className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Draw something</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex justify-center">
        <TrainingConsole lines={log} label="inference.log" />
      </div>

      <p className="mt-3 sm:mt-6 text-center text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono max-w-xl mx-auto">
        {Math.round(MODEL_TEST_ACCURACY * 100)}% held out accuracy · every connection above is a real trained weight.
      </p>
    </div>
  );
}
