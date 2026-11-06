import rawWeights from './attn-model-weights.json';

/**
 * A tiny decoder-only transformer (2 layers, 4 attention heads, 64-dim
 * model), trained from scratch on a synthetic English corpus with a
 * genuine PyTorch training loop (train_transformer.py) and exported here
 * as plain numbers. This file re-implements its forward pass — embeddings,
 * causal self-attention, feed-forward, layer norm, output head — by hand
 * in TypeScript, with no ML library, mirroring how digit-model.ts hand-
 * ports the MNIST classifier. It also returns the raw attention weights
 * so the UI can show which earlier characters the model is actually
 * weighing when it predicts the next one.
 */

type LayerWeights = {
  ln1_w: number[];
  ln1_b: number[];
  qkv_w: number[][];
  qkv_b: number[];
  proj_w: number[][];
  proj_b: number[];
  ln2_w: number[];
  ln2_b: number[];
  ff1_w: number[][];
  ff1_b: number[];
  ff2_w: number[][];
  ff2_b: number[];
};

type ModelWeights = {
  vocab: string[];
  blockSize: number;
  dModel: number;
  nHead: number;
  headDim: number;
  nLayer: number;
  dFF: number;
  tokEmb: number[][];
  posEmb: number[][];
  lnF_w: number[];
  lnF_b: number[];
  headW: number[][];
  headB: number[];
  layers: LayerWeights[];
};

const W = rawWeights as unknown as ModelWeights;

export const VOCAB = W.vocab;
export const BLOCK_SIZE = W.blockSize;
export const D_MODEL = W.dModel;
export const N_HEAD = W.nHead;
export const HEAD_DIM = W.headDim;

const charToIdx = new Map<string, number>(VOCAB.map((c, i) => [c, i]));

/** Maps any typed character to the closest thing the model's vocab understands. */
export function cleanChar(c: string): string {
  const lower = c.toLowerCase();
  if (charToIdx.has(lower)) return lower;
  if (/\s/.test(c)) return ' ';
  return ' ';
}

function linear(x: number[], w: number[][], b: number[]): number[] {
  const out = new Array(w.length).fill(0);
  for (let o = 0; o < w.length; o++) {
    let sum = b[o];
    const row = w[o];
    for (let i = 0; i < x.length; i++) sum += x[i] * row[i];
    out[o] = sum;
  }
  return out;
}

function layerNorm(x: number[], w: number[], b: number[]): number[] {
  const n = x.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  let variance = 0;
  for (let i = 0; i < n; i++) variance += (x[i] - mean) * (x[i] - mean);
  variance /= n;
  const inv = 1 / Math.sqrt(variance + 1e-5);
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = (x[i] - mean) * inv * w[i] + b[i];
  return out;
}

