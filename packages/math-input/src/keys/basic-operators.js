import { DIVIDE, MULTIPLY } from './chars';
import { mkSet } from './utils';

const set = mkSet('operators');

export const equals = set({
  write: '=',
  label: '='
});

export const plus = set({
  write: '+',
  label: '+'
});

export const minus = set({
  write: '−',
  label: '−'
});

export const divide = set({
  name: 'divide',
  label: DIVIDE,
  command: '\\divide'
});

export const multiply = set({
  name: 'multiply',
  label: MULTIPLY,
  command: '\\times'
});
