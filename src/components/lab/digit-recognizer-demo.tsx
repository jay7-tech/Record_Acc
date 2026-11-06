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
  const [log, setLog] = useState<string[]>(['model loaded — 784-64-32-10, 96% held-out accuracy']);
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
              key={idleMode ? 'idle' : 'live'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-sky-500/30 dark:border-sky-400/30 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 text-sm"
            >
              {idleMode ? (
                <>
                  <Wand2 className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Watching it think</span>
                  <span className="text-slate-500 dark:text-slate-400">· digit {predictedDigit} · {Math.round(confidence * 100)}%</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {hasInk ? `Predicted ${predictedDigit}` : 'Draw something'}
                  </span>
                  {hasInk && <span className="text-slate-500 dark:text-slate-400">· {Math.round(confidence * 100)}% confident</span>}
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
        {Math.round(MODEL_TEST_ACCURACY * 100)}% held-out accuracy · every connection above is a real trained weight.
      </p>
    </div>
  );
}
