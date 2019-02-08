import { mkSet } from './utils';

const set = mkSet('statistics');
export const xBar = set({
  name: 'X Bar',
  label: 'x̄',
  write: 'x̄'
});

export const yBar = set({
  name: 'Y Bar',
  label: 'ȳ',
  write: 'ȳ'
});

export const mu = set({
  name: 'mu',
  label: 'mu',
  // label: 'μ',
  write: '\\mu'
});
