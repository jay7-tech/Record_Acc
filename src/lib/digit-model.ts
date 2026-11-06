import weightsData from './digit-model-weights.json';

type ModelExport = {
  inputSize: number;
  imageSize: number;
  layerSizes: number[];
  activation: 'relu';
  weights: number[][][]; // weights[layer] is a (inSize x outSize) matrix
  biases: number[][]; // biases[layer] is an outSize vector
  testAccuracy: number;
};

const model = weightsData as ModelExport;

export const MODEL_TEST_ACCURACY = model.testAccuracy;
export const MODEL_LAYER_SIZES = model.layerSizes; // [784, 64, 32, 10]
export const MODEL_IMAGE_SIZE = model.imageSize; // 28
/** The trained weight matrices, exposed so the network diagram can draw real, weight-driven connections. */
export const MODEL_WEIGHTS = model.weights;

function relu(v: number[]): number[] {
  return v.map((x) => (x > 0 ? x : 0));
}

function softmax(v: number[]): number[] {
  const max = Math.max(...v);
  const exps = v.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

/** out[j] = sum_i(in[i] * W[i][j]) + b[j] */
function denseForward(input: number[], weights: number[][], biases: number[]): number[] {
  const outSize = biases.length;
  const out = new Array(outSize).fill(0);
  for (let i = 0; i < input.length; i++) {
    const xi = input[i];
    if (xi === 0) continue;
    const row = weights[i];
    for (let j = 0; j < outSize; j++) {
      out[j] += xi * row[j];
    }
  }
  for (let j = 0; j < outSize; j++) out[j] += biases[j];
  return out;
}

export type ForwardPassResult = {
  /** Raw 28x28 input pixels, 0-1 — the exact bitmap fed into the network. */
  rawInput: number[];
  /** Activations for every layer after the input: [hidden1(64), hidden2(32), output(10) probabilities]. */
  layerActivations: number[][];
  /** Softmax probabilities over digits 0-9. */
  probabilities: number[];
  predictedDigit: number;
  confidence: number;
};

/** Runs the trained MNIST-digit MLP forward pass entirely in the browser. Input pixels must already be 0-1 normalized. */
export function runForwardPass(pixels01: number[]): ForwardPassResult {
  const h1 = relu(denseForward(pixels01, model.weights[0], model.biases[0]));
  const h2 = relu(denseForward(h1, model.weights[1], model.biases[1]));
  const logits = denseForward(h2, model.weights[2], model.biases[2]);
  const probabilities = softmax(logits);

  let predictedDigit = 0;
  let best = -Infinity;
  for (let i = 0; i < probabilities.length; i++) {
    if (probabilities[i] > best) {
      best = probabilities[i];
      predictedDigit = i;
    }
  }

  return {
    rawInput: pixels01,
    layerActivations: [h1, h2, probabilities],
    probabilities,
    predictedDigit,
    confidence: best,
  };
}
