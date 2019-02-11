import { mkSet } from './utils';

const set = mkSet('trigonometry');

export const sin = set({ name: 'sin', label: 'sin', latex: '\\sin' });

export const cos = set({ name: 'cos', label: 'cos', latex: '\\cos' });

export const tan = set({ name: 'tan', label: 'tan', latex: '\\tan' });
export const sec = set({ name: 'sec', label: 'sec', latex: '\\sec' });
export const csc = set({ name: 'csc', label: 'csc', latex: '\\csc' });
export const cot = set({ name: 'cot', label: 'cot', latex: '\\cot' });
