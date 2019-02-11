import { LEFT_ARROW, RIGHT_ARROW } from './chars';
import { mkSet } from './utils';

const set = mkSet('navigation');

export const left = set({ label: LEFT_ARROW, keystroke: 'Left' });

export const right = set({ label: RIGHT_ARROW, keystroke: 'Right' });
