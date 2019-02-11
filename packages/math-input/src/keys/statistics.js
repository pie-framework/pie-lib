import { mkSet } from './utils';

const set = mkSet('statistics');
export const xBar = set({
  name: 'X Bar',
  label: 'x̄',
  latex: '\\overline{x}',
  write: '\\overline{x}'
});

export const yBar = set({
  name: 'Y Bar',
  latex: '\\overline{y}',
  write: '\\overline{y}'
});

export const mu = set({
  name: 'mu',
  label: 'mu',
  latex: '\\mu',
  write: '\\mu'
});