function softmax(xs: number[]): number[] {
  const max = Math.max(...xs);
  const exps = xs.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export type ForwardResult = {
  logits: number[];
  probs: number[];
  /** attention weights of the final layer, from the LAST token's query to every token: [head][keyIndex] */
  lastLayerAttention: number[][];
  tokens: string[];
};

/**
 * Runs the full causal forward pass over `text` (truncated to the model's
 * context window) and returns next-character logits/probabilities plus
 * the final layer's attention pattern for the last token.
 */
export function runAttentionForwardPass(text: string): ForwardResult {
  const chars = text.split('').map(cleanChar).slice(-BLOCK_SIZE);
  const T = chars.length;
  if (T === 0) {
    return { logits: [], probs: [], lastLayerAttention: [], tokens: [] };
  }

  // x[t] = token embedding + positional embedding, for each position t
  let x: number[][] = chars.map((c, t) => {
    const tokIdx = charToIdx.get(c)!;
    const emb = W.tokEmb[tokIdx];
    const pos = W.posEmb[t];
    return emb.map((v, i) => v + pos[i]);
  });

  let lastLayerAttention: number[][] = [];

  for (let layerIdx = 0; layerIdx < W.nLayer; layerIdx++) {
    const L = W.layers[layerIdx];

    // --- self attention ---
    const normed = x.map((row) => layerNorm(row, L.ln1_w, L.ln1_b));
    const qkv = normed.map((row) => linear(row, L.qkv_w, L.qkv_b)); // T x (3*dModel)

    // split into per-head q,k,v: qkv[t] = [q(dModel) | k(dModel) | v(dModel)]
    const heads: number[][][] = []; // [head] -> T x headDim attention output
    const attnByHead: number[][][] = []; // [head][queryT][keyT]

    for (let h = 0; h < N_HEAD; h++) {
      const qh: number[][] = [];
      const kh: number[][] = [];
      const vh: number[][] = [];
      for (let t = 0; t < T; t++) {
        const base = h * HEAD_DIM;
        qh.push(qkv[t].slice(base, base + HEAD_DIM));
        kh.push(qkv[t].slice(D_MODEL + base, D_MODEL + base + HEAD_DIM));
        vh.push(qkv[t].slice(2 * D_MODEL + base, 2 * D_MODEL + base + HEAD_DIM));
      }

      const scale = 1 / Math.sqrt(HEAD_DIM);
      const attnRows: number[][] = [];
      const outT: number[][] = [];
      for (let t = 0; t < T; t++) {
        const scores: number[] = [];
        for (let s = 0; s <= t; s++) {
          let dot = 0;
          for (let d = 0; d < HEAD_DIM; d++) dot += qh[t][d] * kh[s][d];
          scores.push(dot * scale);
        }
        const weights = softmax(scores); // length t+1
        attnRows.push(weights);
        const outRow = new Array(HEAD_DIM).fill(0);
        for (let s = 0; s <= t; s++) {
          for (let d = 0; d < HEAD_DIM; d++) outRow[d] += weights[s] * vh[s][d];
        }
        outT.push(outRow);
      }
      heads.push(outT);
      attnByHead.push(attnRows);
    }

    // concat heads back to dModel, then output projection
    const concat: number[][] = [];
    for (let t = 0; t < T; t++) {
      const row: number[] = [];
      for (let h = 0; h < N_HEAD; h++) row.push(...heads[h][t]);
      concat.push(row);
    }
    const attnOut = concat.map((row) => linear(row, L.proj_w, L.proj_b));
    x = x.map((row, t) => row.map((v, i) => v + attnOut[t][i]));

    if (layerIdx === W.nLayer - 1) {
      // attention from the LAST token to every token it can see, per head
      const lastT = T - 1;
      lastLayerAttention = attnByHead.map((rows) => {
        const row = rows[lastT];
        // pad to length T for a stable UI shape (rows for t < lastT are shorter)
        const padded = new Array(T).fill(0);
        for (let i = 0; i < row.length; i++) padded[i] = row[i];
        return padded;
      });
    }

    // --- feed forward ---
    const normed2 = x.map((row) => layerNorm(row, L.ln2_w, L.ln2_b));
    const ff = normed2.map((row) => {
      const h1 = linear(row, L.ff1_w, L.ff1_b).map((v) => Math.max(0, v));
      return linear(h1, L.ff2_w, L.ff2_b);
    });
    x = x.map((row, t) => row.map((v, i) => v + ff[t][i]));
  }

  const finalNormed = x.map((row) => layerNorm(row, W.lnF_w, W.lnF_b));
  const lastHidden = finalNormed[finalNormed.length - 1];
  const logits = linear(lastHidden, W.headW, W.headB);
  const probs = softmax(logits);

  return { logits, probs, lastLayerAttention, tokens: chars };
}

/** Samples the next character from a probability distribution with temperature + top-k cutoff. */
export function sampleNext(probs: number[], temperature = 0.65): number {
  const logits = probs.map((p) => Math.log(Math.max(p, 1e-9)) / temperature);
  const resampled = softmax(logits);
  let r = Math.random();
  for (let i = 0; i < resampled.length; i++) {
    r -= resampled[i];
    if (r <= 0) return i;
  }
  return resampled.length - 1;
}

export function topK(probs: number[], k: number): { char: string; p: number }[] {
  return probs
    .map((p, i) => ({ char: VOCAB[i], p }))
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}
