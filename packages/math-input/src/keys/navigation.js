import { LEFT_ARROW, RIGHT_ARROW } from './chars';
import { mkSet } from './utils';

const set = mkSet('navigation');

export const left = set({ label: LEFT_ARROW, keystroke: 'Left', ariaLabel: 'Move cursor left' });

export const right = set({ label: RIGHT_ARROW, keystroke: 'Right', ariaLabel: 'Move cursor right' });
