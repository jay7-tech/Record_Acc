export type LabPalette = {
  canvasBg: string;
  gridLine: string;
  border: string;
  text: string;
  textDim: string;
  positive: (alpha: number) => string;
  negative: (alpha: number) => string;
  nodeGlowRGB: string; // "r,g,b" for node fill gradients
  nodeCoreRGB: string;
  pointFill: string;
  pointStroke: string;
  accentRGB: string; // sky accent as "r,g,b"
};

const DARK: LabPalette = {
  canvasBg: '#05070c',
  gridLine: 'rgba(148,163,184,0.12)',
  border: 'rgba(148,163,184,0.3)',
  text: 'rgba(226,232,240,0.9)',
  textDim: 'rgba(148,163,184,0.65)',
  positive: (a) => `rgba(56,189,248,${a})`,
  negative: (a) => `rgba(248,113,113,${a})`,
  nodeGlowRGB: '56,189,248',
  nodeCoreRGB: '245,250,255',
  pointFill: '#f5faff',
  pointStroke: 'rgba(56,189,248,0.85)',
  accentRGB: '56,189,248',
};

const LIGHT: LabPalette = {
  canvasBg: '#f8fafc',
  gridLine: 'rgba(71,85,105,0.12)',
  border: 'rgba(71,85,105,0.25)',
  text: 'rgba(15,23,42,0.88)',
  textDim: 'rgba(71,85,105,0.7)',
  positive: (a) => `rgba(2,132,199,${a})`,
  negative: (a) => `rgba(220,38,38,${a})`,
  nodeGlowRGB: '2,132,199',
  nodeCoreRGB: '14,116,144',
  pointFill: '#0c4a6e',
  pointStroke: 'rgba(2,132,199,0.85)',
  accentRGB: '2,132,199',
};

export function getLabPalette(isDark: boolean): LabPalette {
  return isDark ? DARK : LIGHT;
}
