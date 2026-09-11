import { mkSet } from './utils';

const set = mkSet('misc');

export const plusMinus = set({
  name: 'Plus or Minus',
  latex: '\\pm',
  write: '\\pm',
});

export const absValue = set({
  name: 'Absolute Value',
  latex: '\\abs{}',
  symbol: '| |',
  command: '|',
});

export const parenthesis = set({
  name: 'Parenthesis',
  latex: '\\left(\\right)',
  symbol: '( )',
  command: '(',
});

export const brackets = set({
  name: 'Brackets',
  latex: '\\left[\\right]',
  symbol: '[ ]',
  command: '[',
});

// `%` must be escaped. MathQuill was not a real LaTeX parser: it defined
// `LatexCmds['%']` as a symbol that *serialised* to `\%`, so a bare `%` worked
// both as a label and as a command. MathLive parses LaTeX properly, where `%`
// begins a comment - it rendered nothing (a blank button) and, once inserted,
// silently swallowed the rest of the expression. `\%` is what MathQuill stored
// all along, so this changes the key only, not the saved latex.
export const percentage = set({
  name: 'Percent',
  latex: '\\%',
  command: '\\%',
});

export const approx = set({
  latex: '\\approx',
  command: '\\approx',
  ariaLabel: 'Approximately equal to',
});

export const nApprox = set({
  latex: '\\napprox',
  command: '\\napprox',
  ariaLabel: 'Not pproximately equal to',
});

export const notEqual = set({
  latex: '\\neq',
  command: '\\neq',
  ariaLabel: 'Not equals',
});

export const similar = set({
  latex: '\\sim',
  command: '\\sim',
  ariaLabel: 'Similar',
});
export const notSimilar = set({
  latex: '\\nsim',
  command: '\\nsim',
  ariaLabel: 'Not similar',
});
