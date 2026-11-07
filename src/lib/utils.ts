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
