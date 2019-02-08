import { mkSet } from './utils';
import { Fraction } from './icons';

const set = mkSet('fractions');

export const xOverBlank = set({
  latex: '\\frac{x}{ }',
  name: 'X/blank',
  label: 'x/[]',
  command: '/',
  icon: Fraction
});

export const xBlankBlank = set({
  name: 'X (blank/blank)',
  latex: 'x\\frac{}{}',
  label: 'x([]/[])',
  command: '\\frac'
});
