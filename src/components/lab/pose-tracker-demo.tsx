'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { useIsDark } from '@/lib/use-is-dark';
import { getLabPalette } from '@/lib/lab-palette';
import { TrainingConsole } from './training-console';

// 21-landmark hand skeleton connections (MediaPipe Hands topology)
const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

type Status = 'idle' | 'requesting' | 'loading-model' | 'running' | 'denied' | 'error';

/**
 * Real-time hand tracking using a pretrained TensorFlow.js model
 * (MediaPipe Hands, tfjs runtime) running entirely client-side — the
 * video never leaves the browser. Loaded lazily on request so the rest
 * of the Lab never pays for TensorFlow.js's bundle size.
 */
export function PoseTrackerDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const isDark = useIsDark();
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const [status, setStatus] = useState<Status>('idle');
  const [handCount, setHandCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [log, setLog] = useState<string[]>(['camera idle — click Start to load the hand tracking model']);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-30), line]);
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    detectorRef.current = null;
    setStatus('idle');
    setHandCount(0);
    pushLog('camera stopped — stream released');
  }, [pushLog]);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(async () => {
    setStatus('requesting');
    pushLog('requesting camera access…');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 }, audio: false });
    } catch {
      setStatus('denied');
      pushLog('camera permission denied or unavailable');
      return;
    }
    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    await video.play();

    setStatus('loading-model');
    pushLog('loading TensorFlow.js hand tracking model…');
    try {
      const tf = await import('@tensorflow/tfjs-core');
      await import('@tensorflow/tfjs-backend-webgl');
      const handpose = await import('@tensorflow-models/handpose');
      await tf.ready();
      const model = await handpose.load();
      detectorRef.current = model;
      pushLog('model loaded — tracking live, 21 landmarks per hand');
    } catch (err) {
      console.error(err);
      setStatus('error');
      pushLog('model failed to load — your connection or browser may be blocking it');
      return;
    }

    setStatus('running');
    let lastFpsTime = performance.now();
    let frames = 0;
    let lastLogTime = 0;

    const loop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;
      if (!video || !canvas || !detector) return;

      const predictions = await detector.estimateHands(video, false);
      const hands = predictions.filter((p: any) => p.handInViewConfidence > 0.85);
      setHandCount(hands.length);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = video.videoWidth || 480;
        const h = video.videoHeight || 360;
        if (canvas.width !== w) {
          canvas.width = w;
          canvas.height = h;
        }
        const pal = getLabPalette(isDarkRef.current);
        ctx.save();
        ctx.clearRect(0, 0, w, h);
        ctx.translate(w, 0);
        ctx.scale(-1, 1);

        for (const hand of hands) {
          const kp = hand.landmarks as [number, number, number][];
          ctx.strokeStyle = pal.positive(0.85);
          ctx.lineWidth = 2.5;
          for (const [a, b] of CONNECTIONS) {
            if (!kp[a] || !kp[b]) continue;
            ctx.beginPath();
            ctx.moveTo(kp[a][0], kp[a][1]);
            ctx.lineTo(kp[b][0], kp[b][1]);
            ctx.stroke();
          }
          kp.forEach(([x, y], i) => {
            const r = i === 0 ? 10 : 6;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, i === 0 ? '#fbbf24' : '#38bdf8');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.restore();
      }

      frames++;
      const now = performance.now();
      if (now - lastFpsTime > 500) {
        setFps(Math.round((frames * 1000) / (now - lastFpsTime)));
        frames = 0;
        lastFpsTime = now;
      }
      if (hands.length > 0 && now - lastLogTime > 2500) {
        lastLogTime = now;
        pushLog(`tracking ${hands.length} hand${hands.length > 1 ? 's' : ''} · 21 landmarks each, live`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [pushLog]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-sky-500/20 dark:border-sky-400/20 bg-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.08)]" style={{ aspectRatio: '4/3' }}>
        <video ref={videoRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-90" muted playsInline />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

        {status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/90 text-center px-6">
            {status === 'loading-model' || status === 'requesting' ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                <p className="text-sm text-slate-300">{status === 'requesting' ? 'Requesting camera access…' : 'Loading the hand-tracking model…'}</p>
              </>
            ) : status === 'denied' ? (
              <>
                <CameraOff className="h-8 w-8 text-rose-400" />
                <p className="text-sm text-slate-300">Camera access was denied. Allow camera permission and try again.</p>
                <button onClick={start} className="rounded-full border border-sky-400/40 bg-sky-400/10 px-5 py-2 text-sm text-sky-200 hover:bg-sky-400/20">
                  Try again
                </button>
              </>
            ) : status === 'error' ? (
              <>
                <CameraOff className="h-8 w-8 text-rose-400" />
                <p className="text-sm text-slate-300">The model couldn't load. Check your connection and try again.</p>
                <button onClick={start} className="rounded-full border border-sky-400/40 bg-sky-400/10 px-5 py-2 text-sm text-sky-200 hover:bg-sky-400/20">
                  Try again
                </button>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 text-sky-400" />
                <p className="max-w-xs text-sm text-slate-300">
                  A real pretrained deep learning model tracks your hand live, 21 points per hand, entirely in your browser. Nothing is uploaded.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={start}
                  className="flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-5 py-2.5 text-sm font-medium text-sky-200 hover:bg-sky-400/20"
                >
                  <Camera className="h-4 w-4" />
                  Start Camera
                </motion.button>
              </>
            )}
          </div>
        )}

        {status === 'running' && (
          <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 font-mono text-[11px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {fps} fps · {handCount} hand{handCount === 1 ? '' : 's'}
          </div>
        )}
      </div>

      {status === 'running' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={stop}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-rose-400/50 hover:text-rose-500"
        >
          <CameraOff className="h-3.5 w-3.5" />
          Stop Camera
        </motion.button>
      )}

      <TrainingConsole lines={log} label="vision.log" />
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 text-center max-w-md">
        Runs a pretrained MediaPipe Hands model via TensorFlow.js, fully on device. Your camera
        feed is processed in your browser and never sent anywhere.
      </p>
    </div>
  );
}
