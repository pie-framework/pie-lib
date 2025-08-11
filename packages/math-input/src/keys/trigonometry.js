import { mkSet } from './utils';

const set = mkSet('trigonometry');

export const sin = set({ name: 'sine', label: 'sin', command: '\\sin', latex: '\\sin' });

export const cos = set({ name: 'cosine', label: 'cos', command: '\\cos', latex: '\\cos' });

export const tan = set({ name: 'tanget', label: 'tan', command: '\\tan', latex: '\\tan' });

export const sec = set({ name: 'secant', label: 'sec', command: '\\sec', latex: '\\sec' });

export const csc = set({ name: 'cosecant', label: 'csc', command: '\\csc', latex: '\\csc' });

export const cot = set({ name: 'cotangent', label: 'cot', command: '\\cot', latex: '\\cot' });
