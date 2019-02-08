import {
  Approx,
  NotEqual,
  SameOrder,
  NotSameOrder,
  NotApprox,
  Cong,
  NotCong
} from './icons';

const set = o => ({ ...o, category: 'numbers' });

export const approx = set({
  name: 'Approx',
  icon: Approx,
  symbol: '&asyp;',
  command: '\\approx',
  shortcut: ''
});

export const notApprox = set({
  name: 'Not Approx',
  icon: NotApprox,
  symbol: '&nap;',
  command: '\\napprox',
  shortcut: ''
});

export const notEqual = set({
  name: 'Not Equal',
  icon: NotEqual,
  symbol: '&ne;',
  command: '\\ne',
  shortcut: ''
});

export const sameOrder = set({
  name: 'Same Order',
  icon: SameOrder,
  symbol: '&tilde;',
  command: '\\sim',
  shortcut: ''
});

export const notSameOrder = set({
  name: 'Not Same Order',
  icon: NotSameOrder,
  symbol: '&#8769;',
  command: '\\nsim',
  shortcut: ''
});

export const cong = set({
  name: 'Cong',
  icon: Cong,
  symbol: '&cong;',
  command: '\\cong',
  shortcut: ''
});

export const notCong = set({
  name: 'Not Cong',
  icon: NotCong,
  symbol: '&ncong;',
  command: '\\ncong',
  shortcut: ''
});
