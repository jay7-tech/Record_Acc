/**
 * Custom line-art icons for the five Lab tools.
 *
 * Deliberately not lucide's Brain/Sparkles/Hand — those read as generic
 * "AI SaaS" clip-art the moment anyone's seen two other AI products.
 * Each icon here is a literal, small drawing of what the tool actually
 * does (a handwritten digit, a scatter plot with a fitted line, a tiny
 * maze with a goal, an attention matrix, a hand's tracked keypoints),
 * so it reads as made-for-this rather than picked-from-a-library.
 *
 * Same prop shape as a lucide icon (className passes through to the
 * <svg>), so these drop in anywhere `<Icon className="h-6 w-6" />` is
 * already used.
 */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Digit Recognizer — a handwritten "7" sitting on a tiny pixel grid. */
export function DigitGlyphIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeOpacity="0.35" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M8 7.5h7.5L10.5 18" strokeWidth="2.1" />
    </svg>
  );
}

/** Regression Lab — a scatter of points with the fitted line drawn through them. */
export function ScatterFitIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.5 20.5V4M3.5 20.5h17" strokeOpacity="0.35" />
      <path d="M4.5 18.5 19 6" strokeWidth="2" />
      <circle cx="6.5" cy="16.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="10" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** RL Arena — a tiny maze grid, an agent cell, and the goal flag it's learning to reach. */
export function MazeGoalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeOpacity="0.35" />
      <path d="M3 9h7M10 9v7M10 16h8M14 3v6M14 13v8" strokeOpacity="0.45" strokeWidth="1.3" />
      <circle cx="6.2" cy="6.2" r="1.6" fill="currentColor" stroke="none" />
      <path d="M17.8 12.5v6M17.8 12.5l4 1.6-4 1.3" strokeWidth="1.4" />
    </svg>
  );
}

/** Attention Lab — a small token-to-token attention matrix with weighted links. */
export function AttentionGridIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="5" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <path d="M5 5 19 12M5 12 19 12M5 19 19 5" strokeWidth="2" />
      <path d="M5 5 19 19M5 19 19 19" strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}

/** Hand Tracker — the tracked keypoints and bones of a hand, not a hand silhouette. */
export function HandKeypointsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 21c-3.5 0-6-2.2-6-5.3v-3.4M6 12.3V7.6M9.2 11.5V5.3M12.4 11.3V4.8M15.6 12V6.8M15.6 12l2.6 1.1c1 .45 1.4 1.1 1.4 2.1v2c0 2.7-2.9 4.7-6.2 4.7" strokeWidth="1.5" />
      <circle cx="6" cy="12.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12.4" cy="11.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
