import { mkSet } from './utils';

const set = mkSet('exponent');

export const squared = set({
  name: 'Squared',
  latex: 'x^2',
  write: '^2',
});

export const xToPowerOfN = set({
  name: 'X to the power of n',
  latex: 'x^{}',
  command: '^',
  ariaLabel: 'exponent',
});

export const squareRoot = set({
  name: 'Square root',
  latex: '\\sqrt{}',
  command: '\\sqrt',
});

export const nthRoot = set({
  name: 'Nth root',
  latex: '\\sqrt[{}]{}',
  command: '\\nthroot',
});
