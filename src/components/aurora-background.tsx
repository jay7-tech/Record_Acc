/**
 * Soft, slowly-drifting mesh-gradient blobs layered behind the content —
 * the ambient depth treatment used across most premium product sites
 * (Linear, Vercel, Stripe). Pure CSS: a few blurred, animated radial
 * gradients, no canvas or JS cost. Sits behind the existing star field,
 * additive rather than a replacement for it.
 */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      <div
        className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-signal/15 blur-[120px] animate-float-slow"
        style={{ animationDelay: '-2s' }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/10 blur-[120px] animate-float-slow"
        style={{ animationDelay: '-4s' }}
      />
    </div>
  );
}
