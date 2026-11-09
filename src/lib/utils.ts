import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Pulls the first hex color out of an arbitrary Tailwind class string like
 * "bg-[#7c3aed]/10" and returns it as an rgba() string at the given alpha.
 * Falls back to a neutral sky blue if no hex is found, so a project entry
 * missing a `color` field never breaks the card theming.
 */
export function hexToRgba(source: string | null | undefined, alpha: number): string {
  const fallback = { r: 56, g: 189, b: 248 }; // sky-400
  const match = source?.match(/#([0-9a-fA-F]{3,8})/);
  let r = fallback.r, g = fallback.g, b = fallback.b;

  if (match) {
    let hex = match[1];
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Like hexToRgba, but for solid accent TEXT and icon colors rather than
 * translucent fills/borders. A project's accent hex is chosen once and
 * used in both light and dark mode, but a flat hex that reads great on
 * a white card can disappear on a near-black one (and vice versa) — e.g.
 * MEMO's dark navy #2c3e50 is ~1.8:1 contrast on a dark card, effectively
 * invisible. Instead of a fixed color, this returns a CSS color-mix()
 * expression that blends the accent hue toward the current theme's
 * --foreground (near-black in light mode, near-white in dark mode). The
 * 60/40 mix ratio was chosen so every current project accent clears
 * roughly 5:1 contrast against the card background in BOTH themes, while
 * still reading as that project's own color rather than generic text.
 */
export function hexToAdaptiveText(source: string | null | undefined): string {
  const fallback = '#38bdf8'; // sky-400
  const match = source?.match(/#([0-9a-fA-F]{3,8})/);
  const hex = match ? `#${match[1]}` : fallback;
  return `color-mix(in srgb, ${hex} 60%, hsl(var(--foreground)) 40%)`;
}
