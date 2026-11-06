'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { AnimatedSection } from '../animated-section';
import { DigitCanvas } from '../digit-canvas';
import { NeuralNetworkViz } from '../neural-network-viz';
import { runForwardPass, MODEL_TEST_ACCURACY, MODEL_LAYER_SIZES } from '@/lib/digit-model';

const ZERO_64 = new Array(64).fill(0);
const ZERO_LAYERS = [new Array(32).fill(0), new Array(16).fill(0), new Array(10).fill(0.1)];

export function AiPlaygroundSection() {
  const [rawInput, setRawInput] = useState<number[]>(ZERO_64);
  const [layerActivations, setLayerActivations] = useState<number[][]>(ZERO_LAYERS);
  const [predictedDigit, setPredictedDigit] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [hasInk, setHasInk] = useState(false);

  const handlePixels = useCallback((pixels: number[], ink: boolean) => {
    setHasInk(ink);
    if (!ink) {
      setRawInput(ZERO_64);
      setLayerActivations(ZERO_LAYERS);
      setConfidence(0);
      return;
    }
    const result = runForwardPass(pixels);
    setRawInput(result.rawInput);
    setLayerActivations(result.layerActivations);
    setPredictedDigit(result.predictedDigit);
    setConfidence(result.confidence);
  }, []);

  return (
    <AnimatedSection id="ai-playground">
      <div className="text-center">
        <p className="mono-label text-sm text-muted-foreground">/ 01 AI Playground</p>
        <h2 className="font-headline text-3xl md:text-4xl mt-2 flex items-center justify-center gap-3">
          <Brain className="h-7 w-7 text-signal" />
          Watch a Neural Network <span className="text-gradient-signal">Think</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          This isn&apos;t a screenshot. It&apos;s a real {MODEL_LAYER_SIZES.join('-')} neural network I trained
          from scratch, running forward-propagation live in your browser. Draw a digit and watch
          every neuron fire.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-center max-w-6xl mx-auto">
        <div className="flex justify-center">
          <DigitCanvas onPixels={handlePixels} />
        </div>

        <div className="relative rounded-3xl border border-sky-400/15 bg-gradient-to-br from-sky-400/[0.04] via-card/60 to-card/60 p-4 md:p-6 overflow-hidden">
          <NeuralNetworkViz
            rawInput={rawInput}
            layerActivations={layerActivations}
            predictedDigit={predictedDigit}
            hasInk={hasInk}
          />

          <AnimatePresence>
            {hasInk && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-signal/30 bg-background/80 backdrop-blur-md px-4 py-2 text-sm"
              >
                <Sparkles className="h-4 w-4 text-signal" />
                <span className="font-semibold text-foreground">
                  Predicted {predictedDigit}
                </span>
                <span className="text-muted-foreground">· {Math.round(confidence * 100)}% confident</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60 font-mono max-w-lg mx-auto">
        64 → 32 → 16 → 10 fully-connected network, trained with backprop · {Math.round(MODEL_TEST_ACCURACY * 100)}% held-out accuracy ·
        every connection drawn above is a real trained weight, scaled by its actual activation strength.
      </p>
    </AnimatedSection>
  );
}
