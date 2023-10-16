import { mkSet } from './utils';

const set = mkSet('fractions');

export const blankOverBlank = set({
  name: 'blank/blank',
  latex: '\\frac{}{}',
  command: '\\frac',
  ariaLabel: 'fraction',
});

export const xOverBlank = set({
  latex: '\\frac{x}{ }',
  name: 'X/blank',
  label: 'x/[]',
  command: '/',
  ariaLabel: 'x over blank fraction',
});

export const xBlankBlank = set({
  name: 'X (blank/blank)',
  latex: 'x\\frac{}{}',
  label: 'x([]/[])',
  command: '\\frac',
  ariaLabel: 'mixed number',
});
