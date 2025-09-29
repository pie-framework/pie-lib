import { mkSet } from './utils';

const set = mkSet('sub-sup');

export const superscript = set({
  name: 'Superscript',
  latex: 'x^{}',
  command: '^',
});

export const subscript = set({
  name: 'Subscript',
  latex: 'x_{}',
  command: '_',
});
