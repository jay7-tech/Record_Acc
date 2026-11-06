'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import { Building2, Maximize2, FileText, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Experience = {
  role: string;
  organization: string;
  category: string;
  details: string[];
  images: string[];
};

/**
 * Full, always-visible showcase card for the experiences that carry real
 * proof (a certificate) — no click-to-expand. Mouse-tracked tilt + a
 * cursor spotlight on the whole card, and the certificate panel itself
 * zooms and offers a full-size view on hover/click.
 */
export function ExperienceShowcaseCard({ exp, index, total }: { exp: Experience; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 150, damping: 22, mass: 0.5 });
  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3]);

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, hsl(var(--signal) / 0.1), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const image = exp.images?.[0];
  const isPdf = image?.toLowerCase().endsWith('.pdf');
  // Certificates vary wildly in shape (scanned portraits, wide landscapes).
  // Size the frame to the image's own ratio instead of forcing one box,
  // clamped so nothing gets absurdly tall or wide.
  const [imgRatio, setImgRatio] = useState(4 / 3);
  const clampedRatio = Math.min(1.7, Math.max(0.65, imgRatio));
  const indexLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');
  const uniqueTop = 80 + index * 50;

  return (
    <motion.div
      style={{ position: 'sticky', top: `${uniqueTop}px`, zIndex: index + 10 }}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 50 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20, duration: 0.8 } },
      }}
      className="group relative isolate"
    >
      <div className="glow-border absolute inset-0 rounded-3xl" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1200 }}
        className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-sky-400/[0.06] via-card/90 to-card/90 border border-sky-400/15 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-700 hover:border-sky-400/30 hover:shadow-[0_30px_60px_-10px_hsl(var(--signal)/0.2)]"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlightBackground }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 px-8 items-center relative z-10">

          {/* Certificate panel — always visible, zooms on hover */}
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-6 relative block rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-xl group/cert"
            style={{ aspectRatio: clampedRatio }}
          >
            {image && !isPdf && (
              <>
                <Image src={image} alt="" fill className="object-cover blur-2xl opacity-60 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/40" />
                <Image
                  src={image}
                  alt={`${exp.role} certificate`}
                  fill
                  className="object-contain relative z-10 transition-transform duration-500 group-hover/cert:scale-105"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) setImgRatio(naturalWidth / naturalHeight);
                  }}
                />
              </>
            )}
            {image && isPdf && (
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileText className="h-10 w-10 opacity-60" />
                <span className="text-sm font-medium">Certificate (PDF)</span>
              </div>
            )}
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover/cert:bg-black/30 group-hover/cert:opacity-100">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/20">
                <Maximize2 className="h-4 w-4" />
                View Certificate
              </div>
            </div>
          </a>

          {/* Details */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="mono-label text-xs text-signal/80">{indexLabel} / {totalLabel}</span>
              <Badge className="rounded-md border-none bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                {exp.category}
              </Badge>
            </div>

            <div>
              <h3 className="font-headline text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                {exp.role}
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Activity className="h-5 w-5 text-primary/60" />
                </motion.div>
              </h3>
              <div className="mt-1 flex items-center gap-2 text-lg font-medium text-foreground/80">
                <Building2 className="h-4 w-4 text-signal" />
                {exp.organization}
              </div>
            </div>

            <ul className="space-y-3">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal/60" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
