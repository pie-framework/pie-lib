import { mkSet } from './utils';

const set = mkSet('misc');

export const plusMinus = set({
  name: 'Plus/Minus',
  latex: '\\pm',
  write: '\\pm'
});

export const absValue = set({
  name: 'Absolute Value',
  latex: '\\abs{}',
  symbol: '| |',
  command: '|'
});

export const parenthesis = set({
  name: 'Parenthesis',
  latex: '()',
  command: '('
});

export const brackets = set({
  name: 'Brackets',
  latex: '[ ]',
  command: '['
});

export const percentage = set({
  name: 'Percentage',
  latex: '%',
  command: '%'
});

export const approx = set({
  latex: '\\approx',
  command: '\\approx'
});

export const nApprox = set({
  latex: '\\napprox',
  command: '\\napprox'
});

export const notEqual = set({
  latex: '\\neq',
  command: '\\neq'
});

export const similar = set({
  latex: '\\sim',
  command: '\\sim'
});
export const notSimilar = set({
  latex: '\\nsim',
  command: '\\nsim'
});
