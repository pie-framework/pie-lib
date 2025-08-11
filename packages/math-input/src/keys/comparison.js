const set = (o) => ({ ...o, category: 'comparison' });

export const lessThan = set({
  name: 'Less than',
  latex: '<',
  command: '\\lt',
});

export const greaterThan = set({
  name: 'Greater than',
  latex: '>',
  command: '\\gt',
});

export const lessThanEqual = set({
  name: 'Less than or equal',
  latex: '\\le',
  symbol: '<=',
  command: '\\le',
  ariaLabel: 'less than or equal to',
});

export const greaterThanEqual = set({
  name: 'Greater than or equal',
  symbol: '>=',
  command: '\\ge',
  latex: '\\ge',
});
