import { mkSet } from './utils';

const set = mkSet('logic');

export const therefore = set({
  name: 'Therefore',
  label: '∴',
  write: '∴',
});

export const longDivision = set({
  name: 'Long division',
  latex: '\\longdiv{}',
  command: '\\longdiv',
});
