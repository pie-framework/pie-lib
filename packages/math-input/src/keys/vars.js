import { mkSet } from './utils';

const set = mkSet('vars');

export const x = set({
  name: 'X',
  latex: 'x',
  write: 'x'
});
export const y = set({
  name: 'Y',
  latex: 'y',
  write: 'y'
});
