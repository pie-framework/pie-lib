import { mkSet } from './utils';

const set = mkSet('constants');

export const pi = set({
  name: 'Pi',
  label: 'π',
  latex: '\\pi',
  command: '\\pi',
  category: 'constants'
});

export const eulers = set({
  name: 'Eulers',
  label: 'e',
  latex: 'e',
  command: 'e',
  category: 'constants'
});

export const infinity = set({
  name: 'Infinity',
  label: '\\infty',
  latex: '\\infty',
  command: '\\infty',
  category: 'constants'
});

export const halfInfinity = set({
  name: 'Half Infinity',
  label: '\\propto',
  latex: '\\propto',
  command: '\\propto',
  category: 'constants'
});
